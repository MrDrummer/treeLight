import WebSocket from "ws"
import {
  ESocketCommand, ESocketState, ISocket, ISocketCommand, ISocketInfo, ISocketType
} from "./models"

let globalCommand: ISocketCommand
export const socket = new WebSocket.Server({ port: 8041 })

socket.on("connection", (ws) => {
  ws.on("message", (message: string) => {
    console.log("RECEIVED:", message)
    try {
      const parsed = parseData(message)
      console.log("parsed :", parsed)
      if (isCommand(parsed.data)) {
        console.log("IS A COMMAND")
        const command = getCommandFromData(parsed.data)
        broadcast(ISocketType.COMMAND, command)
        globalCommand = command
      } else if (parsed.data.message === "ready") {
        console.log("globalCommand :", globalCommand)
        if (isCommand(globalCommand)) sendMessage(ws, ISocketType.MESSAGE, globalCommand)
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

function isCommand (data: ISocketInfo | ISocketCommand): data is ISocketCommand {
  console.log("typeof data :", data)
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
  console.log("SENDING", assembled)
  ws.send(JSON.stringify(assembled))
}
