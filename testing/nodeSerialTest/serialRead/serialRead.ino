int incomingByte = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("alive!");
}

void loop() {
  if (Serial.available()) {
    incomingByte = Serial.read();

    Serial.print("I received: ");
  }
  Serial.println("test");
  delay(1000);
}
