/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-1-9
 * Time: 下午2:07
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){
    function Chat(callBack) {
        this.options = {};
        this.callBack = callBack;
        this.type="all-icon";
        this.faceData = null;
        this.sealData = null;
        this.faceType = "defaultFace";
        this.faceSrc="";
        this.facetitle="";
        this.sealType = "designationFace";
        this.className="face";
        this.chatReceiver = $("#chatReceiver");
        this.chatReceiverId="";
        this.chatPost = $("#chat_post");
        this.chatPostValue="";
        this.colorBarData=null;
        this.pubOrPri = "";
        this.myId="";
        this.myType = "0";
        this.lockFlag = false;
        this.reciver = {id:"0",name:"所有人"};
        this.stampType="";
        this.publicTmpl = '<span><a style="text-decoration:underline"  href="${href}">${chatSender}【${chatSenderId}】 </a> 对  <a style="text-decoration:underline"  href="${href}">${chatReceiver}【${chatReceiverId}】 </a>说&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        this.privateTmpl = '<span> 【你】 对  <a style="text-decoration:underline"  href="${href}">${chatReceiver}【${chatReceiverId}】 </a>说:&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        this.sysTmpl = '<span><a style="text-decoration:none">${text}</a>&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        this.faceTmpl = '<td class="imgCode"><img src="${key}"  width="25" height="25"/></td>';
        this.sealTmpl = '<td class="imgCode" id="${StampID}" title="${StampName},${StampMoney}"><img src="${StampIco}"/></td>';
        this.giftListTmpl = '<td>${giftName}</td><td>${giftNumber}</td><td>${sender}</td>';
        this.songListTmpl = '<td style="display:none">${id}</td><td>${number}</td><td>${songName}</td><td>${singer}</td><td><a href="#" class="blue">编辑</a> <a href="#">删除</a></td>';
        this.faceLabelTmpl =  '<li id="${key}" name="${type}"><a href="#">${key}</a></li>';
        this.hornTemplate = '<span><strong>(${nick})说：${str}</strong>速度来围观呀！<em id="hornTime"></em></span>';
        this.chatToListTmpl = '<li class="chatWith" id="${id}Cd" title=${name}><a href="#">${name}</a></li>';
        this.faceKeys ={"默认":"defaultFace","兔斯基":"tuSiJiFace","悠嘻猴":"monkeyFace","炮炮兵":"paoPaoFace"};
        this.sealKeys ={"称号":"designationFace","称赞":"complimentFace","整蛊":"brainsFace","角色":"characterFace","贵族":"nobleFace","鉴定":"identifyFace"};
        this.initFlag = false;
        this.postTmpl = '<a style="padding:0 2px;" href="#" title="${name}"><img src="${role_small_icon}"height="18"/></a>'
        this.diceMsg={};
        this.init();
    }
    Chat.prototype.init=function(){
        this.initLock();
        this.initChatBtn();
        this.initClick ();
        this.chatOrGift();
        this.initManagerRootDeal();

    }
    Chat.prototype.initLock=function(){
        if(this.lockFlag){
            $("#lockScreenOrNot").attr("title","解除锁屏");
        }else{
            $("#lockScreenOrNot").attr("title","锁屏");
        }
    }
    Chat.prototype.isManager=function(type){
        this.myType = type
        if("0" != this.myType){
            $("#userMenuRoot").show();
        }else{
            $("#userMenuRoot").hide();
        }
    }
    Chat.prototype.initClick=function(){
        var self =this;
        $("li","#chat_type").bind("click", function () {
            var index = $(this).index();self.type=$(this).attr("id");
            $(this).addClass("on").siblings().removeClass("on");
            var divs = $("#chatTabs > div");
            self.show(index,divs);
            self.chatOrGift();
        });
       $("#chatTo").click(function(){
           $(".chatToList").show();
           self.chatWith();
       });
        $("#song-icon").click(function(){
            require("../../app/src/css/song.css");
            self.dialogOpen ("song");
            self.setSong();
        });
        $("#garage-icon").click(function(){
            require("../../app/src/css/garage.css");
            testInterface.getCars({cmd:"CMD_PARKINGINFO"});
        });
        var moveFlag=false;
       $("#chat_bar").mousedown(function(event){
           var offset = $(this).offset (),old,old1,upFlag=true,downFlag=true,height,top,top1,$private=$(".chat-private"),$public=$(".chat-public"),pHeight =$public.height(),iHeight=$private.height();
           try{
                old = parseInt(event.pageY);
            }catch(e){

            }
           $("body").mousemove(function(e){
               old1 = parseInt(e.pageY) ;
               if(upFlag&&old>old1){
                   top =  old1 - 200;
                   $("#chat_bar").attr("style","top:"+top+"px");
                   height =old - old1;
                   if(top<126){
                       upFlag = false;
                   }
                   if(moveFlag){
                       top1 = top;
                   }else{
                       top1 = 326 - height;
                   }
                   $public.height(pHeight-height);
                   $private.attr("style","top:"+top1+"px");
                   $private.height(iHeight+height);
               }
               if(downFlag&&old<old1){
                   top = old1 - 200;
                   $("#chat_bar").attr("style","top:"+top+"px");
                   height =old1 - old;
                   if(top>426){
                       downFlag = false;
                   }
                   if(moveFlag){
                       top1 = top;
                   }else{
                       top1 = 326 + height;
                   }
                   console.log(top1);
                   $public.height(pHeight+height);
                   $private.attr("style","top:"+top1+"px");
                   $private.height(iHeight-height);
               }
           }).mouseup(function(ev){
                   upFlag=false;
                   downFlag = false;
                   moveFlag = true;
                   $("#chat_bar").attr("style","top:"+top+"px");
               });
        });
    }
    Chat.prototype.setPubAndPri=function(height,flag){
        var $private=$(".chat-private"),$public=$(".chat-public"),pHeight =$private.height(),top;
        "up" == flag ? (function(u,i){
            top = 326 - height;
            console.log(top);
            u.height(pHeight-=height);
            i.attr("style","top:"+top+"px");
        })($public,$private):(function(u,i){
            top = 326 + height;
            u.height(pHeight+=height);
            i.attr("style","top:"+top+"px");
        })($public,$private);
    }
    Chat.prototype.resetGarage=function(data){
        var length = data["list"].length;
        $("#garageNumber").text(length);
        this.dialogOpen ("garage");
        //self.setGarage();
    }
    Chat.prototype.chatWith = function(){
        var self = this;
        $(".chatWith").on("click",function(){
            var id,iD,title = $(this).attr("title");
            if("所有人" == title){
                id = "0";
            }else{
                iD = $(this).attr("id"),
                id = iD.substring(0,iD.length-2);
            }
            self.chatReceiver .val(title);
            self.chatReceiver .attr("code",id);
            $(".chatToList").hide();
        });
    }
    //点歌系统对外接口
    Chat.prototype.setSong=function(data){
       var self = this,result;
        if(!data){
            result = [{id:"13006",number:1,songName:"伤心城市",singer:"冷漠"},{id:"13007",number:2,songName:"我最爱的女人",singer:"冷漠"}]
        }
        $.each(result,function(i){
            self.createTr(result[i],self.songListTmpl ,$("#songList"));
        })
        self.picking ();
    }
    Chat.prototype.picking  = function(){
            $("tr","#songList").click(function(){
               // var index
            });
    }
    Chat.prototype.chatOrGift = function(){
        var self = this;
        switch(self.type){
            case "all-icon":
                if(!self.initFlag ){
                    self.initFaceBtn();
                    self.initFlag = true;
                }
                break;
            default:
               self.resetGiftList();
                break;
        }
    }

//以下是聊天内容区域的业务逻辑方法
    Chat.prototype.initChatBtn=function(){
        var self = this;
        $(".chat-btn").click(function(){
            var text = self.chatPost.val();
            if("" == text){
                alert("消息不能为空！");
                return;
            };
            self.chatType  = "private";
            self.chatReceiverId = self.chatReceiver.attr("code");
            var bSecret = $("#bSecret","#chatBody").is(':checked');
            testInterface.talkTo ({cmd:"CHAT_TEXT", des_uin:self.chatReceiverId, text:text, bSecret:bSecret});
            self.chatPost .val("");
        });
    }
    Chat.prototype.callPostArea=function(){
        var string = "/"+this.faceTitle ;
        var value = this.chatPost.val();
        value+= string;
        this.chatPost.val(value);
        this.chatPostValue = value;
    }
    Chat.prototype.resetReceiver = function(data){
        this.reciver = data;
        this.chatReceiver .val(data.name);
        this.chatReceiver .attr("code",data.id);
        this.resetChatToList(data);
    }
    Chat.prototype.resetChatToList = function(data){
        if($("#"+data.id+"CD").length>0){
            return;
        }else{
            var html="",id = data["id"],title=data["title"],name=data["name"];
            html+='<li id="'+ id +'CD" class="chatWith" title="'+ name +'"><a href="#">'+ name +'</a></li>';
            $("#chatToList").append(html);
        }
    }
    Chat.prototype.resetChat = function(data,flag){
        var self=this,stringTMPL="",headString="",$info,result;
        switch(flag){
            case "public":
                    result = data[0];
                    $info  = $("#public");
                    stringTMPL=self.publicTmpl ;
                    self.resetChatTemplate(stringTMPL,headString,result,$info);
                    if(this.lockFlag){

                    }else{
                        this.toBottom($info);
                    }
                break;
            case "private":
                    result = data;
                    $info  = $("#private");
                    stringTMPL = self.privateTmpl;
                    self.resetChatTemplate(stringTMPL,headString,result,$info);
                    if(this.lockFlag){

                    }else{
                        this.toBottom($info);
                    }
                break;
            case "horn":
                this.setHorn(data);
                break;
            case "dice":
                this.setChatDice(data);
                break;
            case "CHAT_TEXT":
            this.setChatText(data);
            break;
            case "CMD_COLOURBAR":
                this.setBarText(data);
                break;
            case "SELF_SYSMSG":
                this.setMSG(data);
                break;
            default:
                result = data;
                $info  = $("#private");
                stringTMPL = self.sysTmpl;
                self.resetChatTemplate(stringTMPL,headString,result,$info);
                if(this.lockFlag){

                }else{
                    this.toBottom($info);
                }
                break;
        }
    }
    Chat.prototype.setHorn=function(data){
        var self=this,result=data,$info = $("#private"),html="";
        var headString = "<img src='./app/src/img/iconNotic.png' style='height:22px' />",time=self.setTime();
        $(result).each(function(i){
            self.setPreHorn(headString,time,result[i],$info);
        });
        if(this.lockFlag){

        }else{
            this.toBottom($info);
        }
    }
    Chat.prototype.setMyId=function(id){
        this.myId = id;
    }
    Chat.prototype.setPreHorn=function(headString,time,horn,$info){
        console.log(horn)
        var html=headString+time+'<span>&nbsp;&nbsp;<strong>'+ horn["str"] + '</strong>&nbsp;&nbsp;<span style="color:#0783FF">'+horn["nick"] +'发布</span>&nbsp;&nbsp;<span style="color:#FB0099">('+ horn["uin"] +')</span></span>';
        this.resetChatNotTemplate (html,$info);
    }
    Chat.prototype.setMSG=function(data){
        var text = data[0].text,start = text.length- 4,flag = text.substring(start);
        if("上主视频" == flag){
            testInterface.callFlashPlay({cmd:"CMD_PUBLISTSTART",type:"main"});
        }
        var div = document.createElement("div");
        var string = "<span style='color:#FF0000'>[系]</span>",time="<span>"+this.setTime()+"</span>&nbsp;&nbsp;",text="<span style='color:#FF0000'>["+ data[0].text +"]</span>";
        $(div).append(string+time+text);
        $("#private").append($(div));
    }
    Chat.prototype.setTime=function(){
            var date =new Date(),
                hour = date.getHours()< 10 ? "0" + date.getHours() : date.getHours(),
                minute = date.getMinutes()< 10 ? "0" + date.getMinutes() : date.getMinutes(),
                second = date.getSeconds()< 10 ? "0" + date.getSeconds() : date.getSeconds();
            return  "("+hour+":"+minute+":"+second+")";
    }
    Chat.prototype.setChatText=function(data){
        var desIcon = data["des_icons"],bSecret = data.bSecret,desNick="",uin = data["src_uin"],desUin = data["des_uin"],
            srcIcon =data["src_icons"],srcNick = "",pubOrPri="",srcImg="",desImg="",$dom;
        if(bSecret){
            pubOrPri = "私";
        }else{
            pubOrPri = "公";
        }
        var time =this.setTime();
        this.pubOrPri = pubOrPri;
        var html="<span style='color:#008000'>["+ pubOrPri +"]</span>";
        $(srcIcon).each(function(i){
            srcImg += "<img src="+ srcIcon[i] +"/>";
        });
        $(desIcon).each(function(i){
            desImg += "<img src="+ desIcon[i] +"/>";
        });
        $dom = $("#public");
        if(this.myId == desUin){
            $dom = $("#private");
            desNick = "<span style='color:red;margin-right: 2px'>[你]</span>";
        }else{
            desNick = "<span style='color:darkseagreen;margin-right: 2px'>["+ data["des_nick"] +"]</span>";
        }
        if(this.myId == uin){
            $dom = $("#private");
            srcNick = "<span style='color:red;margin-right: 2px'>[你]</span>";
        }else{
            srcNick = "<span style='color:darkseagreen;margin-right: 2px'>["+ data["src_nick"] +"]</span>";
        }
        html+=time+srcImg+srcNick+"对"+desImg+ desNick +"<span style='color:darkred;margin-right:8px '>说:</span>"+data.text;
        this.resetChatNotTemplate (html,$dom);
        if(this.lockFlag){

        }else{
            this.toBottom($dom);
        }
    }
    Chat.prototype.setChatDice=function(result){
        var data = result.msg,num ="<span style='color=mediumvioletred;margin-right: 2px'>"+ data.num +"</span>",time =this.setTime(),
            uin=data["src_uin"],nick =data["src_nick"],src=data["src_icons"],userImg="",html="<span style='color:#008000'>[骰]</span>",$dom;
        $(src).each(function(i){
            userImg += "<img src="+ src[i] +"/>";
        });
        if(this.myId == uin || this.myId == nick){
            $dom = $("#private");
            nick = "<span style='color:red;margin-right: 2px'>[你]</span>";
        }else{
            $dom = $("#public");
            nick = "<span style='color:red;margin-right: 2px'>[" + nick + "]</span>";
        }
       var  backImg = "<img src='./app/src/img/dice.jpg' style='height:18px;'/>"
        html+=time+userImg+nick+"摇骰子，摇出了"+num+"点"+backImg;
       this.resetChatNotTemplate (html,$dom);
        if(this.lockFlag){

        }else{
            this.toBottom($dom);
        }
    }
    Chat.prototype.resetChatNotTemplate=function(html,$dom){
        var div = document.createElement("div");
        $(div).css("margin-top","5px");
        $(div).append(html);
        $dom.append($(div));
    }
    Chat.prototype.resetChatTemplate = function(stringTMPL,headString,result,$info){
        var div = document.createElement("div");
        $.template("stringTMPL", stringTMPL);
        var html = $.tmpl("stringTMPL", result);
        $(div).append(headString);
        $(div).append(html);
        console.log(result.text);
        $(div).append(result.text);
        $info.append($(div));
    }
//用户选择的点击操作，如彩条，扣章，选择聊天表情等
    Chat.prototype.initFaceBtn=function(){
        var self = this;
        $("#img_btn").find("button").click(function(){
            require("../../app/src/css/face.css");
            self.className = $(this).attr("class");
            var $dom = $(this);
            self.elect (self.className,$dom);
        });
    }
    Chat.prototype.elect=function(className,$dom){
        var self = this;
        switch(className){
            case "face":
               self.face();
                break;
            case "colorbar" :
                self.colorBar();
                break;
            case "seal" :
                self.seal();
                break;
            case "wheat" :
                self.wheat();
                break;
            case "dice" :
                self.dice();
                break;
            case "unlock" :
                this.lockFlag = true;
                self.lockScreenOrNot();
                break;
            case "lock" :
                this.lockFlag = false;
                self.lockScreenOrNot();
                break;
            case "usermenu" :
                self.userMenu($dom);
                break;
            default:
                self.votes();
                break;
        }
    }

//以下是彩条前端逻辑方法
    Chat.prototype.colorBar=function(){
        testInterface.ReqColorBar();
    }
//以下是骰子前端逻辑方法
    Chat.prototype.initDiceSet=function(data){
        data.op = "ROLL";
        this.diceMsg = data;
    }
    Chat.prototype.dice=function(){
        testInterface.sendDice (this.diceMsg);
    }
    Chat.prototype.diceSet=function(data){
        this.diceMsg = data;
    }
//以下是印章前端逻辑方法
    Chat.prototype.seal=function(){
        var self = this;
        self.dialogOpen ("seal");
        self.setPanel("seal");
    }
    Chat.prototype.setSeal=function(){
    }
//以下是锁屏前端逻辑方法
    Chat.prototype.lockScreenOrNot=function(){
        var $lockScreenOrNot = $("#lockScreenOrNot");
        if(this.lockFlag){
            $lockScreenOrNot.removeAttr("title").attr("title","解除锁屏");
            $lockScreenOrNot.removeClass("unlock").addClass("lock");
        }else{
            $lockScreenOrNot.removeAttr("title").attr("title","锁屏");
            $lockScreenOrNot.removeClass("lock").addClass("unlock");
        }
    }
//以下是用户操作菜单前端逻辑方法
    Chat.prototype.userMenu=function($dom){
        require("../../app/src/css/manager.css");
        var  $managerRoot = $("#userManagerRoot"),offset = $dom.offset(),top=offset.top-$managerRoot.height(),left=offset.left;
        $managerRoot.attr("style","margin-top:"+top+"px;"+"margin-left:"+left+"px");
        $managerRoot.show();
        this.managerRootDeal($managerRoot);
    }
    Chat.prototype.managerRootDeal=function($managerRoot){
        var self = this;
        $managerRoot.mouseleave (function(){
            $(this).hide();
        });
    }
    Chat.prototype.initManagerRootDeal=function(){
        var self = this,$managerRoot = $("#userManagerRoot");
        $managerRoot.find("li").click(function(){
            var id = $(this).attr("id");
            self.managerDeal($managerRoot,id);
        });
    }
    Chat.prototype.managerDeal=function($managerRoot,id){
            var pkt={},desUin=this.chatReceiver.attr("code");
            pkt.desuin = desUin;
            switch(id){
                case "MAINVIDEO_UP":
                    pkt.cmd = "MAINVIDEO";
                    pkt.op = "UP";
                    break;
                case "MAINVIDEO_DOWN":
                    pkt.cmd = "MAINVIDEO";
                    pkt.op = "DOWN";
                    break;
                case "MAINVIDEO_TOP":
                    pkt.cmd = "MAINVIDEO";
                    pkt.op = "TOP";
                    break;
                case "MAINVIDEO_DEL":
                    pkt.cmd = "MAINVIDEO";
                    pkt.op = "DEL";
                    break;
                default:
                    pkt.cmd = id;
                    break;
            }
            $managerRoot.hide();
            testInterface.myManagerDeal(pkt);
    }
//以下是密麦前端逻辑方法
    Chat.prototype.wheat=function(){
    }
//以下是人气票前端逻辑方法
    Chat.prototype.votes=function(){
    }
//以下是聊天表情弹出窗的业务方法
    Chat.prototype.face=function(){
        var self = this;
        self.dialogOpen ("face");
        self.setPanel("face");
    }
    Chat.prototype.setPanel=function(type){
        var self = this,nowType;
        switch(type){
            case "face" :
                nowType =self.faceType;
                break;
            case "seal" :
                nowType =self.faceType;
                break;
            default:
                break;
        }
        self.initLabel(type);
        //self.resetPanel(nowType);

    }
    Chat.prototype.initLabel=function(type){
        var self = this,id="#"+type+"_dialog",labelType;
        if("face" === type){
            labelType="#faceType";
        }else{
            labelType="#sealType";
        }
        $(labelType,id).find("li").click(function(){
            var id = $(this).attr("id");
            if("#sealType"==labelType){
                self.stampType=$(this).attr("name");
            }
            $(this).addClass("current").siblings().removeClass ("current");
            switch(labelType){
                case "#faceType":
                    self.faceType = self.faceKeys[id];
                    if("more" === self.faceType){
                        self.moreFaces();
                    }else{
                        self.resetPanel(self.faceType);
                    }
                    break;
                default:
                    self.sealType = self.sealKeys[id];
                    self.resetPanel(self.sealType );
                    break;
            }
        });
    }
    Chat.prototype.resetPanel=function(type){
        var self = this,$body = $("#"+type),data,string="";
            if($body.find("tr").length > 0){
                $body.parent().show().siblings().hide();
            }else{
                if("face" === this.className){
                   data = this.faceData[type];
                   string = "face";
                }else{
                   data = this.sealData[type];
                    string = "seal";
                }
                this.setDefault(data,string);
            }
    }
    //对外接口
    Chat.prototype.roomViewCallChatRoom = function(data){
        var data,string,defaultData;
        switch(data.FlagString){
            case "获取表情成功":
                    this.setData(data.phiz,"face");
                    this.setDefault(this.faceData[this.faceType],"face");
                    this.setLabels(data.phiz,"face");
                break;
            case "获取印章列表成功":
                this.setData(data.Result,"seal");
                this.setDefault(this.sealData[this.sealType],"seal");
                this.setLabels(data.Result,"seal");
                break;
            case "获取彩条成功":
                this.setColorBar(data.Result);
                break;
            default:
                break
        }
    }
    Chat.prototype.setColorBar=function(data){
        this.colorBarData = data;
        var index = Math.round(Math.random()*(data.length-1))+ 1,pkt={};
        pkt.cmd = "CMD_COLOURBAR";
        pkt.index = index;
        pkt.des_uin = this.chatReceiver.attr("code") ;
        testInterface.sendColorBar(pkt);
    };
    Chat.prototype.setBarText=function(data){
        var i = data.index,result = this.colorBarData[i],body = result.body,desUin=data["des_uin"],srcUin=data["src_uin"],desNick = data["des_nick"],srcNick=data["src_nick"],
            srcImg="",desImg="",srcIcon=data["src_icons"],desIcon=data["des_icons"],string="",$dom,srcNickString="",desNickString="",time=this.setTime();
             $(body).each(function(i){
                 string+='<span style="color:'+body[i]["color"]+'">'+body[i]["text"]+'</span>';
             });
        var html="<span style='color:#8000FF'>[彩]</span>";
        $(srcIcon).each(function(i){
            srcImg += "<img src="+ srcIcon[i] +"/>";
        });
        if(desIcon){
            $(desIcon).each(function(i){
                desImg += "<img src="+ desIcon[i] +"/>";
            });
        }
        if(this.myId == srcUin||this.myId == desUin){
            $dom = $("#private");
        }else{
            $dom = $("#public");
        }
        var nickString = "<span style='color:red;margin-right: 2px'>[你]</span>";
        if(this.myId == srcUin){
            srcNickString = nickString;
        }else{
            srcNickString = "<span style='color:darkseagreen;margin-right: 2px'>["+ srcNick +"]</span>";
        }
        if(this.myId == desUin){
            desNickString = nickString;
        }else{
            desNickString = "<span style='color:darkseagreen;margin-right: 2px'>["+ desNick +"]</span>";
        }
        html+=time+srcImg+srcNickString+"对"+desImg+ desNickString +"<span style='color:darkred;margin-right:8px '>说:</span>"+string;
        this.resetChatNotTemplate (html,$dom);
        if(this.lockFlag){

        }else{
            this.toBottom($dom);
        }

    }

    Chat.prototype.setLabels=function(data,flag){
        var $dom,key,type;
        if("face" === flag){
            type="name";
            key = "name";
            $dom = $("#faceType");
        }else{
            type="ParentId"
            key = "TypeName";
            $dom = $("#sealType");
        }
        var labels =this.setBasicLabels(data,key,type);
        //this.template ($dom,this.faceLabelTmpl,labels);
        this.notTemplateLabels ($dom,labels);
       // $dom.append('<li id="more" data=""+flag><a href="#">更多</a><i class="arrow"></i></li>');
        var $current =$dom.find("li").eq(0);
        if("seal" === flag){
            this.stampType = $current.attr("name");
        }
        $current.addClass("current").sublings().removeClass("current");
    }
    Chat.prototype.notTemplateLabels=function($dom,labels){
        var html="";
        $(labels).each(function(i){
            var result = labels[i];
            html+= '<li id="'+ result["key"] +'" name="'+ result["type"] +'"><a href="#">'+ result["key"] +'</a></li>';
        });
        $dom.html(html);

    }
    Chat.prototype.setBasicLabels=function(data,key,type){
        var labels = [];
        $(data).each(function(i){
            var label = {};
            label["key"] =  data[i][key];
            label["type"] =  data[i][type];
            labels.push(label);
        });
        return labels;
    }
    //设置“默认”表情
    Chat.prototype.setDefault = function(defaultData,flag){
        var pre,id,data;
        if("face" === flag){
            pre = 10;
            id = "#"+this.faceType;
            data = defaultData.images;
            var dataResult = this.resetData(data,pre);
            this.resetTable(dataResult,id,flag);
            this.resetTitle(defaultData.tooltip,id);
        }else{
            pre = 7;
            id = "#"+this.sealType;
            data = defaultData;
            var dataResult = this.resetData(data,pre);
            this.resetTable(dataResult,id,flag);
        }
    }
    Chat.prototype.setData=function(data,flag){
       var keys,key={};
        if("face" === flag){
            keys = this.faceKeys;
        }else{
            keys = this.sealKeys;
        }
        this.setFaceSealData (data,keys,flag);
    }
    Chat.prototype.setFaceSealData=function(data,keys,flag){
        var dataNew={},key;
        if("face" === flag){
            $(data).each(function(i){
                key = keys[data[i].name];
                var faces = {};
                faces["images"] = data[i].images;
                faces["tooltip"] = data[i].tooltip;
                dataNew[key] = faces;
            });
            this.faceData  = dataNew;
        }else{
            $(data).each(function(i){
                key = keys[data[i]["TypeName"]];
                dataNew[key] =  data[i].List;
            });
            this.sealData  = dataNew;
        }
    }
    //设置表情title属性
    Chat.prototype.resetTitle = function(data,id){
        var td = $(id).find("tr td");
        $(td).each(function(i){
            $(this).attr("title",data[i]);
        });
    }
    //根据表情集确定每行显示个数并渲染数据
    Chat.prototype.resetTable=function(data,id,flag){
        var self = this,$table = $(id);
        $table.parent().show().siblings().hide();
        if("face" === flag){
            $(data).each(function(k,v){
                self.createTrNotTemplate(v,$table,"face");
            });
            this.faceDeal($table);
        }else{
            $.each(data,function(i){
                self.createTrNotTemplate(data[i],$table,"seal");
            });
            this.stampDeal($table);
        }
    }
    Chat.prototype.faceDeal=function($table){
        var self = this;
        $table.find("tr td").on("click",function(){
            self.faceTitle=  $(this).attr("title");
            self.faceSrc = $(this).find("img").attr("src");
            self.callPostArea();
            $("#face_dialog").hide();
        })
    }
    Chat.prototype.stampDeal=function($table){
        var self = this;
        $table.find("tr td").on("click",function(){
            var stampId= $(this).attr("id"),srcUin = self.reciver.id,pkt;
            if("0" == srcUin){
                alert("请选择要刻章的对象");
                return;
            }else{
                $("#seal_dialog").hide();
                pkt={cmd:"STAMP",des_uin:srcUin,type:self.stampType ,id:stampId};
            }
            testInterface.sendStamp(pkt);
            $("#seal_dialog").hide;
        });
    }
    Chat.prototype.moreFaces=function(){

    }
    //发送礼物或道具未触发跑到的处理事件
    Chat.prototype.setMod = function(data){
        var key = data.cmd;
        switch(key){
            case "CMD_GIFT":
                if("SEND_GIFT" === data.msg.cmd){
                    this.updateChat(data.msg);
                }
                break;
            default:
                break;
        }
    }
    Chat.prototype.updateChat=function(data){
        var giftCmd = data["giftcmd"];
        var objectImage = $("[cmd="+ giftCmd +"]","#deal").find("object").attr("data");
        var html = "<span style='color:#0093f0'>[礼]</span>",time="&nbsp;&nbsp;<span>"+ data["tim"] +"</span>&nbsp;&nbsp;",senderIcons = data["src_icons"],acceptIcons =data["des_icons"] ,sender = data["src_nick"],acceptor =data["des_nick"] ,senderImg="",acceptImg="";
        var desUin = data["des_uin"],srcUin = data["src_uin"],$dom = $("#public");
        $(senderIcons).each(function(i){
            senderImg += "<img src="+ senderIcons[i] +"/>";
        });
        $(acceptIcons).each(function(i){
            acceptImg += "<img src="+ acceptIcons[i] +"/>";
        });
        if(this.myId == srcUin){
            sender = "<span style='color:red;margin-right: 2px'>[你]</sapn>";
        }
        if(this.myId == desUin){
            acceptor = "<span style='color:red;margin-right: 2px'>[你]</sapn>";
        }
        html+=time+
              senderImg+
              "&nbsp;&nbsp;<span style='color:#669933'>"+
               sender+
               "</span>&nbsp;&nbsp;"+
               "<span style='color:#f42fa5'>("+ srcUin +")</span>&nbsp;&nbsp;<span color='blue'>送给</span>&nbsp;&nbsp;"
                  +acceptImg+
                 "&nbsp;&nbsp;<span style='color:#669933'>"+acceptor+"</span>&nbsp;&nbsp;"+
                 "<span style='color:#f42fa5'>("+ desUin +")</span>"+
                 "<object type='application/x-shockwave-flash' data='"+objectImage+"' width='40' height='40'><param name='wmode' value='transparent' /></object>"+data["num"]+"个";

        var div = document.createElement("div"),div1 = document.createElement("div");
        $(div).html(html);
        $(div1).html(html);
        if(this.myId == srcUin || this.myId == desUin){
            $dom = $("#private");
        }
        $dom.append( $(div));
        if(this.lockFlag ){}else{
            this.toBottom($dom);
        }
        $("#giftBodyOnly").append( $(div1));
    }
    Chat.prototype.welcome = function(data,flag){
        var roles = data["roles_info"],name=data["nick"],id=data.uin,$dom=$("#private");
        var stringHtml = "<span style='color:red'>[系]</span>",time =this.setTime(),nick="";
       if("other" == flag){
            $dom = $("#public");
            nick = "["+ data["nick"] +"]";
        }else{
            $dom = $("#private");
            nick = "[你]"
            $dom.empty();
            $("#public").empty();
        }
        stringHtml += time+"<span style='color:#ba2e2f'>&nbsp;&nbsp;欢迎</span><span id='welcome"+id+"'></span><span style='color:#2c8ef6'>"+ nick +"</span>"+"<span style='color:#FF0095'>("+ id +")</span>"+"<span style='color:#ba2e2f'>进入房间！</span>"
        this.resetChatNotTemplate(stringHtml,$dom);
        this.welcomeTemplate($dom,$("#welcome"+id),roles);
        //this.template($("#"+name+id),roles);
    }
//以下是点击礼物标签时事件
    Chat.prototype.resetGiftList=function(data){

    }

//以下是工具类通用方法，以后可提取为公用方法
    Chat.prototype.show=function(index,doms){
        doms.hide();
        doms.eq(index).show();
    }
    Chat.prototype.dialogOpen=function(type){
        var $dialog =$("#"+type+"_dialog");
       /* $dialog.dialog({
            autoOpen:false,
            modal : true,
            position:"top",
            open : function(event, ui) {
                $(".ui-dialog-titlebar-close").hide();
            }
        });
        $dialog.dialog().dialog("open");*/
        //$dialog.draggable();
        $dialog.show();
        $(".close","#"+type+"_dialog").click(function(){
            //$dialog.dialog().dialog("close");
            $dialog.hide();
        });
    }
    Chat.prototype.createTr=function(data,tmpl,dom){
        var tr = document.createElement("tr");
        $.template("stringTMPL",tmpl);
        $(tr).html($.tmpl("stringTMPL", data));
        $(tr).appendTo(dom);
    }
    Chat.prototype.createTrNotTemplate=function(data,dom,flag){
        var tr = document.createElement("tr"),html="";
        $(data).each(function(i){
           var result = data[i];
            if("face" == flag){
                html+=  '<td class="imgCode"><img src="'+ result["key"] +'"  width="25" height="25"/></td>';
            }else{
                html+= '<td class="imgCode" id="'+ result["StampID"] +'" title="'+ result["StampName"] +  result["StampMoney"]+'"><img src="'+ result["StampIco"] +'"/></td>';
            }
        });
        $(tr).html(html);
        $(tr).appendTo(dom);
    }
    Chat.prototype.template=function($div,tmpl,data){
        var string = "template";
        $.template(string, tmpl);
        $div.html($.tmpl(string, data));
    }
    Chat.prototype.welcomeTemplate=function($dom,$div,data){
        var html="";
        $(data).each(function(i){
            var result = data[i];
            html+='<a style="padding:0 2px;" href="#" title="'+ result["name"] +'"><img src="'+ result["role_small_icon"] +'"height="18"/></a>';
        });
        $div.html(html);
    }
    Chat.prototype.toBottom=function($dom){
        var scrollTop = $dom[0].scrollHeight;
        $dom.parent().parent().scrollTop (scrollTop);
    }
    //设置每行显示多少个表情
    Chat.prototype.resetData=function(dataFaces,pre){
        var dataNew=[],length = dataFaces.length,dataNow=[];
        if(7==pre){
            dataNow = dataFaces;
        }else{
            $(dataFaces).each(function(i){
                var data = {};
                data["key"] = dataFaces[i];
                dataNow.push(data);
            });
        }
        var dataNowLength = Math.floor(length/pre)+1;
        for(var i=0;i<dataNowLength ;i++){
            var data = dataNow.slice(i*pre,pre*i+pre);
            dataNew.push(data);
        }
        return dataNew;
    }
    Chat.prototype.clear=function(){

    }
    module.exports = Chat;
});