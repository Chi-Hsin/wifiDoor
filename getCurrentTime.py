



import myntptime,time
from machine import RTC
rtc=None
def localRTC():
  global rtc
  rtc=RTC()
  try:
    ticks=myntptime.time()+28800   #網路Timer取得格林威治時間+8Hours時差=28800Seconds
    dt=time.localtime(ticks)
    rtc.datetime(dt[0:3]+(0,)+dt[3:6]+(0,)) #將取得時間轉入更新RTC 時間
    return rtc
  except OSError:
    pass
localRTC()   
def now():
  if rtc:
    dt=rtc.datetime()
    formatTime = dt[0:3]+dt[4:7]
    return "{0}-{1}-{2} {3}:{4}".format(*formatTime)
  
  
 #下now()可取得現在時間






