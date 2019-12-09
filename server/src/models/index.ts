export enum ESocketCommand {
  SET_PATTERN = "setPattern"
}

export enum ESocketPattern {
  WIPE = "wipe",
  CHASE = "chase",
  RAINBOW = "rainbow"
}
export enum ESocketState {
  ERROR = "error",
  SUCCESS = "success",
  WARN = "warn",
  INFO = "info"
}

export enum ISocketType {
  MESSAGE = "message",
  COMMAND = "command"
}

export interface ISocketCommand {
  command: ESocketCommand
  value: ESocketPattern
}

export interface ISocketInfo {
  message: string
  state: ESocketState
}

export interface ISocket {
  timestamp: Date
  type: ISocketType
  data: ISocketInfo | ISocketCommand
}


/*

{
  timestamp: new Date(),
  type: "info",
  data: {
    message: "hello world",
    state: "success"
  }
}

{
  timestamp: new Date(),
  type: "command",
  data: {
    command: "setPattern",
    value: "rainbow"
  }
}

*/
