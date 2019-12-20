var indexData = new Vue({
            el: '#doorLock',
            data: {
            	rfidConsoleStyle:{
            		background: 'yellow',
            		height:'300px',
            		overflow: 'auto'
            	},
            	memberListStyle:{
            		background: '#fff',
            		height:'300px',
            		border:'1px solid #000'
            	},
            	obj:{},
            	memberName:"",
            	latestAccessNumber:"",
            	modeList:{
            		1:'Wifi',
            		2:'RFID',
            		3:'Key',
            	},
            	message:"~~~~~",
                  currentTime:"",
            },
            methods:{
            	startEvent:function(){
            		this.obj.start = 1 - this.obj.start;
            		fireRoot.update({'start':this.obj.start})
            		fireRoot.child("message").push({
            			type:'txt',
            			msg:"<br>開關狀態變更為"+this.obj.start + "</br>",
                              time:this.currentTime
            		})
            	
            	},
            	resetEvent:function(){
            		this.obj.reset = 1;
            		fireRoot.update({'reset':this.obj.reset})
            		fireRoot.child("message").push({
            			type:'txt',
            			msg:"<br>開發版已重置</br>",
                              time:this.currentTime
            		})
            		console.log(this.obj.reset)
            	},
            	doorModeEvent:function(e){
            		// alert(e.target.value)
            		this.obj.doorMode = Number(e.target.value);
            		fireRoot.child("message").push({
            			type:'txt',
            			msg:"<br>門鎖模式變更為"+this.modeList[this.obj.doorMode] + "</br>",
                              time:this.currentTime
            		})
            		fireRoot.update({'doorMode':this.obj.doorMode})
            	},
              setAuthMember:function(){//更新/編輯
                var obj = {};
                obj[this.latestAccessNumber] = this.memberName; //更新雲端資料庫的值

                console.log("要更新的卡號是",this.latestAccessNumber,"要更新的名稱是",this.memberName)
                this.$set(this.obj.memberList, this.latestAccessNumber, this.memberName) //同時更新本地端的資料
                fireRoot.child("memberList").update(obj);
              },
              delAuthMember:function(){//移除權限
                fireRoot.child("memberList/" + this.latestAccessNumber).remove();
                this.$delete(this.obj.memberList,this.latestAccessNumber)
              },
              getDataTest:function(e){
                var name = e.target.getAttribute("data-name")
                var number = e.target.getAttribute("data-number")
                this.memberName = name;
                this.latestAccessNumber = number;
                // console.log(data)
              },
            },
            computed:{
                  doorMode:function(){
                       return  this.obj.doorMode
                  },
                  history:function(){//最新的一筆紀錄呈現在最上頭
                       var aaa={};
                       var bbb = this.obj.message;
                       var keys = Object.keys(bbb);
                       for(var i=keys.length-1;i>=0;i--){
                           aaa[keys[i]]  = bbb[keys[i]]
                       }
                       return aaa;
                  },
            },
            mounted:function(){
      //       	var config = {
				  // apiKey: "AIzaSyApyYCBLz7qpE22V0Na8h-OYSkKWrNFRLA",
				  // authDomain: "relaycontrol-fc8da.firebaseapp.com",
				  // databaseURL: "https://relaycontrol-fc8da.firebaseio.com/",
				  // projectId: "wifi-door",
				  // storageBucket: "",
				  // messagingSenderId: "690750323149"};

				var config = {
				  apiKey: "AIzaSyCZwmZKUPTIdTntjUvnvPqj5qEVy1pZG3Q",
				  authDomain: "relaycontrol-fc8da.firebaseapp.com",
				  databaseURL: "https://wifi-door.firebaseio.com/",
				  projectId: "wifi-door",
				  storageBucket: "",
				  messagingSenderId: "690750323149"};
				
				firebase.initializeApp(config);// Initialize Firebase
				fireRoot = firebase.database().ref("/iot/door");

				fireRoot.once("value").then(function(x){
					indexData.obj = x.val();
				})

				fireRoot.child("message").limitToLast(1).on("value",function(s){
					for(i in s.val())
					{
					      indexData.message = s.val()[i].msg + indexData.message;
                                    fireRoot.child("currentTime").once("value").then(function(x){
                                          indexData.currentTime = x.val();
                                    })
                                    var aaa = {};
                                    aaa[i] = s.val()[i];
                                    var newobj = Object.assign(indexData.obj.message,aaa);
                                    indexData.obj.message = JSON.parse(JSON.stringify(newobj));
                                    // console.log(indexData.obj.message)
					}
				})

            fireRoot.child("latestAccessNumber").on("value",function(s){
               console.log("紀錄上一次登入變動",s.val())
               indexData.latestAccessNumber = s.val()
            })

          },
     })