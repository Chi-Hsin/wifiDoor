














import mfrc522
from os import uname
import time,machine
from machine import Pin

def resetMode():
  time.sleep_ms(1000)
  machine.reset()
  time.sleep_ms(500)
  
def door():
  delayTime = 3000 #開和關之間暫停的時間
  pinRelpay = Pin(5,1)#5 is Relpay NO/NO Pin
  pinRelpay.value(1)
  print("RelayHigh")
  time.sleep_ms(delayTime)
  pinRelpay.value(0)
  print("RelayLow")
  time.sleep_ms(100)
  
def findList(list,searchNumber):
  count = 0
  for number, name in list.items():    # for name, age in dictionary.iteritems():  (for Python 2.x)
    if number == searchNumber:
        count += 1
  if count == 1:
    print("Acceass OOO")
    return True
  else:
    print("Acceass XXX")
    return False

def rfidMode(memberList,rdr):
   (stat, tag_type) = rdr.request(rdr.REQIDL)
   content = ""
   print("Reading....")
   if stat == rdr.OK:
     (stat, raw_uid) = rdr.anticoll()
     print("掃描成功")
     
     for item in raw_uid:
       content += str(item)
     print(content)
     condition =  findList(memberList,content)
     print('檢查是否符合權限',condition)
     print('卡號是',content)
     
     if condition == True:
       return True,content
     elif condition == False:
       return False,content
   else:
       print("error")
       return False,content
     #time.sleep_ms(100)

def do_read():

 if uname()[0] == 'WiPy':
  rdr = mfrc522.MFRC522("GP14", "GP16", "GP15", "GP22", "GP17")
    
 elif uname()[0] == 'esp8266':
  rdr = mfrc522.MFRC522(16, 13, 12, 0, 2)
 else:
  raise RuntimeError("Unsupported platform")

 print("")
 print("Place card before reader to read from address 0x08")
 print("")

 try:
  while True:

   (stat, tag_type) = rdr.request(rdr.REQIDL)
   print("Reading....")
   print("Reading22....")

   if stat == rdr.OK:

    (stat, raw_uid) = rdr.anticoll()

    if stat == rdr.OK:
     print("New card detected")
     print("  - tag type: 0x%02x" % tag_type)
     print("  - uid  : 0x%02x%02x%02x%02x" % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3]))
     print("")
     content = ""
     for item in raw_uid:
       content += hex(item)
       
     print(content)
     if content == "17715019132184":
       print("Acceass OOO")
       
     else:
       print("Acceass XXXXX")  
     time.sleep_ms(500);
      
     


     if rdr.select_tag(raw_uid) == rdr.OK:

      key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]

      if rdr.auth(rdr.AUTHENT1A, 8, key, raw_uid) == rdr.OK:
       print("Address 8 data: %s" % rdr.read(8))
       rdr.stop_crypto1()
      else:
       print("Authentication error")
     else:
      print("Failed to select tag")

 except KeyboardInterrupt:
  print("Bye")




















