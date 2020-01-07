import net
from uFirebase import uFirebase
from machine import Pin
import getCurrentTime
import mfrc522
from  readMFRC import door,rfidMode,resetMode



#sta("iPhone","41451060")
net.sta("STUDENT-C2-1","28721940")
fire=uFirebase(firebase="https://wifi-door.firebaseio.com/")
wifiAlert = True

#Data    D1   5
#sck     D0   16
#mosi    D7   13
#miso    D6   12
#rst     D3   0
#cs(SDA) D4   2
rdr = mfrc522.MFRC522(16, 13, 12, 0, 2)




while True:
  '''if wifiAlert == True:
    print("WIFI OK!")
    wifiAlert = False
    #wifiAlert = 1'''
  dataMode = fire.get("iot/door/doorMode")
  formatTime = getCurrentTime.now()
  print(formatTime)
  
  if dataMode == 1 or dataMode == 3:
    print("RemoteMode")
    datastart = fire.get("iot/door/start")
    dataReset = fire.get("iot/door/reset")
    if datastart == 1:
      door()
      fire.patch("iot/door/",{'start':0})
    if dataReset == 1:
      fire.patch("iot/door/",{'reset':0})
      resetMode()
      
    
  if dataMode == 2 or dataMode == 3:
    print("RfidMode")
    memberList = fire.get("iot/door/memberList")
    (condition,content) = rfidMode(memberList,rdr)#卡號是否正確
    
    print(condition)

    if condition == True:
      accessName = memberList[content]
      print("OOOO")
      door()
      fire.patch("iot/door/",{'start':0,'startIo':1})
      fire.post("iot/door/message",{'type':'text','msg':'<br>'+accessName+'Card Access!</br>','time':formatTime})
      fire.put("iot/door/latestAccessNumber",content)
    elif condition == False and content != "":
      print("XXXXXX")
      fire.post("iot/door/message",{'type':'text','msg':'<br>Card Error!</br>','time':formatTime})
      fire.put("iot/door/latestAccessNumber",content)


