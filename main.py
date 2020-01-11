



import net
from uFirebase import uFirebase
from machine import Pin
import getCurrentTime
import mfrc522,time
from  readMFRC import door,rfidMode,resetMode



net.sta("iPhone","41451060")
#net.sta("STUDENT-C2-1","28721940")
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
  infoData = fire.get("iot/door/infoData")
  formatTime = getCurrentTime.now()
  print(formatTime)
  
  if infoData['doorMode'] == 1 or infoData['doorMode'] == 3:
    print("RemoteMode")
    #datastart = fire.get("iot/door/start")
    #dataReset = fire.get("iot/door/reset")
    if infoData['start'] == 1:
      door()
      fire.patch("iot/door/infoData",{'start':0})
    if infoData['reset'] == 1:
      fire.patch("iot/door/infoData",{'reset':0})
      resetMode()
      
    
  if infoData['doorMode'] == 2 or infoData['doorMode'] == 3:
    print("RfidMode")
    #memberList = fire.get("iot/door/memberList")
    (condition,content) = rfidMode(infoData['memberList'],rdr)#卡號是否正確
    
    print(condition)

    if condition == True:
      accessName = infoData['memberList'][content]
      #print("OOOO")
      door()
      #fire.patch("iot/door/",{'start':0,'startIo':1})
      fire.post("iot/door/message",{'type':'text','msg':'<br>'+accessName+'Access success!</br>','time':formatTime})
      fire.put("iot/door/infoData/latestAccessNumber",content)
    elif condition == False and content != "":
      print("XXXXXX")
      fire.post("iot/door/message",{'type':'text','msg':'<br>Access fault,detect unknown Card</br>','time':formatTime})
      fire.put("iot/door/infoData/latestAccessNumber",content)






