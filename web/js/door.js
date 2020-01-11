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
            	obj:{
                infoData:{},
                message:{}
              },
            	memberName:"",
            	latestAccessNumber:"",
            	modeList:{
            		1:'遠端',
            		2:'刷卡',
                3:'綜合'
            	},
              buttonActionList:{//執行動作可能產生的結果列表
                0:"執行動作取消",
                1:"卡號不能為空白,執行失敗",
                2:"修改卡號",//修改成功
                3:"新增卡號",//新增成功
                4:"移除卡號",//刪除成功
                5:"查無卡號",//刪除失敗
                6:"遠端啟動門鎖成功"
              },
            	message:"~~~~~",//rfid掃描紀錄顯示
              recordMessage:"",
              currentTime:"",
              rfidrecordVisible:true,
              settingVisible:false,
              remoteOn:true,
            },
            methods:{
            	startEvent:function(){
            		// this.obj.start = 1 - this.obj.start;
            		// fireRoot.update({'start':this.obj.start})
                fireRoot.child("infoData").update({'start':1})
                this.recordMessage = "<br>" + this.buttonActionList[6] + "</br>";
                this.messageRecordDB();
            	
            	},
            	resetEvent:function(){
            		this.obj.infoData.reset = 1;
            		fireRoot.child("infoData").update({'reset':this.obj.infoData.reset})
            		fireRoot.child("message").push({
            			type:'txt',
            			msg:"<br>開發版已重置</br>",
                              time:this.currentTime
            		})
            		console.log(this.obj.infoData.reset)
            	},
            	doorModeEvent:function(e){
            		this.obj.infoData.doorMode = Number(e.target.value);
                if(this.obj.infoData.doorMode == 2){
                  this.remoteOn = false;
                }else{
                  this.remoteOn = true;
                }
                this.recordMessage = "<br>門鎖模式變更為"+this.modeList[this.obj.infoData.doorMode] + "</br>";
            		this.messageRecordDB();
            		fireRoot.child("infoData").update({'doorMode':this.obj.infoData.doorMode})
            	},
              messageRecordDB:function(){
                fireRoot.child("message").push({
                  type:'txt',
                  msg:this.recordMessage,
                  time:this.currentTime
                })
              },
              editbuttonConfirm:function(msg,number){//修改或新增的確認詢問以及有效卡號的檢查
                if(!confirm(msg)){
                  alert("執行動作已取消")
                  return 0;
                }
                if(this.latestAccessNumber == ""){
                  alert("卡號不能為空白")
                  return 1;
                }
                for(var index in this.obj.infoData.memberList){
                  if(this.obj.infoData.memberList.hasOwnProperty(number)){
                    alert("修改成功!");
                    return 2;
                  }
                }
                if(!confirm("這是一筆新卡號,確認新增嗎?")){
                  alert("執行動作已取消")
                  return 0;
                }else{
                  alert("新增成功");
                  return 3;
                }
                
              },
              delbuttonConfirm:function(msg,number){//刪除前的確認詢問以及有效卡號的檢查
                if(!confirm(msg)){
                  alert("執行動作已取消")
                  return 0;
                }
                if(this.latestAccessNumber == ""){
                  alert("卡號不能為空白")
                  return 1;
                }
                for(var index in this.obj.infoData.memberList){
                  if(this.obj.infoData.memberList.hasOwnProperty(number)){
                    alert("刪除成功!");
                    return 4;
                  }
                }
                alert("查無該卡號,無法刪除");
                return 5;

              },
              setAuthMember:function(){//更新/編輯
                var confirmValue = this.editbuttonConfirm("確認要修改嗎?",this.latestAccessNumber);

                if(confirmValue == 0 || confirmValue == 1){
                  this.recordMessage = "<br>" + this.buttonActionList[confirmValue] + "</br>";
                  this.messageRecordDB();
                  return;//紀錄訊息  以及下方更新動作都不做
                }
                else if(confirmValue == 2){
                  this.recordMessage = "<br>" + this.buttonActionList[confirmValue] + this.latestAccessNumber + "資料</br>";
                }
                else if(confirmValue == 3){
                  this.recordMessage = "<br>" + this.buttonActionList[confirmValue] + this.latestAccessNumber + "一筆</br>";
                }

                var obj = {};
                obj[this.latestAccessNumber] = this.memberName; //更新雲端資料庫的值
                
                this.messageRecordDB();//紀錄訊息



                this.$set(this.obj.infoData.memberList, this.latestAccessNumber, this.memberName) //同時更新本地端的資料
                fireRoot.child("infoData/memberList").update(obj);
              },
              delAuthMember:function(){//移除權限
                var confirmValue = this.delbuttonConfirm("確認移除該使用者權限嗎?",this.latestAccessNumber);

                if(confirmValue == 0 || confirmValue == 1){
                  this.recordMessage = "<br>" + this.buttonActionList[confirmValue] + "</br>";
                  this.messageRecordDB();
                  return;//紀錄訊息  以及下方刪除動作都不做
                }
                else if(confirmValue == 4){
                  this.recordMessage = "<br>" + this.buttonActionList[confirmValue] + this.latestAccessNumber + "資料成功</br>";
                }
                else if(confirmValue == 5){
                  this.recordMessage = "<br>" + this.buttonActionList[confirmValue] + this.latestAccessNumber + ",移除失敗</br>";
                }

                this.messageRecordDB();//紀錄訊息
                fireRoot.child("infoData/memberList/" + this.latestAccessNumber).remove();
                this.$delete(this.obj.infoData.memberList,this.latestAccessNumber)
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
                       return  this.obj.infoData.doorMode
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

            fireRoot.child("infoData/latestAccessNumber").on("value",function(s){
               console.log("紀錄上一次登入變動",s.val())
               indexData.latestAccessNumber = s.val()
            })

          },
     })