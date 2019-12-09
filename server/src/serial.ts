import SerialPort from "serialport"

export const serial = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600
})
