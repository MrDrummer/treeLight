import serial
with serial.Serial('/dev/ttyACM0', 9600, timeout=5) as ser:
  while True:
    line = ser.readline()
    if len(line) == 0:
      # print("no data")
      continue
    print(line)