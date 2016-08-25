#include <MFRC522.h>
#include <SPI.h>

#define SAD 10
#define RST 5

MFRC522 nfc(SAD, RST);

void setup() {
  SPI.begin();
  SPI.setClockDivider(SPI_CLOCK_DIV8);
  // Read a fast as possible. There is a limit for how long we are
  // allowed to read from the tags.
  Serial.begin(115200);

  Serial.println("[\"init\"]");
  nfc.begin();

  // Get the firmware version of the RFID chip
  byte version = nfc.getFirmwareVersion();
  if (! version) {
    Serial.println("[\"error\"]");
    while(1);
  }

  Serial.println("[\"found\", " + String(version) + "]");
}

void loop() {
  byte status;
  byte data[MAX_LEN];
  byte serial[5];
  int i, j, pos;

  // Send a general request out into the aether. If there is a tag in
  // the area it will respond and the status will be MI_OK.
  status = nfc.requestTag(MF1_REQIDL, data);

  if (status == MI_OK) {
    Serial.println("[\"type\", " + String(data[0]) +  ", " +
        String(data[1]) + "]");

    // calculate the anti-collision value for the currently detected
    // tag and write the serial into the data array.
    status = nfc.antiCollision(data);
    memcpy(serial, data, 5);

    Serial.print("[\"serial\", ");
    for (i = 0; i < 5; i++) {
      if (i > 0) {
        Serial.print(", ");
      }
      Serial.print(String(serial[i]));
    }
    Serial.println("]");

    // Select the tag that we want to talk to. If we don't do this the
    // chip does not know which tag it should talk if there should be
    // any other tags in the area..
    nfc.selectTag(serial);

    // Stop the tag and get ready for reading a new tag.
    nfc.haltTag();
  }
  delay(2000);
}