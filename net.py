

import network,time
def sta(ssid,pwd,timeout=10):
  wlan=network.WLAN(network.STA_IF)
  wlan.active(True)
  wlan.connect(ssid,pwd)
  ntimes=1
  while not wlan.isconnected() and ntimes<=timeout:
    print("AP Connecting...",ntimes)
    time.sleep(1)
    ntimes+=1
  print("STA ifconfig:",wlan.ifconfig())  
  print("Connect Status:",wlan.status())
  return None if wlan.ifconfig()[0]=="0.0.0.0" else wlan
  
def ap(ssid="ESP8266"):  
    wlan=network.WLAN(network.AP_IF)  
    wlan.active(True)   
    wlan.config(essid=ssid)                      #essid/password/mac/channel/authmode/hidden  
    while wlan.ifconfig()[0]=="0.0.0.0":      
      time.sleep(1) 
    print("AP ifconfig:",wlan.ifconfig())  
    return wlan





