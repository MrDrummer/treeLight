import SerialPort from "serialport"

export const serial = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600
})

serial.on("readable", () => {
  console.log(new Date(), "Readable Data:", serial.read().toString())
})

serial.on("data", (data) => {
  console.log(new Date(), "Data:", data.toString())
})
