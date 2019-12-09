#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 6

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
Adafruit_NeoPixel strip_1 = Adafruit_NeoPixel(60, PIN, NEO_GRB + NEO_KHZ800);

// IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
// pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
// and minimize distance between Arduino and first pixel.  Avoid connecting
// on a live circuit...if you must, connect GND first.
uint16_t wait = 1000;
int r = 1;
byte mode = 1

void setup() {
  
  Serial.begin(9600);
//  turnPixelsOff(wait);
  strip.begin();
  strip.setBrightness(64);
  strip.show(); // Initialize all pixels to 'off'
  
}

//void loop() {
//  
//}
void loop() {
    switch (mode) {
      // SPEED (last arg) could be controlled via interface
      case 1: // wipe
        // Some example procedures showing how to display to the pixels:
        colorWipe(strip_1, strip.Color(255, 0, 0), 50); // Red
        colorWipe(strip_1, strip.Color(0, 255, 0), 50); // Green
        colorWipe(strip_1, strip.Color(0, 0, 255), 50); // Blue
        break;
      case 2: // chase
        theaterChase(strip_1, strip.Color(127, 0, 0), 50); // Red
        theaterChase(strip_1, strip.Color(0, 0, 127), 50); // Blue
        theaterChaseRainbow(strip_1, 50);
        break;
      case 3: // rainbow
        rainbow(strip_1, 50);
        rainbowCycle(strip_1, 50);
        theaterChaseRainbow(strip_1, 50);
        break;
      default:
        break
    }
//colorWipe(strip.Color(0, 0, 0, 255), 50); // White RGBW
  // Send a theater pixel chase in...
  // theaterChase(strip.Color(127, 127, 127), 50); // White

}

bool checkForInterrupt() {
  if (Serial.available()) {         //From RPi to Arduino
    r = r * (Serial.read() - '0');  //conveting the value of chars to integer
    Serial.println(r);

    // switch (r) {
    //   case "wipe":
    //     mode = 1
    //     break
    //   case "chase":
    //     mode = 2
    //     break
    //   case "rainbow":
    //     mode = 3
    //     break
    
    //   default:
    //     break
    // }
  }
}

void getPixelColours(Adafruit_NeoPixel strip) {
  for (uint16_t i=0; i<strip.numPixels(); i++) {
    Serial.println(i);Serial.println(strip.getPixelColor(i));
  }
}

// Fill the dots one after the other with a color
void turnPixelsOff(Adafruit_NeoPixel strip, uint16_t wait) {
  uint32_t colour = strip.Color(0,255,0);
  Serial.println(wait);
  for(uint16_t i=strip.numPixels(); i>0; i--) {
    Serial.println(i);Serial.println(colour);
//    strip.setPixelColor(i-1, colour);
    if (checkForInterrupt()) return;
    strip.show();
    delay(wait);
  }
}

// Fill the dots one after the other with a color
void colorWipe(Adafruit_NeoPixel strip, uint32_t c, uint8_t wait) {
  Serial.println(c);
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    Serial.println(i);
    strip.setPixelColor(i, c);
    if (checkForInterrupt()) return;
    strip.show();
    delay(wait);
  }
}

void rainbow(Adafruit_NeoPixel strip, uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(strip, (i+j) & 255));
    }
    if (checkForInterrupt()) return;
    strip.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(Adafruit_NeoPixel strip, uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(strip, ((i * 256 / strip.numPixels()) + j) & 255));
    }
    if (checkForInterrupt()) return;
    strip.show();
    delay(wait);
  }
}

//Theatre-style crawling lights.
void theaterChase(Adafruit_NeoPixel strip, uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      
      if (checkForInterrupt()) return;
      strip.show();
      delay(wait);

      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

//Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(Adafruit_NeoPixel strip, uint8_t wait) {
  for (int j=0; j < 256; j++) {     // cycle all 256 colors in the wheel
    for (int q=0; q < 3; q++) {
      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, Wheel(strip, (i+j) % 255));    //turn every third pixel on
      }
      
      if (checkForInterrupt()) return;
      strip.show();
      delay(wait);

      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(Adafruit_NeoPixel strip, byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}
