





import urequests
import json

class uFirebase:
    kind = 'put, get, delete, path'         
    def __init__(self, firebase="https://wifi-door.firebaseio.com/", auth = None):
        self.firebase = firebase
        self.auth = auth 

    def put(self,path,myJson):
      try:
        url=self.firebase+path+'.json' if self.auth==None else self.firebase+path+'.json?auth='+self.auth
        response = urequests.put(url, data = json.dumps(myJson))
        #return response
      except:
        print("PUT Error?")
      try:
        response.close()
      except:
        print("Close Error?")

    def patch(self,path,myJson):
      try:
        url=self.firebase+path+'.json' if self.auth==None else self.firebase+path+'.json?auth='+self.auth
        response = urequests.patch(url, data = json.dumps(myJson))
        #return response
      except:
        print("PATCH Error?")
      try:
        response.close()
      except:
        print("Close Error?") 
            
    def post(self,path,myJson):
      try:
        url=self.firebase+path+'.json' if self.auth==None else self.firebase+path+'.json?auth='+self.auth
        response = urequests.post(url, data = json.dumps(myJson))
        #return response
      except:
        print("POST Error?")
      try:
        response.close()
      except:
        print("Close Error?")         
    def get(self,path):
      try:
        url = self.firebase+path+'.json?print=pretty' if self.auth==None else self.firebase+path+'.json?auth='+self.auth
        response = urequests.get(url).json()
        return response
      except:
        print("GET Error?")
       
    def delete(self,path):
      try:
        url = self.firebase+path+'.json?print=pretty' if self.auth==None else self.firebase+path+'.json?auth='+self.auth
        response = urequests.delete(url).json()
        return response
      except:
        print("DELETE Error?")
 




