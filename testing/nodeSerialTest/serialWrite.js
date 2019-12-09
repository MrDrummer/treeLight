const SerialPort = require("serialport")
try {
  const serial = new SerialPort("COM6", {
    baudRate: 9600,
    autoOpen: false
  })
  serial.open((error) => {
    if (error) {
      console.error("serial.open: There was an error", error)
    } else {
      console.log("serial opened!!")
    }
    serial.write("Test serial write!!", (error) => {
      if (error) {
        console.error("serial.write: There was an error", error)
      } else {
        console.log("All good!!")
      }
    })
  })

  serial.on("open", () => {
    console.log("serial port open")
  })
} catch (e) {
  console.error("ERROR!", e)
}

