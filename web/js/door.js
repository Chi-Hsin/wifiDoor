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
            	},
            	obj:{},
            	memberName:"",
            	latestAccessNumber:"",
            	modeList:{
            		1:'Remote',
            		2:'RFID',
                3:'Mix',
                4:'XXX'
            	},
            	message:"~~~~~",//rfid掃描紀錄顯示
              recordMessage:"",
              currentTime:"",
              rfidrecordVisible:true,
              settingVisible:false,
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
                this.recordMessage = "<br>門鎖模式變更為"+this.modeList[this.obj.doorMode] + "</br>";
            		this.messageRecordDB();
            		fireRoot.update({'doorMode':this.obj.doorMode})
            	},
              messageRecordDB:function(){
                fireRoot.child("message").push({
                  type:'txt',
                  msg:this.recordMessage,
                  time:this.currentTime
                })
              },
              setAuthMember:function(){//更新/編輯
                var obj = {};
                obj[this.latestAccessNumber] = this.memberName; //更新雲端資料庫的值

                // console.log("要更新的卡號是",this.latestAccessNumber,"要更新的名稱是",this.memberName)
                this.recordMessage = "更新名稱卡號";
                this.messageRecordDB();
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
              rfidrecordShow:function(){
                this.rfidrecordVisible = true;
                this.settingVisible = false;
              },
              settingShow:function(){
                this.rfidrecordVisible = false;
                this.settingVisible = true;
              },
              getCurrentTime:function(){
                var time = new Date();
                var year = time.getFullYear();
                var month  = time.getMonth()+1;
                var day = time.getDate();
                var minute = time.getMinutes();
                var hour = time.getHours();
                var msg = year + "-" + month + "-" + day + " " + hour + ":" + minute;
                return msg;
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
                                    // fireRoot.child("currentTime").once("value").then(function(x){
                                    //       indexData.currentTime = x.val();
                                    // })
                                    indexData.currentTime = indexData.getCurrentTime();
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