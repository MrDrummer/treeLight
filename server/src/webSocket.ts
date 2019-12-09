import WebSocket from "ws"
import {
  ESocketCommand, ESocketPattern, ESocketState, ISocket, ISocketCommand, ISocketInfo, ISocketType
} from "./models"

let globalCommand: ISocketCommand = {
  command: ESocketCommand.SET_PATTERN,
  value: ESocketPattern.RAINBOW
}
export const socket = new WebSocket.Server({ port: 8041 })
import { serial } from "./serial"

socket.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    // console.log("RECEIVED:", message)
    try {
      const parsed = parseData(message)
      // console.log("parsed :", parsed)
      if (isCommand(parsed.data)) {
        // console.log("IS A COMMAND")
        const command = getCommandFromData(parsed.data)
        // SET NEW LIGHT PATTERN HERE
        setNewCommand(command)
      } else if (parsed.data.message === "ready") {
        console.log(`New connection, sending initial command "${ globalCommand.value }"`)
        // console.log("globalCommand :", globalCommand)
        if (isCommand(globalCommand)) sendMessage(ws, ISocketType.COMMAND, globalCommand)
      }
    } catch (e) {
      console.error("issue parsing data", e)
      const info: ISocketInfo = {
        state: ESocketState.ERROR,
        message: "Message was not parsable"
      }
      sendMessage(ws, ISocketType.MESSAGE, info)
    }
  })

  ws.send(JSON.stringify({ timestamp: new Date(), data: "Live Update!" }))
})

export const setNewCommand = (command: ISocketCommand) => {
  let cmdVal = "0"
  switch (command.value) {
    case ESocketPattern.WIPE:
      cmdVal = "1"
      break
    case ESocketPattern.CHASE:
      cmdVal = "2"
      break
    case ESocketPattern.RAINBOW:
      cmdVal = "3"
      break
    default:
      break
  }
  serial.write(cmdVal, (error) => {
    if (error) {
      console.error("setNewCommand: There was an error", error)
    }
    broadcast(ISocketType.COMMAND, command)
    globalCommand = command
    console.log("NEW STATE:", globalCommand.value)
  })
}

const isCommand = (data: ISocketInfo | ISocketCommand): data is ISocketCommand => {
  // console.log("typeof data :", data)
  return typeof data === "object" && data.hasOwnProperty("command") && data.hasOwnProperty("value")
}

const parseData = (message: string): ISocket => {
  try {
    const parsed = JSON.parse(message)
    return parsed
  } catch (e) {
    console.error("Data is not parsable", e)
    throw new Error("Data is not parsable")
  }
}

const getCommandFromData = (message: ISocketInfo | ISocketCommand): ISocketCommand => {
  if (isCommand(message)) {
    const data = message
    return data
  } else {
    throw new Error("Not a command")
  }
}

const broadcast = (type: ISocketType, data: ISocketInfo | ISocketCommand | string) => {
  socket.clients.forEach((ws) => {
    sendMessage(ws, type, data)
  })
}

const sendMessage = (ws: WebSocket, type: ISocketType, data: ISocketInfo | ISocketCommand | string) => {
  const msg = typeof data === "string" ? { message: data, state: ESocketState.INFO } : data
  let assembled: ISocket
  assembled = {
    timestamp: new Date(),
    type,
    data: msg
  }
  // console.log("SENDING", assembled)
  ws.send(JSON.stringify(assembled))
}
