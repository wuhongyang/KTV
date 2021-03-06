/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-1-9
 * Time: 下午2:07
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){
    function ShowInfo(callBck) {
        this.options = {};
        this.systemNotice = $("#systemNotice");
        this.showInfoImgs = [];
        this.userChange = false;
        this.systemTmpl = '<span style="font-size: ${size};font-family: ${fontName};color:${color}">${text}</span>';
    }
    ShowInfo.prototype.init=function(msgArr){
        var array = [];
        $(msgArr).each(function(i){
            var obj = {},ai = msgArr[i],color = ai["clr"];
            obj.fontName = ai["font_name"];
            obj.color = "#"+color.substring(2,color.length);
            obj.size = ai["size"]+"px";
            obj.text = ai["text"];
            array.push(obj);
        });
        return array;
    }
    ShowInfo.prototype.callUserChange = function(change){
        this.userChange  = change;
    }
    ShowInfo.prototype.resetInfo = function(data) {
        var imgObj = data.slice(0,1)[0],msgArr = data.slice(1,data.length);
        this.showInfoImgs.push(imgObj);
        var data = this.init(msgArr);
        //$systemNotice.empty();
        $.template("systemTmpl", this.systemTmpl );
        var html = $.tmpl("systemTmpl", data);
        var li = document.createElement("li"),object = document.createElement("object"),param = '<param name="wmode" value="transparent" />',length=this.systemNotice.find("li").length;
        $(object).attr("type","application/x-shockwave-flash");
        $(object).attr("data",imgObj["part"]);
        $(object).attr("width",imgObj["width"]);
        $(object).attr("height",imgObj["height"]);
        $(object).append(param);
        $(li).css("margin-top","10px");
        $(li).append(html);
        $(li).append($(object));
        if(this.userChange){
            this.systemNotice.empty();
        }else{
            if(length<3){

            }else{
                this.systemNotice.find("li").eq(0).remove();

            }
        }

        this.systemNotice .append($(li));
    }

    module.exports = ShowInfo;
});

