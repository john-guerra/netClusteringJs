
/*
	Copyright 2010 by Robin W. Spencer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You can find a copy of the GNU General Public License
    at http://www.gnu.org/licenses/.

*/
/*
*/
function NewmanClustering() {
    "use strict";

    var self = this;

    var globals={
        debugTime:new Date().getTime(),
        timeTags:[]
    };
    //  Generic utilities
    // function console(text,showTiming){
    //     var timing=" ";
    //     if(showTiming){
    //         var then=globals.debugTime;
    //         var now=new Date().getTime();
    //         globals.debugTime=now;
    //         var digits=Math.max(0,Math.floor(Math.log(now-then+1)*Math.LOG10E));
    //         var spaces="";
    //         for(var i=0;i<(7-digits);i++){spaces+="&nbsp;";}
    //         timing="<span style='color:blue'>"+spaces+(now-then)+": <\/span>";
    //     }
    //     var e=document.getElementById("console");
    //     e.innerHTML+=timing+text+"<br\/>";
    //     e.scrollTop=e.scrollHeight;
    // }
    function logTime(tag){
        var then=globals.debugTime;
        var now=new Date().getTime();
        globals.debugTime=now;
        if(!globals.timeTags[tag]){ globals.timeTags[tag] = []; }
        globals.timeTags[tag].push((now-then));
    }
    function showTimes(){
        var t="",
            grandSum=0,
            tag,
            sum, i;
        for(tag in globals.timeTags){
            sum=0;
            for(i=0;i<globals.timeTags[tag].length;i++){
                sum+=globals.timeTags[tag][i];
            }
            grandSum+=sum;
        }
        for(tag in globals.timeTags){
            sum=0;
            for(i=0;i<globals.timeTags[tag].length;i++){
                sum+=globals.timeTags[tag][i];
            }
            t+=tag+"  took "+sum+" ms ("+Math.round(100*sum/grandSum)+"%)<br>";
        }
        // console(t);
    }
    function unique(a){
      //  Return an alphabetized copy of the unique items in any array
      a.sort(function(x,y){return x<y?-1:1;});
      var b=[];
      var previous="";
      for(var i=0;i<a.length;i++){
         if(a[i]!==previous){
            b.push(a[i]);
            previous=a[i];
         }
      }
      return b;
    }
    function isArray(a){
        return a.constructor === Array;
    }
    // function HSVtoRGB(h,s,v,opacity){
    //     // Inputs h=hue=0-360, s=saturation=0-1, v=value=0-1
    //     // Algorithm from Wikipedia on HSV conversion
    //     var toHex=function(decimalValue,places){
    //         if(places === undefined || isNaN(places))  places = 2;
    //         var hex = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
    //         var next = 0;
    //         var hexidecimal = "";
    //         decimalValue=Math.floor(decimalValue);
    //         while(decimalValue > 0){
    //             next = decimalValue % 16;
    //             decimalValue = Math.floor((decimalValue - next)/16);
    //             hexidecimal = hex[next] + hexidecimal;
    //         }
    //         while (hexidecimal.length<places){
    //             hexidecimal = "0"+hexidecimal;
    //         }
    //         return hexidecimal;
    //     };

    //     var hi=Math.floor(h/60)%6;
    //     var f=h/60-Math.floor(h/60);
    //     var p=v*(1-s);
    //     var q=v*(1-f*s);
    //     var t=v*(1-(1-f)*s);
    //     var r=v;  // case hi==0 below
    //     var g=t;
    //     var b=p;
    //     switch(hi){
    //         case 1:r=q;g=v;b=p;break;
    //         case 2:r=p;g=v;b=t;break;
    //         case 3:r=p;g=q;b=v;break;
    //         case 4:r=t;g=p;b=v;break;
    //         case 5:r=v;g=p;b=q;break;
    //     }
    //     //  At this point r,g,b are in 0...1 range.  Now convert into rgba or #FFFFFF notation
    //     if(opacity){
    //         return "rgba("+Math.round(255*r)+","+Math.round(255*g)+","+Math.round(255*b)+","+opacity+")";
    //     }else{
    //        return "#"+toHex(r*255)+toHex(g*255)+toHex(b*255);
    //     }
    // }
    // function hexToCanvasColor(hexColor,opacity){
    //     // Convert #AA77CC to rbga() format for Firefox
    //     opacity=opacity || "1.0";
    //     hexColor=hexColor.replace("#","");
    //     var r=parseInt(hexColor.substring(0,2),16);
    //     var g=parseInt(hexColor.substring(2,4),16);
    //     var b=parseInt(hexColor.substring(4,6),16);
    //     return "rgba("+r+","+g+","+b+","+opacity+")";
    // }
    function toggle(eid){
        var e=document.getElementById(eid);
        if(e){
            if(e.style.display=="none"){
                e.style.display="block";
            }else{
                e.style.display="none";
            }
        }
    }
    //  Embedded datasets and pre-processing routines
    function dreamData(){
        return [
            {"speech":0,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":1,"scene":"Act I, Scene I","name":"Hippolyta"},
            {"speech":2,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":3,"scene":"Act I, Scene I","name":"Egeus"},
            {"speech":4,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":5,"scene":"Act I, Scene I","name":"Egeus"},
            {"speech":6,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":7,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":8,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":9,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":10,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":11,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":12,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":13,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":14,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":15,"scene":"Act I, Scene I","name":"Demetrius"},
            {"speech":16,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":17,"scene":"Act I, Scene I","name":"Egeus"},
            {"speech":18,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":19,"scene":"Act I, Scene I","name":"Theseus"},
            {"speech":20,"scene":"Act I, Scene I","name":"Egeus"},
            {"speech":21,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":22,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":23,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":24,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":25,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":26,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":27,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":28,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":29,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":30,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":31,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":32,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":33,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":34,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":35,"scene":"Act I, Scene I","name":"Helena"},
            {"speech":36,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":37,"scene":"Act I, Scene I","name":"Helena"},
            {"speech":38,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":39,"scene":"Act I, Scene I","name":"Helena"},
            {"speech":40,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":41,"scene":"Act I, Scene I","name":"Helena"},
            {"speech":42,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":43,"scene":"Act I, Scene I","name":"Helena"},
            {"speech":44,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":45,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":46,"scene":"Act I, Scene I","name":"Hermia"},
            {"speech":47,"scene":"Act I, Scene I","name":"Lysander"},
            {"speech":48,"scene":"Act I, Scene I","name":"Helena"},
            {"speech":49,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":50,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":51,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":52,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":53,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":54,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":55,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":56,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":57,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":58,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":59,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":60,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":61,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":62,"scene":"Act I, Scene II","name":"Flute"},
            {"speech":63,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":64,"scene":"Act I, Scene II","name":"Flute"},
            {"speech":65,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":66,"scene":"Act I, Scene II","name":"Flute"},
            {"speech":67,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":68,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":69,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":70,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":71,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":72,"scene":"Act I, Scene II","name":"Starveling"},
            {"speech":73,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":74,"scene":"Act I, Scene II","name":"Snout"},
            {"speech":75,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":76,"scene":"Act I, Scene II","name":"Snug"},
            {"speech":77,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":78,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":79,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":80,"scene":"Act I, Scene II","name":"All"},
            {"speech":81,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":82,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":83,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":84,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":85,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":86,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":87,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":88,"scene":"Act I, Scene II","name":"Quince"},
            {"speech":89,"scene":"Act I, Scene II","name":"Bottom"},
            {"speech":90,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":91,"scene":"Act II, Scene I","name":"Fairy"},
            {"speech":92,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":93,"scene":"Act II, Scene I","name":"Fairy"},
            {"speech":94,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":95,"scene":"Act II, Scene I","name":"Fairy"},
            {"speech":96,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":97,"scene":"Act II, Scene I","name":"Titania"},
            {"speech":98,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":99,"scene":"Act II, Scene I","name":"Titania"},
            {"speech":100,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":101,"scene":"Act II, Scene I","name":"Titania"},
            {"speech":102,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":103,"scene":"Act II, Scene I","name":"Titania"},
            {"speech":104,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":105,"scene":"Act II, Scene I","name":"Titania"},
            {"speech":106,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":107,"scene":"Act II, Scene I","name":"Titania"},
            {"speech":108,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":109,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":110,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":111,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":112,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":113,"scene":"Act II, Scene I","name":"Demetrius"},
            {"speech":114,"scene":"Act II, Scene I","name":"Helena"},
            {"speech":115,"scene":"Act II, Scene I","name":"Demetrius"},
            {"speech":116,"scene":"Act II, Scene I","name":"Helena"},
            {"speech":117,"scene":"Act II, Scene I","name":"Demetrius"},
            {"speech":118,"scene":"Act II, Scene I","name":"Helena"},
            {"speech":119,"scene":"Act II, Scene I","name":"Demetrius"},
            {"speech":120,"scene":"Act II, Scene I","name":"Helena"},
            {"speech":121,"scene":"Act II, Scene I","name":"Demetrius"},
            {"speech":122,"scene":"Act II, Scene I","name":"Helena"},
            {"speech":123,"scene":"Act II, Scene I","name":"Demetrius"},
            {"speech":124,"scene":"Act II, Scene I","name":"Helena"},
            {"speech":125,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":126,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":127,"scene":"Act II, Scene I","name":"Oberon"},
            {"speech":128,"scene":"Act II, Scene I","name":"Puck"},
            {"speech":129,"scene":"Act II, Scene II","name":"Titania"},
            {"speech":130,"scene":"Act II, Scene II","name":"Fairy"},
            {"speech":131,"scene":"Act II, Scene II","name":"Oberon"},
            {"speech":132,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":133,"scene":"Act II, Scene II","name":"Hermia"},
            {"speech":134,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":135,"scene":"Act II, Scene II","name":"Hermia"},
            {"speech":136,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":137,"scene":"Act II, Scene II","name":"Hermia"},
            {"speech":138,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":139,"scene":"Act II, Scene II","name":"Hermia"},
            {"speech":140,"scene":"Act II, Scene II","name":"Puck"},
            {"speech":141,"scene":"Act II, Scene II","name":"Helena"},
            {"speech":142,"scene":"Act II, Scene II","name":"Demetrius"},
            {"speech":143,"scene":"Act II, Scene II","name":"Helena"},
            {"speech":144,"scene":"Act II, Scene II","name":"Demetrius"},
            {"speech":145,"scene":"Act II, Scene II","name":"Helena"},
            {"speech":146,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":147,"scene":"Act II, Scene II","name":"Helena"},
            {"speech":148,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":149,"scene":"Act II, Scene II","name":"Helena"},
            {"speech":150,"scene":"Act II, Scene II","name":"Lysander"},
            {"speech":151,"scene":"Act II, Scene II","name":"Hermia"},
            {"speech":152,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":153,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":154,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":155,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":156,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":157,"scene":"Act III, Scene I","name":"Snout"},
            {"speech":158,"scene":"Act III, Scene I","name":"Starveling"},
            {"speech":159,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":160,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":161,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":162,"scene":"Act III, Scene I","name":"Snout"},
            {"speech":163,"scene":"Act III, Scene I","name":"Starveling"},
            {"speech":164,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":165,"scene":"Act III, Scene I","name":"Snout"},
            {"speech":166,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":167,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":168,"scene":"Act III, Scene I","name":"Snout"},
            {"speech":169,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":170,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":171,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":172,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":173,"scene":"Act III, Scene I","name":"Snout"},
            {"speech":174,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":175,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":176,"scene":"Act III, Scene I","name":"Puck"},
            {"speech":177,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":178,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":179,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":180,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":181,"scene":"Act III, Scene I","name":"Puck"},
            {"speech":182,"scene":"Act III, Scene I","name":"Flute"},
            {"speech":183,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":184,"scene":"Act III, Scene I","name":"Flute"},
            {"speech":185,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":186,"scene":"Act III, Scene I","name":"Flute"},
            {"speech":187,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":188,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":189,"scene":"Act III, Scene I","name":"Puck"},
            {"speech":190,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":191,"scene":"Act III, Scene I","name":"Snout"},
            {"speech":192,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":193,"scene":"Act III, Scene I","name":"Quince"},
            {"speech":194,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":195,"scene":"Act III, Scene I","name":"Titania"},
            {"speech":196,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":197,"scene":"Act III, Scene I","name":"Titania"},
            {"speech":198,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":199,"scene":"Act III, Scene I","name":"Titania"},
            {"speech":200,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":201,"scene":"Act III, Scene I","name":"Titania"},
            {"speech":202,"scene":"Act III, Scene I","name":"Peaseblossom"},
            {"speech":203,"scene":"Act III, Scene I","name":"Cobweb"},
            {"speech":204,"scene":"Act III, Scene I","name":"Moth"},
            {"speech":205,"scene":"Act III, Scene I","name":"Mustardseed"},
            {"speech":206,"scene":"Act III, Scene I","name":"All"},
            {"speech":207,"scene":"Act III, Scene I","name":"Titania"},
            {"speech":208,"scene":"Act III, Scene I","name":"Peaseblossom"},
            {"speech":209,"scene":"Act III, Scene I","name":"Cobweb"},
            {"speech":210,"scene":"Act III, Scene I","name":"Moth"},
            {"speech":211,"scene":"Act III, Scene I","name":"Mustardseed"},
            {"speech":212,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":213,"scene":"Act III, Scene I","name":"Cobweb"},
            {"speech":214,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":215,"scene":"Act III, Scene I","name":"Peaseblossom"},
            {"speech":216,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":217,"scene":"Act III, Scene I","name":"Mustardseed"},
            {"speech":218,"scene":"Act III, Scene I","name":"Bottom"},
            {"speech":219,"scene":"Act III, Scene I","name":"Titania"},
            {"speech":220,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":221,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":222,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":223,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":224,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":225,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":226,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":227,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":228,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":229,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":230,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":231,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":232,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":233,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":234,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":235,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":236,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":237,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":238,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":239,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":240,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":241,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":242,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":243,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":244,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":245,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":246,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":247,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":248,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":249,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":250,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":251,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":252,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":253,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":254,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":255,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":256,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":257,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":258,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":259,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":260,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":261,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":262,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":263,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":264,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":265,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":266,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":267,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":268,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":269,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":270,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":271,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":272,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":273,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":274,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":275,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":276,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":277,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":278,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":279,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":280,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":281,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":282,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":283,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":284,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":285,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":286,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":287,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":288,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":289,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":290,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":291,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":292,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":293,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":294,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":295,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":296,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":297,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":298,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":299,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":300,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":301,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":302,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":303,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":304,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":305,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":306,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":307,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":308,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":309,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":310,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":311,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":312,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":313,"scene":"Act III, Scene II","name":"Oberon"},
            {"speech":314,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":315,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":316,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":317,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":318,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":319,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":320,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":321,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":322,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":323,"scene":"Act III, Scene II","name":"Lysander"},
            {"speech":324,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":325,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":326,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":327,"scene":"Act III, Scene II","name":"Demetrius"},
            {"speech":328,"scene":"Act III, Scene II","name":"Helena"},
            {"speech":329,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":330,"scene":"Act III, Scene II","name":"Hermia"},
            {"speech":331,"scene":"Act III, Scene II","name":"Puck"},
            {"speech":332,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":333,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":334,"scene":"Act IV, Scene I","name":"Peaseblossom"},
            {"speech":335,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":336,"scene":"Act IV, Scene I","name":"Cobweb"},
            {"speech":337,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":338,"scene":"Act IV, Scene I","name":"Mustardseed"},
            {"speech":339,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":340,"scene":"Act IV, Scene I","name":"Mustardseed"},
            {"speech":341,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":342,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":343,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":344,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":345,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":346,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":347,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":348,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":349,"scene":"Act IV, Scene I","name":"Oberon"},
            {"speech":350,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":351,"scene":"Act IV, Scene I","name":"Oberon"},
            {"speech":352,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":353,"scene":"Act IV, Scene I","name":"Oberon"},
            {"speech":354,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":355,"scene":"Act IV, Scene I","name":"Puck"},
            {"speech":356,"scene":"Act IV, Scene I","name":"Oberon"},
            {"speech":357,"scene":"Act IV, Scene I","name":"Puck"},
            {"speech":358,"scene":"Act IV, Scene I","name":"Oberon"},
            {"speech":359,"scene":"Act IV, Scene I","name":"Titania"},
            {"speech":360,"scene":"Act IV, Scene I","name":"Theseus"},
            {"speech":361,"scene":"Act IV, Scene I","name":"Hippolyta"},
            {"speech":362,"scene":"Act IV, Scene I","name":"Theseus"},
            {"speech":363,"scene":"Act IV, Scene I","name":"Egeus"},
            {"speech":364,"scene":"Act IV, Scene I","name":"Theseus"},
            {"speech":365,"scene":"Act IV, Scene I","name":"Egeus"},
            {"speech":366,"scene":"Act IV, Scene I","name":"Theseus"},
            {"speech":367,"scene":"Act IV, Scene I","name":"Lysander"},
            {"speech":368,"scene":"Act IV, Scene I","name":"Theseus"},
            {"speech":369,"scene":"Act IV, Scene I","name":"Lysander"},
            {"speech":370,"scene":"Act IV, Scene I","name":"Egeus"},
            {"speech":371,"scene":"Act IV, Scene I","name":"Demetrius"},
            {"speech":372,"scene":"Act IV, Scene I","name":"Theseus"},
            {"speech":373,"scene":"Act IV, Scene I","name":"Demetrius"},
            {"speech":374,"scene":"Act IV, Scene I","name":"Hermia"},
            {"speech":375,"scene":"Act IV, Scene I","name":"Helena"},
            {"speech":376,"scene":"Act IV, Scene I","name":"Demetrius"},
            {"speech":377,"scene":"Act IV, Scene I","name":"Hermia"},
            {"speech":378,"scene":"Act IV, Scene I","name":"Helena"},
            {"speech":379,"scene":"Act IV, Scene I","name":"Lysander"},
            {"speech":380,"scene":"Act IV, Scene I","name":"Demetrius"},
            {"speech":381,"scene":"Act IV, Scene I","name":"Bottom"},
            {"speech":382,"scene":"Act IV, Scene II","name":"Quince"},
            {"speech":383,"scene":"Act IV, Scene II","name":"Starveling"},
            {"speech":384,"scene":"Act IV, Scene II","name":"Flute"},
            {"speech":385,"scene":"Act IV, Scene II","name":"Quince"},
            {"speech":386,"scene":"Act IV, Scene II","name":"Flute"},
            {"speech":387,"scene":"Act IV, Scene II","name":"Quince"},
            {"speech":388,"scene":"Act IV, Scene II","name":"Flute"},
            {"speech":389,"scene":"Act IV, Scene II","name":"Snug"},
            {"speech":390,"scene":"Act IV, Scene II","name":"Flute"},
            {"speech":391,"scene":"Act IV, Scene II","name":"Bottom"},
            {"speech":392,"scene":"Act IV, Scene II","name":"Quince"},
            {"speech":393,"scene":"Act IV, Scene II","name":"Bottom"},
            {"speech":394,"scene":"Act IV, Scene II","name":"Quince"},
            {"speech":395,"scene":"Act IV, Scene II","name":"Bottom"},
            {"speech":396,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":397,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":398,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":399,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":400,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":401,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":402,"scene":"Act V, Scene I","name":"Philostrate"},
            {"speech":403,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":404,"scene":"Act V, Scene I","name":"Philostrate"},
            {"speech":405,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":406,"scene":"Act V, Scene I","name":"Philostrate"},
            {"speech":407,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":408,"scene":"Act V, Scene I","name":"Philostrate"},
            {"speech":409,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":410,"scene":"Act V, Scene I","name":"Philostrate"},
            {"speech":411,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":412,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":413,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":414,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":415,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":416,"scene":"Act V, Scene I","name":"Philostrate"},
            {"speech":417,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":418,"scene":"Act V, Scene I","name":"Prologue"},
            {"speech":419,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":420,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":421,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":422,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":423,"scene":"Act V, Scene I","name":"Prologue"},
            {"speech":424,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":425,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":426,"scene":"Act V, Scene I","name":"Wall"},
            {"speech":427,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":428,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":429,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":430,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":431,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":432,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":433,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":434,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":435,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":436,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":437,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":438,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":439,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":440,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":441,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":442,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":443,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":444,"scene":"Act V, Scene I","name":"Wall"},
            {"speech":445,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":446,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":447,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":448,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":449,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":450,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":451,"scene":"Act V, Scene I","name":"Lion"},
            {"speech":452,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":453,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":454,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":455,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":456,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":457,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":458,"scene":"Act V, Scene I","name":"Moonshine"},
            {"speech":459,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":460,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":461,"scene":"Act V, Scene I","name":"Moonshine"},
            {"speech":462,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":463,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":464,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":465,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":466,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":467,"scene":"Act V, Scene I","name":"Moonshine"},
            {"speech":468,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":469,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":470,"scene":"Act V, Scene I","name":"Lion"},
            {"speech":471,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":472,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":473,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":474,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":475,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":476,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":477,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":478,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":479,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":480,"scene":"Act V, Scene I","name":"Pyramus"},
            {"speech":481,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":482,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":483,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":484,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":485,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":486,"scene":"Act V, Scene I","name":"Hippolyta"},
            {"speech":487,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":488,"scene":"Act V, Scene I","name":"Lysander"},
            {"speech":489,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":490,"scene":"Act V, Scene I","name":"Thisbe"},
            {"speech":491,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":492,"scene":"Act V, Scene I","name":"Demetrius"},
            {"speech":493,"scene":"Act V, Scene I","name":"Bottom"},
            {"speech":494,"scene":"Act V, Scene I","name":"Theseus"},
            {"speech":495,"scene":"Act V, Scene I","name":"Puck"},
            {"speech":496,"scene":"Act V, Scene I","name":"Oberon"},
            {"speech":497,"scene":"Act V, Scene I","name":"Titania"},
            {"speech":498,"scene":"Act V, Scene I","name":"Oberon"},
            {"speech":499,"scene":"Act V, Scene I","name":"Puck"}
        ];
    }
    function romeoData(){
        return [
            {"speech":0,"scene":"","name":"Chorus"},
            {"speech":1,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":2,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":3,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":4,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":5,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":6,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":7,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":8,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":9,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":10,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":11,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":12,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":13,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":14,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":15,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":16,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":17,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":18,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":19,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":20,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":21,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":22,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":23,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":24,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":25,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":26,"scene":"Act I, Scene I","name":"Abraham"},
            {"speech":27,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":28,"scene":"Act I, Scene I","name":"Abraham"},
            {"speech":29,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":30,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":31,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":32,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":33,"scene":"Act I, Scene I","name":"Abraham"},
            {"speech":34,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":35,"scene":"Act I, Scene I","name":"Abraham"},
            {"speech":36,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":37,"scene":"Act I, Scene I","name":"Gregory"},
            {"speech":38,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":39,"scene":"Act I, Scene I","name":"Abraham"},
            {"speech":40,"scene":"Act I, Scene I","name":"Sampson"},
            {"speech":41,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":42,"scene":"Act I, Scene I","name":"Tybalt"},
            {"speech":43,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":44,"scene":"Act I, Scene I","name":"Tybalt"},
            {"speech":45,"scene":"Act I, Scene I","name":"First Citizen"},
            {"speech":46,"scene":"Act I, Scene I","name":"Capulet"},
            {"speech":47,"scene":"Act I, Scene I","name":"Lady Capulet"},
            {"speech":48,"scene":"Act I, Scene I","name":"Capulet"},
            {"speech":49,"scene":"Act I, Scene I","name":"Montague"},
            {"speech":50,"scene":"Act I, Scene I","name":"Lady Montague"},
            {"speech":51,"scene":"Act I, Scene I","name":"Prince"},
            {"speech":52,"scene":"Act I, Scene I","name":"Montague"},
            {"speech":53,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":54,"scene":"Act I, Scene I","name":"Lady Montague"},
            {"speech":55,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":56,"scene":"Act I, Scene I","name":"Montague"},
            {"speech":57,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":58,"scene":"Act I, Scene I","name":"Montague"},
            {"speech":59,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":60,"scene":"Act I, Scene I","name":"Montague"},
            {"speech":61,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":62,"scene":"Act I, Scene I","name":"Montague"},
            {"speech":63,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":64,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":65,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":66,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":67,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":68,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":69,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":70,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":71,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":72,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":73,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":74,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":75,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":76,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":77,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":78,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":79,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":80,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":81,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":82,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":83,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":84,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":85,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":86,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":87,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":88,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":89,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":90,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":91,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":92,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":93,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":94,"scene":"Act I, Scene I","name":"Romeo"},
            {"speech":95,"scene":"Act I, Scene I","name":"Benvolio"},
            {"speech":96,"scene":"Act I, Scene II","name":"Capulet"},
            {"speech":97,"scene":"Act I, Scene II","name":"Paris"},
            {"speech":98,"scene":"Act I, Scene II","name":"Capulet"},
            {"speech":99,"scene":"Act I, Scene II","name":"Paris"},
            {"speech":100,"scene":"Act I, Scene II","name":"Capulet"},
            {"speech":101,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":102,"scene":"Act I, Scene II","name":"Benvolio"},
            {"speech":103,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":104,"scene":"Act I, Scene II","name":"Benvolio"},
            {"speech":105,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":106,"scene":"Act I, Scene II","name":"Benvolio"},
            {"speech":107,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":108,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":109,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":110,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":111,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":112,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":113,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":114,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":115,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":116,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":117,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":118,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":119,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":120,"scene":"Act I, Scene II","name":"Servant"},
            {"speech":121,"scene":"Act I, Scene II","name":"Benvolio"},
            {"speech":122,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":123,"scene":"Act I, Scene II","name":"Benvolio"},
            {"speech":124,"scene":"Act I, Scene II","name":"Romeo"},
            {"speech":125,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":126,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":127,"scene":"Act I, Scene III","name":"Juliet"},
            {"speech":128,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":129,"scene":"Act I, Scene III","name":"Juliet"},
            {"speech":130,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":131,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":132,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":133,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":134,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":135,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":136,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":137,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":138,"scene":"Act I, Scene III","name":"Juliet"},
            {"speech":139,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":140,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":141,"scene":"Act I, Scene III","name":"Juliet"},
            {"speech":142,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":143,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":144,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":145,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":146,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":147,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":148,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":149,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":150,"scene":"Act I, Scene III","name":"Juliet"},
            {"speech":151,"scene":"Act I, Scene III","name":"Servant"},
            {"speech":152,"scene":"Act I, Scene III","name":"Lady Capulet"},
            {"speech":153,"scene":"Act I, Scene III","name":"Nurse"},
            {"speech":154,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":155,"scene":"Act I, Scene IV","name":"Benvolio"},
            {"speech":156,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":157,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":158,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":159,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":160,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":161,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":162,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":163,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":164,"scene":"Act I, Scene IV","name":"Benvolio"},
            {"speech":165,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":166,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":167,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":168,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":169,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":170,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":171,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":172,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":173,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":174,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":175,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":176,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":177,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":178,"scene":"Act I, Scene IV","name":"Mercutio"},
            {"speech":179,"scene":"Act I, Scene IV","name":"Benvolio"},
            {"speech":180,"scene":"Act I, Scene IV","name":"Romeo"},
            {"speech":181,"scene":"Act I, Scene IV","name":"Benvolio"},
            {"speech":182,"scene":"Act I, Scene V","name":"First Servant"},
            {"speech":183,"scene":"Act I, Scene V","name":"Second Servant"},
            {"speech":184,"scene":"Act I, Scene V","name":"First Servant"},
            {"speech":185,"scene":"Act I, Scene V","name":"Second Servant"},
            {"speech":186,"scene":"Act I, Scene V","name":"First Servant"},
            {"speech":187,"scene":"Act I, Scene V","name":"Second Servant"},
            {"speech":188,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":189,"scene":"Act I, Scene V","name":"Second Capulet"},
            {"speech":190,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":191,"scene":"Act I, Scene V","name":"Second Capulet"},
            {"speech":192,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":193,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":194,"scene":"Act I, Scene V","name":"Servant"},
            {"speech":195,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":196,"scene":"Act I, Scene V","name":"Tybalt"},
            {"speech":197,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":198,"scene":"Act I, Scene V","name":"Tybalt"},
            {"speech":199,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":200,"scene":"Act I, Scene V","name":"Tybalt"},
            {"speech":201,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":202,"scene":"Act I, Scene V","name":"Tybalt"},
            {"speech":203,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":204,"scene":"Act I, Scene V","name":"Tybalt"},
            {"speech":205,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":206,"scene":"Act I, Scene V","name":"Tybalt"},
            {"speech":207,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":208,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":209,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":210,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":211,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":212,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":213,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":214,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":215,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":216,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":217,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":218,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":219,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":220,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":221,"scene":"Act I, Scene V","name":"Benvolio"},
            {"speech":222,"scene":"Act I, Scene V","name":"Romeo"},
            {"speech":223,"scene":"Act I, Scene V","name":"Capulet"},
            {"speech":224,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":225,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":226,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":227,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":228,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":229,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":230,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":231,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":232,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":233,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":234,"scene":"Act I, Scene V","name":"Juliet"},
            {"speech":235,"scene":"Act I, Scene V","name":"Nurse"},
            {"speech":236,"scene":"Act I, Scene V","name":"Chorus"},
            {"speech":237,"scene":"Act II, Scene I","name":"Romeo"},
            {"speech":238,"scene":"Act II, Scene I","name":"Benvolio"},
            {"speech":239,"scene":"Act II, Scene I","name":"Mercutio"},
            {"speech":240,"scene":"Act II, Scene I","name":"Benvolio"},
            {"speech":241,"scene":"Act II, Scene I","name":"Mercutio"},
            {"speech":242,"scene":"Act II, Scene I","name":"Benvolio"},
            {"speech":243,"scene":"Act II, Scene I","name":"Mercutio"},
            {"speech":244,"scene":"Act II, Scene I","name":"Benvolio"},
            {"speech":245,"scene":"Act II, Scene I","name":"Mercutio"},
            {"speech":246,"scene":"Act II, Scene I","name":"Benvolio"},
            {"speech":247,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":248,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":249,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":250,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":251,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":252,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":253,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":254,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":255,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":256,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":257,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":258,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":259,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":260,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":261,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":262,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":263,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":264,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":265,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":266,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":267,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":268,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":269,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":270,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":271,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":272,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":273,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":274,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":275,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":276,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":277,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":278,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":279,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":280,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":281,"scene":"Act II, Scene II","name":"Nurse"},
            {"speech":282,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":283,"scene":"Act II, Scene II","name":"Nurse"},
            {"speech":284,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":285,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":286,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":287,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":288,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":289,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":290,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":291,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":292,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":293,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":294,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":295,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":296,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":297,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":298,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":299,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":300,"scene":"Act II, Scene II","name":"Juliet"},
            {"speech":301,"scene":"Act II, Scene II","name":"Romeo"},
            {"speech":302,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":303,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":304,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":305,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":306,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":307,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":308,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":309,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":310,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":311,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":312,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":313,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":314,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":315,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":316,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":317,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":318,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":319,"scene":"Act II, Scene III","name":"Romeo"},
            {"speech":320,"scene":"Act II, Scene III","name":"Friar Laurence"},
            {"speech":321,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":322,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":323,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":324,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":325,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":326,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":327,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":328,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":329,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":330,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":331,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":332,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":333,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":334,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":335,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":336,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":337,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":338,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":339,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":340,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":341,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":342,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":343,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":344,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":345,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":346,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":347,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":348,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":349,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":350,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":351,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":352,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":353,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":354,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":355,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":356,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":357,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":358,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":359,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":360,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":361,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":362,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":363,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":364,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":365,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":366,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":367,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":368,"scene":"Act II, Scene IV","name":"Peter"},
            {"speech":369,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":370,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":371,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":372,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":373,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":374,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":375,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":376,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":377,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":378,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":379,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":380,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":381,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":382,"scene":"Act II, Scene IV","name":"Benvolio"},
            {"speech":383,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":384,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":385,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":386,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":387,"scene":"Act II, Scene IV","name":"Mercutio"},
            {"speech":388,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":389,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":390,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":391,"scene":"Act II, Scene IV","name":"Peter"},
            {"speech":392,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":393,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":394,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":395,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":396,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":397,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":398,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":399,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":400,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":401,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":402,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":403,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":404,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":405,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":406,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":407,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":408,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":409,"scene":"Act II, Scene IV","name":"Romeo"},
            {"speech":410,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":411,"scene":"Act II, Scene IV","name":"Peter"},
            {"speech":412,"scene":"Act II, Scene IV","name":"Nurse"},
            {"speech":413,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":414,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":415,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":416,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":417,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":418,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":419,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":420,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":421,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":422,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":423,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":424,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":425,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":426,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":427,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":428,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":429,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":430,"scene":"Act II, Scene V","name":"Nurse"},
            {"speech":431,"scene":"Act II, Scene V","name":"Juliet"},
            {"speech":432,"scene":"Act II, Scene VI","name":"Friar Laurence"},
            {"speech":433,"scene":"Act II, Scene VI","name":"Romeo"},
            {"speech":434,"scene":"Act II, Scene VI","name":"Friar Laurence"},
            {"speech":435,"scene":"Act II, Scene VI","name":"Juliet"},
            {"speech":436,"scene":"Act II, Scene VI","name":"Friar Laurence"},
            {"speech":437,"scene":"Act II, Scene VI","name":"Juliet"},
            {"speech":438,"scene":"Act II, Scene VI","name":"Romeo"},
            {"speech":439,"scene":"Act II, Scene VI","name":"Juliet"},
            {"speech":440,"scene":"Act II, Scene VI","name":"Friar Laurence"},
            {"speech":441,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":442,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":443,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":444,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":445,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":446,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":447,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":448,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":449,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":450,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":451,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":452,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":453,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":454,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":455,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":456,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":457,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":458,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":459,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":460,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":461,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":462,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":463,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":464,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":465,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":466,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":467,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":468,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":469,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":470,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":471,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":472,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":473,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":474,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":475,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":476,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":477,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":478,"scene":"Act III, Scene I","name":"Mercutio"},
            {"speech":479,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":480,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":481,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":482,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":483,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":484,"scene":"Act III, Scene I","name":"Tybalt"},
            {"speech":485,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":486,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":487,"scene":"Act III, Scene I","name":"Romeo"},
            {"speech":488,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":489,"scene":"Act III, Scene I","name":"First Citizen"},
            {"speech":490,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":491,"scene":"Act III, Scene I","name":"First Citizen"},
            {"speech":492,"scene":"Act III, Scene I","name":"Prince"},
            {"speech":493,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":494,"scene":"Act III, Scene I","name":"Lady Capulet"},
            {"speech":495,"scene":"Act III, Scene I","name":"Prince"},
            {"speech":496,"scene":"Act III, Scene I","name":"Benvolio"},
            {"speech":497,"scene":"Act III, Scene I","name":"Lady Capulet"},
            {"speech":498,"scene":"Act III, Scene I","name":"Prince"},
            {"speech":499,"scene":"Act III, Scene I","name":"Montague"},
            {"speech":500,"scene":"Act III, Scene I","name":"Prince"},
            {"speech":501,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":502,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":503,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":504,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":505,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":506,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":507,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":508,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":509,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":510,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":511,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":512,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":513,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":514,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":515,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":516,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":517,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":518,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":519,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":520,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":521,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":522,"scene":"Act III, Scene II","name":"Nurse"},
            {"speech":523,"scene":"Act III, Scene II","name":"Juliet"},
            {"speech":524,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":525,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":526,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":527,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":528,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":529,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":530,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":531,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":532,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":533,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":534,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":535,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":536,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":537,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":538,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":539,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":540,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":541,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":542,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":543,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":544,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":545,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":546,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":547,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":548,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":549,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":550,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":551,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":552,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":553,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":554,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":555,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":556,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":557,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":558,"scene":"Act III, Scene III","name":"Nurse"},
            {"speech":559,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":560,"scene":"Act III, Scene III","name":"Friar Laurence"},
            {"speech":561,"scene":"Act III, Scene III","name":"Romeo"},
            {"speech":562,"scene":"Act III, Scene IV","name":"Capulet"},
            {"speech":563,"scene":"Act III, Scene IV","name":"Paris"},
            {"speech":564,"scene":"Act III, Scene IV","name":"Lady Capulet"},
            {"speech":565,"scene":"Act III, Scene IV","name":"Capulet"},
            {"speech":566,"scene":"Act III, Scene IV","name":"Paris"},
            {"speech":567,"scene":"Act III, Scene IV","name":"Capulet"},
            {"speech":568,"scene":"Act III, Scene IV","name":"Paris"},
            {"speech":569,"scene":"Act III, Scene IV","name":"Capulet"},
            {"speech":570,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":571,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":572,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":573,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":574,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":575,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":576,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":577,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":578,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":579,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":580,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":581,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":582,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":583,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":584,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":585,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":586,"scene":"Act III, Scene V","name":"Romeo"},
            {"speech":587,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":588,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":589,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":590,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":591,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":592,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":593,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":594,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":595,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":596,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":597,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":598,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":599,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":600,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":601,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":602,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":603,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":604,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":605,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":606,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":607,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":608,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":609,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":610,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":611,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":612,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":613,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":614,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":615,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":616,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":617,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":618,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":619,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":620,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":621,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":622,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":623,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":624,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":625,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":626,"scene":"Act III, Scene V","name":"Capulet"},
            {"speech":627,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":628,"scene":"Act III, Scene V","name":"Lady Capulet"},
            {"speech":629,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":630,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":631,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":632,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":633,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":634,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":635,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":636,"scene":"Act III, Scene V","name":"Nurse"},
            {"speech":637,"scene":"Act III, Scene V","name":"Juliet"},
            {"speech":638,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":639,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":640,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":641,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":642,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":643,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":644,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":645,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":646,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":647,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":648,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":649,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":650,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":651,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":652,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":653,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":654,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":655,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":656,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":657,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":658,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":659,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":660,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":661,"scene":"Act IV, Scene I","name":"Paris"},
            {"speech":662,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":663,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":664,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":665,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":666,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":667,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":668,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":669,"scene":"Act IV, Scene I","name":"Friar Laurence"},
            {"speech":670,"scene":"Act IV, Scene I","name":"Juliet"},
            {"speech":671,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":672,"scene":"Act IV, Scene II","name":"Second Servant"},
            {"speech":673,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":674,"scene":"Act IV, Scene II","name":"Second Servant"},
            {"speech":675,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":676,"scene":"Act IV, Scene II","name":"Nurse"},
            {"speech":677,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":678,"scene":"Act IV, Scene II","name":"Nurse"},
            {"speech":679,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":680,"scene":"Act IV, Scene II","name":"Juliet"},
            {"speech":681,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":682,"scene":"Act IV, Scene II","name":"Juliet"},
            {"speech":683,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":684,"scene":"Act IV, Scene II","name":"Juliet"},
            {"speech":685,"scene":"Act IV, Scene II","name":"Lady Capulet"},
            {"speech":686,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":687,"scene":"Act IV, Scene II","name":"Lady Capulet"},
            {"speech":688,"scene":"Act IV, Scene II","name":"Capulet"},
            {"speech":689,"scene":"Act IV, Scene III","name":"Juliet"},
            {"speech":690,"scene":"Act IV, Scene III","name":"Lady Capulet"},
            {"speech":691,"scene":"Act IV, Scene III","name":"Juliet"},
            {"speech":692,"scene":"Act IV, Scene III","name":"Lady Capulet"},
            {"speech":693,"scene":"Act IV, Scene III","name":"Juliet"},
            {"speech":694,"scene":"Act IV, Scene IV","name":"Lady Capulet"},
            {"speech":695,"scene":"Act IV, Scene IV","name":"Nurse"},
            {"speech":696,"scene":"Act IV, Scene IV","name":"Capulet"},
            {"speech":697,"scene":"Act IV, Scene IV","name":"Nurse"},
            {"speech":698,"scene":"Act IV, Scene IV","name":"Capulet"},
            {"speech":699,"scene":"Act IV, Scene IV","name":"Lady Capulet"},
            {"speech":700,"scene":"Act IV, Scene IV","name":"Capulet"},
            {"speech":701,"scene":"Act IV, Scene IV","name":"First Servant"},
            {"speech":702,"scene":"Act IV, Scene IV","name":"Capulet"},
            {"speech":703,"scene":"Act IV, Scene IV","name":"Second Servant"},
            {"speech":704,"scene":"Act IV, Scene IV","name":"Capulet"},
            {"speech":705,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":706,"scene":"Act IV, Scene V","name":"Lady Capulet"},
            {"speech":707,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":708,"scene":"Act IV, Scene V","name":"Lady Capulet"},
            {"speech":709,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":710,"scene":"Act IV, Scene V","name":"Lady Capulet"},
            {"speech":711,"scene":"Act IV, Scene V","name":"Capulet"},
            {"speech":712,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":713,"scene":"Act IV, Scene V","name":"Lady Capulet"},
            {"speech":714,"scene":"Act IV, Scene V","name":"Capulet"},
            {"speech":715,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":716,"scene":"Act IV, Scene V","name":"Lady Capulet"},
            {"speech":717,"scene":"Act IV, Scene V","name":"Capulet"},
            {"speech":718,"scene":"Act IV, Scene V","name":"Friar Laurence"},
            {"speech":719,"scene":"Act IV, Scene V","name":"Capulet"},
            {"speech":720,"scene":"Act IV, Scene V","name":"Paris"},
            {"speech":721,"scene":"Act IV, Scene V","name":"Lady Capulet"},
            {"speech":722,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":723,"scene":"Act IV, Scene V","name":"Paris"},
            {"speech":724,"scene":"Act IV, Scene V","name":"Capulet"},
            {"speech":725,"scene":"Act IV, Scene V","name":"Friar Laurence"},
            {"speech":726,"scene":"Act IV, Scene V","name":"Capulet"},
            {"speech":727,"scene":"Act IV, Scene V","name":"Friar Laurence"},
            {"speech":728,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":729,"scene":"Act IV, Scene V","name":"Nurse"},
            {"speech":730,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":731,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":732,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":733,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":734,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":735,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":736,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":737,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":738,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":739,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":740,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":741,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":742,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":743,"scene":"Act IV, Scene V","name":"Second Musician"},
            {"speech":744,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":745,"scene":"Act IV, Scene V","name":"Musician"},
            {"speech":746,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":747,"scene":"Act IV, Scene V","name":"Second Musician"},
            {"speech":748,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":749,"scene":"Act IV, Scene V","name":"Third Musician"},
            {"speech":750,"scene":"Act IV, Scene V","name":"Peter"},
            {"speech":751,"scene":"Act IV, Scene V","name":"First Musician"},
            {"speech":752,"scene":"Act IV, Scene V","name":"Second Musician"},
            {"speech":753,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":754,"scene":"Act V, Scene I","name":"Balthasar"},
            {"speech":755,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":756,"scene":"Act V, Scene I","name":"Balthasar"},
            {"speech":757,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":758,"scene":"Act V, Scene I","name":"Balthasar"},
            {"speech":759,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":760,"scene":"Act V, Scene I","name":"Apothecary"},
            {"speech":761,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":762,"scene":"Act V, Scene I","name":"Apothecary"},
            {"speech":763,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":764,"scene":"Act V, Scene I","name":"Apothecary"},
            {"speech":765,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":766,"scene":"Act V, Scene I","name":"Apothecary"},
            {"speech":767,"scene":"Act V, Scene I","name":"Romeo"},
            {"speech":768,"scene":"Act V, Scene II","name":"Friar John"},
            {"speech":769,"scene":"Act V, Scene II","name":"Friar Laurence"},
            {"speech":770,"scene":"Act V, Scene II","name":"Friar John"},
            {"speech":771,"scene":"Act V, Scene II","name":"Friar Laurence"},
            {"speech":772,"scene":"Act V, Scene II","name":"Friar John"},
            {"speech":773,"scene":"Act V, Scene II","name":"Friar Laurence"},
            {"speech":774,"scene":"Act V, Scene II","name":"Friar John"},
            {"speech":775,"scene":"Act V, Scene II","name":"Friar Laurence"},
            {"speech":776,"scene":"Act V, Scene III","name":"Paris"},
            {"speech":777,"scene":"Act V, Scene III","name":"Page"},
            {"speech":778,"scene":"Act V, Scene III","name":"Paris"},
            {"speech":779,"scene":"Act V, Scene III","name":"Romeo"},
            {"speech":780,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":781,"scene":"Act V, Scene III","name":"Romeo"},
            {"speech":782,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":783,"scene":"Act V, Scene III","name":"Romeo"},
            {"speech":784,"scene":"Act V, Scene III","name":"Paris"},
            {"speech":785,"scene":"Act V, Scene III","name":"Romeo"},
            {"speech":786,"scene":"Act V, Scene III","name":"Paris"},
            {"speech":787,"scene":"Act V, Scene III","name":"Romeo"},
            {"speech":788,"scene":"Act V, Scene III","name":"Page"},
            {"speech":789,"scene":"Act V, Scene III","name":"Paris"},
            {"speech":790,"scene":"Act V, Scene III","name":"Romeo"},
            {"speech":791,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":792,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":793,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":794,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":795,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":796,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":797,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":798,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":799,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":800,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":801,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":802,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":803,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":804,"scene":"Act V, Scene III","name":"Juliet"},
            {"speech":805,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":806,"scene":"Act V, Scene III","name":"Juliet"},
            {"speech":807,"scene":"Act V, Scene III","name":"First Watchman"},
            {"speech":808,"scene":"Act V, Scene III","name":"Juliet"},
            {"speech":809,"scene":"Act V, Scene III","name":"Page"},
            {"speech":810,"scene":"Act V, Scene III","name":"First Watchman"},
            {"speech":811,"scene":"Act V, Scene III","name":"Second Watchman"},
            {"speech":812,"scene":"Act V, Scene III","name":"First Watchman"},
            {"speech":813,"scene":"Act V, Scene III","name":"Third Watchman"},
            {"speech":814,"scene":"Act V, Scene III","name":"First Watchman"},
            {"speech":815,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":816,"scene":"Act V, Scene III","name":"Capulet"},
            {"speech":817,"scene":"Act V, Scene III","name":"Lady Capulet"},
            {"speech":818,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":819,"scene":"Act V, Scene III","name":"First Watchman"},
            {"speech":820,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":821,"scene":"Act V, Scene III","name":"First Watchman"},
            {"speech":822,"scene":"Act V, Scene III","name":"Capulet"},
            {"speech":823,"scene":"Act V, Scene III","name":"Lady Capulet"},
            {"speech":824,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":825,"scene":"Act V, Scene III","name":"Montague"},
            {"speech":826,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":827,"scene":"Act V, Scene III","name":"Montague"},
            {"speech":828,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":829,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":830,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":831,"scene":"Act V, Scene III","name":"Friar Laurence"},
            {"speech":832,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":833,"scene":"Act V, Scene III","name":"Balthasar"},
            {"speech":834,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":835,"scene":"Act V, Scene III","name":"Page"},
            {"speech":836,"scene":"Act V, Scene III","name":"Prince"},
            {"speech":837,"scene":"Act V, Scene III","name":"Capulet"},
            {"speech":838,"scene":"Act V, Scene III","name":"Montague"},
            {"speech":839,"scene":"Act V, Scene III","name":"Capulet"},
            {"speech":840,"scene":"Act V, Scene III","name":"Prince"}
        ];
    }
    function ozData(){
        //   What follows is the sequence of speaking parts in the 1939 screenplay
        //   by Noel Langley,Florence Ryerson,Edgar Allen Woolf,  from http://www.imsdb.com
        //   The spoken lines are omitted here for brevity, available on request in this json format.
        return [
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Uncle Henry"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Uncle Henry"},
        {"name":"Aunt Em"},
        {"name":"Uncle Henry"},
        {"name":"Aunt Em"},
        {"name":"Uncle Henry"},
        {"name":"Zeke"},
        {"name":"Zeke"},
        {"name":"Hickory"},
        {"name":"Zeke"},
        {"name":"Hickory"},
        {"name":"Hunk"},
        {"name":"Zeke"},
        {"name":"Dorothy"},
        {"name":"Zeke"},
        {"name":"Hunk"},
        {"name":"Dorothy"},
        {"name":"Hunk"},
        {"name":"Dorothy"},
        {"name":"Hunk"},
        {"name":"Hickory"},
        {"name":"Dorothy"},
        {"name":"Hickory"},
        {"name":"Dorothy"},
        {"name":"Hickory"},
        {"name":"Dorothy"},
        {"name":"Hickory"},
        {"name":"Dorothy"},
        {"name":"Hickory"},
        {"name":"Zeke"},
        {"name":"Zeke"},
        {"name":"Dorothy"},
        {"name":"Zeke"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Hickory"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Hunk"},
        {"name":"Hickory"},
        {"name":"Aunt Em"},
        {"name":"Hickory"},
        {"name":"Aunt Em"},
        {"name":"Hickory"},
        {"name":"Aunt Em"},
        {"name":"Hunk"},
        {"name":"Aunt Em"},
        {"name":"Hickory"},
        {"name":"Hunk"},
        {"name":"Zeke"},
        {"name":"Aunt Em"},
        {"name":"Zeke"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Miss Gulch"},
        {"name":"Uncle Henry"},
        {"name":"Miss Gulch"},
        {"name":"Miss Gulch"},
        {"name":"Uncle Henry"},
        {"name":"Miss Gulch"},
        {"name":"Uncle Henry"},
        {"name":"Miss Gulch"},
        {"name":"Uncle Henry"},
        {"name":"Miss Gulch"},
        {"name":"Miss Gulch"},
        {"name":"Dorothy"},
        {"name":"Uncle Henry"},
        {"name":"Dorothy"},
        {"name":"Miss Gulch"},
        {"name":"Aunt Em"},
        {"name":"Miss Gulch"},
        {"name":"Uncle Henry"},
        {"name":"Aunt Em"},
        {"name":"Miss Gulch"},
        {"name":"Dorothy"},
        {"name":"Miss Gulch"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Miss Gulch"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Miss Gulch"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Uncle Henry"},
        {"name":"Uncle Henry"},
        {"name":"Hickory"},
        {"name":"Uncle Henry"},
        {"name":"Hickory"},
        {"name":"Uncle Henry"},
        {"name":"Zeke"},
        {"name":"Aunt Em"},
        {"name":"Uncle Henry"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Munchkins"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Munchkin"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Glinda"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Mayor"},
        {"name":"Barrister"},
        {"name":"Mayor"},
        {"name":"Barrister"},
        {"name":"Mayor"},
        {"name":"Barrister"},
        {"name":"Coroner"},
        {"name":"Mayor"},
        {"name":"Barrister"},
        {"name":"Mayor"},
        {"name":"Mayor"},
        {"name":"Munchkins"},
        {"name":"Munchkins"},
        {"name":"Three Tots"},
        {"name":"Three Tough Kids"},
        {"name":"Three Tough Kids"},
        {"name":"Munchkins"},
        {"name":"Mayor"},
        {"name":"Barrister"},
        {"name":"City Father"},
        {"name":"Mayor"},
        {"name":"Group"},
        {"name":"Mayor"},
        {"name":"Barrister"},
        {"name":"City Father"},
        {"name":"Group"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Witch"},
        {"name":"Glinda"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Glinda"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Glinda"},
        {"name":"Witch"},
        {"name":"Glinda"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Mayor"},
        {"name":"Munchkin"},
        {"name":"Woman"},
        {"name":"Barrister"},
        {"name":"Fiddlers"},
        {"name":"Fiddlers"},
        {"name":"Fiddlers"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Both"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Tree"},
        {"name":"Dorothy"},
        {"name":"First Tree"},
        {"name":"First Tree"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"First Tree"},
        {"name":"Scarecrow"},
        {"name":"Tree"},
        {"name":"Tree"},
        {"name":"Scarecrow"},
        {"name":"Tree"},
        {"name":"Scarecrow"},
        {"name":"Tree"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"All"},
        {"name":"All"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Witch"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Voices"},
        {"name":"Witch"},
        {"name":"Voices"},
        {"name":"Doorman"},
        {"name":"Doorman"},
        {"name":"Scarecrow"},
        {"name":"Doorman"},
        {"name":"Doorman"},
        {"name":"Doorman"},
        {"name":"Doorman"},
        {"name":"Scarecrow"},
        {"name":"Doorman"},
        {"name":"Cabby"},
        {"name":"Dorothy"},
        {"name":"Cabby"},
        {"name":"Dorothy"},
        {"name":"Cabby"},
        {"name":"Cabby"},
        {"name":"Cabby"},
        {"name":"Cabby"},
        {"name":"Masseurs"},
        {"name":"Polishers"},
        {"name":"Masseuse"},
        {"name":"Dorothy"},
        {"name":"Masseuse"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"All"},
        {"name":"All"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Woman"},
        {"name":"Man"},
        {"name":"Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Guard"},
        {"name":"Guard"},
        {"name":"Guard"},
        {"name":"Dorothy"},
        {"name":"Guard"},
        {"name":"Dorothy"},
        {"name":"Guard"},
        {"name":"Guard"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Guard"},
        {"name":"Guard"},
        {"name":"Guard"},
        {"name":"Tin Man"},
        {"name":"Guard"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"All"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"All"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"All"},
        {"name":"Lion"},
        {"name":"Guard"},
        {"name":"All"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Guard"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Tin Man"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Tin Man"},
        {"name":"Oz"},
        {"name":"Tin Man"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Scarecrow"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Tin Man"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Lion"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"All"},
        {"name":"All"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Witch"},
        {"name":"Lion"},
        {"name":"Tin Man"},
        {"name":"Witch"},
        {"name":"Dorothy"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Witch"},
        {"name":"Witch"},
        {"name":"Lion"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Leader"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Leader"},
        {"name":"Dorothy"},
        {"name":"Leader"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"All"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Oz"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Wizard"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"All"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Lion"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Scarecrow"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Lion"},
        {"name":"Wizard"},
        {"name":"Tin Man"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Lion"},
        {"name":"Wizard"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Wizard"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Wizard"},
        {"name":"Tin Man"},
        {"name":"Wizard"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"Dorothy"},
        {"name":"Wizard"},
        {"name":"All"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Scarecrow"},
        {"name":"Glinda"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Scarecrow"},
        {"name":"Tin Man"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Tin Man"},
        {"name":"Dorothy"},
        {"name":"Lion"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Glinda"},
        {"name":"Glinda"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Professor"},
        {"name":"Uncle Henry"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Hunk"},
        {"name":"Hickory"},
        {"name":"Zeke"},
        {"name":"Dorothy"},
        {"name":"Professor"},
        {"name":"Dorothy"},
        {"name":"Aunt Em"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Dorothy"},
        {"name":"Uncle Henry"},
        {"name":"Dorothy"},
        {"name":"Dorothy"}
        ];
    }
    function socialDistances(source,method){
        //  Compute a simple 'social distance' value based on the sequence of speeches in a play
        switch(source){
            case "romeo":var entries=romeoData();break;
            case "dream":var entries=dreamData();break;
            case "oz":var entries=ozData();break;
        }
        //  Build array of names, and associative array back to keys
        var names=[];
        for(var i=0;i<entries.length;i++){
            names.push(entries[i].name);
        }
        names=unique(names);
        var nameToKey=[];
        for(var i=0;i<names.length;i++){
            nameToKey[names[i]]=i;
        }
        //  Count "chats" by actors' names = adjacent speeches in the same scene
        var chats={};
        var name="";
        var scene="";
        var prevName=entries[0].name;
        var prevScene=entries[0].scene;
        for(var i=1;i<entries.length;i++){
            name=entries[i].name;
            scene=entries[i].scene;
            if(scene==prevScene && name!=prevName){
                var n1=nameToKey[name];
                var n2=nameToKey[prevName];
                var hashCode=(Math.min(n1,n2)+"~"+Math.max(n1,n2)); // hash always has left key < right key
                if(!chats[hashCode]){chats[hashCode]=0}
                chats[hashCode]+=1;
            }
            prevName=name;
            prevScene=scene;
        }
        var maxChats=-Infinity;
        for(var hash in chats){
            maxChats=Math.max(chats[hash],maxChats);
        }
        //  "Social distance" is a function of how many "chats" you have,
        //  it's 0.00 for the maximum chatting pair and 1.00 for pairs that never talk.
        //  We implement several ways to calculate this...
        var distances={};
        var n=names.length;

        if(method=="hierarchic"){
            for(var hash in chats){
                distances[hash]=1.0-chats[hash]/maxChats;
            }
            //  In this version, pairs without chats remain null; clustering now handles sparse data.
        }else if(method=='linkDissimilarity'){
            //  Calculate distance as per Newman,EPJ B 38,321330(2004), eq 1
            var maxD=-Infinity;
            for(var i=0;i<n-1;i++){
                for(var j=i+1;j<n;j++){
                    var aij=chats[Math.min(i,j)+"~"+Math.max(i,j)];
                    if(!aij){aij=0.0};  // How this deals with sparse data
                    var hash=i+"~"+j;
                    var sum=0;
                    for(var k=0;k<n;k++){
                        if(k!=i && k!=j){
                            var aik=chats[Math.min(i,k)+"~"+Math.max(i,k)];
                            if(!aik){aik=0.0};  // How this deals with sparse data
                            if(aik && aij){  //  if not sparse...
                                sum+=Math.pow(aij-aik,2);
                            }
                        }
                    }
                    if(sum>0){
                        var dissim=Math.sqrt(sum);
                        maxD=Math.max(maxD,dissim);
                        distances[hash]=dissim;
                    }else{
                        distances[hash]=null;
                    }
                }
            }
            if(maxD==-Infinity){
                alert("Not enough common linkage patterns!");
                return;
            }
            //  As for classic distances, here we allow null data to propagate, we
            //  do not add fudge factors (high distances) to fill in for sparse data.
        }else{
            //  For Newman's method, distances[] is used to hold edge weights, plus
            //  we use only defined edges and so leave unknowns as null.
            distances=chats;
        }
        return {"names":names,"distances":distances};
    }
    //  Specific utilities: data import & recursive traverses
    function importGML(url,method,useWeights,callback){
        // Read and parse a GML file, see
        // http://www.infosun.fim.uni-passau.de/Graphlet/GML/gml-tr.html  and
        // http://www-personal.umich.edu/~mejn/netdata/

        // Chrome will FAIL here if the file is on the same drive as the HTML file - by design.
        function tinyAjax(url,callback){
            var http = null;
            http=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP")
            http.onreadystatechange=function(){
                if(http.readyState==4){callback(http.responseText)}
            }
            http.open("GET",url,true);
            http.send("");
        }
        //  Show any notes and citations if they exist
        tinyAjax(url.replace(".gml",".txt"),function(text){
            if(text){document.getElementById("console").innerHTML=text+"<br\/><br\/>";}
        });

        return tinyAjax(url,function(text){
            //  Remove all returns and excess whitespace
            text=text.replace(/\".+?"/g,function(c1){
                return c1.replace(/ /g,"~")   ;  //  Put ~ into spaces inside quoted names, later reverted
            });

            text=text.replace(/[^a-zA-Z0-9\[\]\"~]/g,"");
            text=text.replace(/.*graph\[/,"");
            var nodes=text.match(/node\[.*?\]/g);
            var useLabel=(nodes[0].indexOf("label")!=-1);

            //  GML identifies edge data by its own id numbers.  gmlIdToKey[] is a reverse table
            //  to turn these into a zero-based javascript hash array.
            var names=[];
            var gmlIdToKey=[];
            for(var i=0;i<nodes.length;i++){
                var gmlId=nodes[i].match(/\[id(\d*)\D/)[1];
                if(useLabel){
                    names[i]=nodes[i].match(/\[.*label\"(.*?)"/)[1];
                    names[i]=names[i].replace(/~/g," ");
                }else{
                    names[i]=gmlId;
                }
                gmlIdToKey[gmlId]=i;
            }
            var edges=text.match(/edge\[.*?\]/g);

            //  The GML datasets typically just assign 1 to edges and 0 otherwise;
            //  we do that unless the data includes edge value.
            var useValue=(edges[0].indexOf("value")!=-1);
            var distances={};
            for(var k=0;k<edges.length;k++){
                var edge=edges[k].match(/source(\d+)target(\d+)/);
                var i=Math.min(Number(edge[1]),Number(edge[2]));
                var j=Math.max(Number(edge[1]),Number(edge[2]));
                var hash=gmlIdToKey[i]+"~"+gmlIdToKey[j];
                if(useValue){
                    var value=edges[k].match(/value(\d+)\]/);
                    if(!value){value=1}else{value=Number(value[1])}
                    distances[hash]=value;
                }else{
                    distances[hash]=1;
                }
            }
            //  NOTE:  The values here for presence or absence of an edge
            //  make a huge difference to the distance-joining.
            //  For clustering we need all values, fudged from edge weights to distances,
            //  for Newman we use only defined edges and so leave unknowns as null.
            var n=names.length;
            if(method=="hierarchic"){
                //  Insert limit values for all missing pairs
                for(var i=0;i<n-1;i++){
                    for(var j=i+1;j<n;j++){
                        var hash=i+"~"+j;
                        if(distances[hash]){
                            distances[hash]=1/distances[hash];  // edge weights to distance
                        }
                        //  Sparse data OK now as null.
                    }
                }
            }else if(method=='linkDissimilarity'){
                //  Recalculate distance as per Newman,EPJ B 38,321330(2004), eq 1
                var tempDist=[];
                var maxD=-Infinity;
                for(var i=0;i<n-1;i++){
                    for(var j=i+1;j<n;j++){
                        var aij=distances[Math.min(i,j)+"~"+Math.max(i,j)];
                        if(!aij){aij=0.0};  // How this deals with sparse data
                        var hash=i+"~"+j;
                        var sum=0;
                        for(var k=0;k<n;k++){
                            if(k!=i && k!=j){
                                var aik=distances[Math.min(i,k)+"~"+Math.max(i,k)];
                                if(!aik){aik=0.0};  // How this deals with sparse data
                                if(aik && aij){  //  if not sparse...
                                    sum+=Math.pow(aij-aik,2);
                                }
                            }
                        }
                        if(sum>0){
                            var dissim=Math.sqrt(sum);
                            maxD=Math.max(maxD,dissim);
                            tempDist[hash]=dissim;
                        }
                    }
                }
                if(maxD==-Infinity){
                    alert("Not enough common linkage patterns!");
                    return;
                }
                distances=tempDist;
            }else{
                //  The sparse array of edge values is OK for Newman's fast algorithm.
            }
            var dataObj={"names":names,"distances":distances,"method":method,"useWeights":useWeights};
            callback(dataObj);
        });
    }
    function binaryTreeWalk(currentNode,tree,depth,doLeafAction,doDownAction,doUpAction){
        //  General purpose recursive binary depth-first tree walk, with three possible action functions:
        //  at each leaf node, on the way down a branch, and on the way back up a branch.
        if(tree[currentNode].leftChild>-1){
            depth+=1;
            if(doDownAction){doDownAction(currentNode,tree,depth)}
            binaryTreeWalk(tree[currentNode].leftChild,tree,depth,doLeafAction,doDownAction,doUpAction);
        }
        if(tree[currentNode].rightChild==-1){ // It's a leaf node
            if(doLeafAction){doLeafAction(currentNode,tree,depth)}
        }
        if(tree[currentNode].rightChild>-1){
            binaryTreeWalk(tree[currentNode].rightChild,tree,depth,doLeafAction,doDownAction,doUpAction);
            if(doUpAction){doUpAction(currentNode,tree,depth)};
            depth-=1;
        }
    }
    function treeWalk(tree,node,depth,preAction,postAction){  //  recursive tree walk
        //  For any number of branches per node, not just binary
        if(preAction){preAction(tree,node,depth)};
        if(isArray(tree)){
            for(var i=0;i<tree.length;i++){
                treeWalk(tree[i],i,depth+1,preAction,postAction);
            }
        }
        if(postAction){postAction(tree,node,depth)};
    }
    //  Community detection algorithms and recursion
    function addClosestPairByCommunity(tree,deltaQ,a){
        //  Newman's communities algorithm, http://arxiv.org/abs/cond-mat/0309508v1
        //  Find the largest deltaQ for each row, and overall

        //  Where Newman et al keep the H as max-heaps, we rebuild H from scratch for code clarity.
        //  Semi-sparse:  We still make H arrays for sorting but do it in one pass from the sparse deltaQ.

        logTime("start step");

        var n=tree.length;
        var H={};
        for(var hash in deltaQ){
            var dQ=deltaQ[hash];
            var keys=hash.split("~");
            var i=Number(keys[0]);
            var j=Number(keys[1]);
            if(!H[i]){H[i]=[]}
            if(!H[j]){H[j]=[]}
            H[i].push({"dQ":dQ,"i":i,"j":j});
            H[j].push({"dQ":dQ,"i":i,"j":j});
        }

        logTime("assign H");

        //  Find nodes to join
        var Hmax={"dQ":-Infinity,"i":-1,"j":-1};
        for(var i=0;i<n;i++){
            if(H[i]){
                H[i].sort(function(a,b){return b.dQ-a.dQ;});  // Full sort, overkill but native & clean
                //  The [0] element in each H array now has the largest deltaQ for that row
                if(H[i][0].dQ>Hmax.dQ){
                    Hmax.dQ=H[i][0].dQ;
                    Hmax.i =H[i][0].i;
                    Hmax.j =H[i][0].j;
                }
            }
        }

        logTime("find Hmax");
        //  Diagnostic info
        //  console("&nbsp;("+Hmax.i+","+Hmax.j+") -> "+n+"&nbsp; &nbsp; &Delta;Q = "+Hmax.dQ.toFixed(3));

        //  On full recursion, unweighted datasets can end up with degenerate small subsets, trapped here.
        if(Hmax.i==-1){return null}

        //  Create a combined node.  The tree[] is needed only for later drawing;
        //  all the work here is done with the deltaQ[].
        var wt=tree[Hmax.i].weight+tree[Hmax.j].weight;
        tree.push({"parent":-1,"leftChild":Hmax.i,"rightChild":Hmax.j,"weight":wt,"dQ":Hmax.dQ});
        tree[Hmax.i].parent=n;  // n = the new one we just created
        tree[Hmax.j].parent=n;

        //  Update all deltaQ, Clauset eq 10a-c
        var hashToZap=[];  //  Remember the deltaQ for the nodes we're joining, to null out later.
        for(var k=0;k<n;k++){
            if(k!=Hmax.i && k!=Hmax.j && H[k]){  //  H[k]!=null => node still in play
                var hashik=Math.min(Hmax.i,k)+"~"+Math.max(Hmax.i,k);
                var hashjk=Math.min(Hmax.j,k)+"~"+Math.max(Hmax.j,k);
                var hashNew=k+"~"+n;
                var t1=deltaQ[hashik];
                var t2=deltaQ[hashjk];
                //  Javascript thinks zero and null are both false, so some type tricks are needed;
                //  zero is a valid entry for deltaQ and common for small graphs.
                if(!isNaN(t1)){
                    hashToZap.push(hashik);
                    if(!isNaN(t2)){
                        hashToZap.push(hashjk);
                        deltaQ[hashNew]=t1+t2;
                    }else{
                        deltaQ[hashNew]=t1-2.0*a[Hmax.j]*a[k];
                    }
                }else{
                    if(!isNaN(t2)){
                        hashToZap.push(hashjk);
                        deltaQ[hashNew]=t2-2.0*a[Hmax.i]*a[k];
                    }else{
                        deltaQ[hashNew]=null; // Important to zap dQ when t1 & t2 undefined
                    }
                }
            }
        }

        logTime("update dQ");

        //  Update a[]
        a[n]=a[Hmax.i]+a[Hmax.j];
        //   a[Hmax.i]=0;a[Hmax.j]=0;  //   No need to zero-out; these a[] are not used again

        //  Experiments verify that sum a[i] = 1.00 at all stages of agglomeration.

        //  Remove any deltaQ for nodes now absorbed in this join.
        deltaQ[Hmax.i+"~"+Hmax.j]=null;
        for(var i=0;i<hashToZap.length;i++){
            deltaQ[hashToZap[i]]=null;
        }
        //  Make dQ array smaller by not copying over any dQ set to null above.
        var dQcopy={};
        var ndq=0;
        for(var hash in deltaQ){
            if(deltaQ[hash]){dQcopy[hash]=deltaQ[hash];ndq++}
        }

        logTime("add a[], prune dQ");
        return {"value":Hmax.dQ,"array":dQcopy};
    }
    function buildTreeByCommunities(dataObj,showNotes){
        //  Implement the fast Newman method, as in Clauset, Newman, Moore, arXiv:cond-mat/0408187v2
        var n=dataObj.names.length;
        var k=[];
        for(var i=0;i<n;i++){
            k[i]=0;
        }
        var m=0;
        var W=0;
        if(dataObj.useWeights){
            for(var hash in dataObj.distances){
                var keys=hash.split("~");
                var i=Number(keys[0]);
                var j=Number(keys[1]);
                var d=dataObj.distances[hash];
                k[i]+=d;
                k[j]+=d;
                W+=d;
                m+=1;
            }
            if(!W){W=1e-7};     //  This avoids some errors with disconnected components
            var inv2m=1/(2*W);
        }else{
            for(var hash in dataObj.distances){
                var keys=hash.split("~");
                var i=Number(keys[0]);
                var j=Number(keys[1]);
                k[i]+=1;
                k[j]+=1;
                m+=1;
            }
            if(!m){m=1e-7};     //  This avoids some errors with disconnected components
            var inv2m=1/(2*m);
        }
        //  See Berry et al arXiv:0903.1072v2 eq 16; note the 2x difference between Clauset and Berry.
        var deltaQ={};
        for(var hash in dataObj.distances){
            var keys=hash.split("~");
            var i=Number(keys[0]);
            var j=Number(keys[1]);
            if(dataObj.useWeights){
                deltaQ[hash]=2.0*inv2m*dataObj.distances[hash] - 2.0*inv2m*inv2m*k[i]*k[j];
            }else{
                deltaQ[hash]=2.0*(inv2m-k[i]*k[j]*inv2m*inv2m);  // 2x assures identical Q for unweighted datasets
            }
        }
        var a=[];
        for(var i=0;i<n;i++){
            a[i]=inv2m*k[i];
        }
        // var s=0;for(var i=0;i<a.length;i++){s+=a[i]};alert(s);  //  always 1.00 but good to check

        //  Initialize the binary tree, used only for later display.
        var tree=[];
        for(var i=0;i<n;i++){
            tree.push({"parent":-1,"leftChild":-1,"rightChild":-1,"weight":1,"linkage":a[i],"name":dataObj.names[i],"primaryKey":i});
        }

        logTime("initialize k,a,dQ");
        //  Do the actual agglomerative joining
        var Q=0.0;
        var maxQ=-Infinity;
        var dQobj={"value":0,"array":deltaQ};
        var numCommunities=1;

        while(dQobj && tree.length<(2*n-1)){
            dQobj=addClosestPairByCommunity(tree,dQobj.array,a);
            if(dQobj){
                Q+=dQobj.value;
                if(dQobj.value<0){numCommunities+=1};
                maxQ=Math.max(maxQ,Q);
            }else{
                //  We hit a small degenerate subset -- another stop to recursion
                return null;
            }
        }
        //  showTimes();  //   diagnostic for speed optimization

        //  Assign index = sequence of traverse for coloring
        var index=0;
        var root=tree.length-1;
        binaryTreeWalk(root,tree,0,function(currentNode,tree,depth){
            tree[currentNode].index=index;
            index+=1;
        },null,null);

        if(showNotes){
            var notes=n+" nodes, "+m+" of "+(n*(n-1)/2)+" possible edges ("+Math.round(200*m/(n*(n-1)))+"%) ";
            notes+="with data, and "+numCommunities+" primary communities identified.";
            notes+="&nbsp; &nbsp; Q="+maxQ.toFixed(3);
            document.getElementById('notes').innerHTML=notes;
        }
        return {"tree":tree,"distances":dataObj.distances,"root":root,"names":dataObj.names,"useWeights":dataObj.useWeights};
    }
    function findSplits(treeObj){
        //   The treeObj has dQ info from the Newman joining, so we can
        //   identify communities based on when dQ went negative.
        var breakNext=true;
        var breakNodes=[];
        var g=-1;
        var group=[];
        var members="";
        var tracker=0;
        binaryTreeWalk(treeObj.root,treeObj.tree,0,function(node,tree,depth){
           if(breakNext){
                g+=1;
                breakNodes.push(node);
                breakNext=false;
           }
           group[node]=g;
           members+=treeObj.tree[node].name+",";
        },
        function(node,tree,depth){
           var thisNode=tree[node];
            if(thisNode.dQ<0){
                breakNext=true;
                tracker=0;
            }
            tracker+=1;
        },
        function(node,tree,depth){
            var thisNode=tree[node];
            tracker-=1;
            if(tracker==1){
                breakNext=true;
                members+="~";
            }
        });

        // //Search for any nodes that aren't in any group and put them in one
        // var createdGroupForLoners = false, lonersCount = 0;

        // treeObj.names.forEach(function (d, i) {
        //     if (!group.hasOwnProperty(i)) {
        //         if (members[members.length-1]!="~" && !createdGroupForLoners) {
        //             members+="~"
        //         }
        //         group[i] = g+1;
        //         createdGroupForLoners = true;
        //         members+=d + ",";
        //         lonersCount++;
        //     }
        // })
        // //If we created a new group for loners increase the group size
        // if (createdGroupForLoners) {
        //     g+=1;
        //     members+="~";
        //     console.log("NewmanClustering lonersCount=" + lonersCount);
        // }

        var numGroups=g+1;
        members=members.slice(0,-2);
        members=members.replace(/,~/g,"~");
        //  members has the names of nodes, comma separated within groups and "~" between groups
        return {"numGroups":numGroups,"group":group,"members":members,"breakNodes":breakNodes};
    }
    function findSubCommunities(treeObj,depth,prevGroup){
        if(!treeObj){return}

        var tree=treeObj.tree;
        var root=treeObj.root;
        var names=treeObj.names;
        //  Identify the communities in the data
        var splitInfo=findSplits(treeObj);
        var numGroups=splitInfo.numGroups;
        var group=splitInfo.group;

        var t=splitInfo.members.split("~");  //  string to array
        var groups=[];
        for(var g=0;g<numGroups;g++){
            groups.push((t[g]).split(","));
        }
        //  groups is now a set of nested arrays of names, what we return

        //  Split the original distance & name tables into separate dataObj for each group
        //  so we can repeat the analysis recursively.
        var dataObjList=[];
        for(var g=0;g<numGroups;g++){
           dataObjList.push({"names":[],"distances":[],"useWeights":treeObj.useWeights});
        }
        var nameKeys=[];   //  New groups must have new hash codes, thus new index keys

        for(var i=0;i<names.length;i++){
            var name=names[i];
            dataObjList[group[i]].names.push(name);  //  Assign names to groups in one pass
            nameKeys[i]=dataObjList[group[i]].names.length-1;
        }

        for(var hash in treeObj.distances){
            var keys=hash.split("~");
            var i=Number(keys[0]);
            var j=Number(keys[1]);
            if(group[i]==group[j]){
                //   These two are in the same group so keep this distance value
                var newHash=nameKeys[i]+"~"+nameKeys[j];
                dataObjList[group[i]].distances[newHash]=treeObj.distances[hash]
            }
        }
        //   Now we have separate dataObj's for each community.  Do the analysis on each.
        if(numGroups>1){
            for(var g=0;g<numGroups;g++){
                //  This is where CNM is called for the sub-community
                var innerTreeObj=buildTreeByCommunities(dataObjList[g]);
                if(innerTreeObj && innerTreeObj.tree){
                    var innerGroups=findSplits(innerTreeObj).numGroups;
                    //   Simplest stopping rule -- communities of one
                    if(innerGroups>1){
                        //  Recursion: find any sub-groups
                        var subgroups=findSubCommunities(innerTreeObj,depth+1,g);
                        //  Replace the current group with its set of subgroups, which builds a tree.
                        groups[g]=subgroups;
                    }
                }
            }
        }
        return groups;
    }
    //  Ring graph display
    function demoTreeWalk(groups){
        var n=0;
        treeWalk(groups,0,0,function(group,node,depth){
            if(isArray(group)){
                console(">&nbsp;"+depth)
            }else{
                console("&nbsp;&nbsp;"+depth+"  "+node+"  "+group);
                n+=1;
            }
        },function(group,node,depth){
            if(isArray(group)){
                console("<&nbsp;"+depth)
            }
        });
        console("total nodes = "+n+"<br><br>");
    }
    function drawThickArc(ctx,theta1,theta2,r1,r2,fillStyle,strokeStyle){
        ctx.save();
        ctx.beginPath();

        if(fillStyle){ctx.fillStyle=fillStyle}
        if(strokeStyle){ctx.strokeStyle=strokeStyle}

        var c1=Math.cos(theta1);
        var c2=Math.cos(theta2);
        var s1=Math.sin(theta1);
        var s2=Math.sin(theta2);
        ctx.moveTo(r1*c1,r1*s1);
        ctx.lineTo(r2*c1,r2*s1);
        ctx.arc(0,0,r2,theta1,theta2,false);
        ctx.lineTo(r1*c2,r1*s2);
        ctx.arc(0,0,r1,theta2,theta1,true);
        ctx.lineTo(r1*c1,r1*s1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    function drawRingGraph(groups,names,distances,eid){
        var pi=Math.PI;
        //   Build a handy reverse lookup table
        var nameToKey=[];
        for(var i=0;i<names.length;i++){
            nameToKey[names[i]]=i;
        }
        //  Find the longest label here to assure our frame doesn't clip the labels; .
        var maxLabel=-Infinity;
        for(var i=0;i<names.length;i++){
            maxLabel=Math.max(maxLabel,names[i].length);
        }
        //  Collect info about dataset for drawing
        var numNodes=0;
        var minDepth=Infinity;
        var maxDepth=-Infinity;
        var nodeSequence=[];
        treeWalk(groups,0,0,function(group,node,depth){
            if(isArray(group)){
            }else{ // is leaf node
                nodeSequence[nameToKey[group]]=numNodes;
                numNodes+=1;
                minDepth=Math.min(minDepth,depth);
                maxDepth=Math.max(maxDepth,depth);
            }
        },null);

        var pxPerPtPerChar=0.507;  //  Empirical finding for bold sans in canvas
        var edge=Math.max(72,16+maxLabel*12*pxPerPtPerChar);

        var e=document.getElementById(eid);
        var outerRadius=edge+Math.round(36*Math.sqrt(numNodes));
        var dTheta=2.0*pi/numNodes;

        e.width=2*outerRadius+4;
        e.height=2*outerRadius+4;
        var nodeRadius=outerRadius-edge;
        var ctx=e.getContext('2d');
        if(!ctx){return}
        ctx.clearRect(0,0,e.width,e.height);
        ctx.translate(outerRadius+2,outerRadius+2);

        ctx.lineWidth=1.5;
        ctx.strokeStyle="rgba(0,0,0,0.1)";
        ctx.fillStyle="rgba(255,255,255,1)";

        ctx.beginPath();
     //   ctx.arc(0,0,outerRadius,0.0,2*pi,false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.strokeStyle="rgba(0,0,0,0.6)";

        //   Draw arcs to show communities

        ctx.lineWidth=0.5;
        var i=-1;
        var lastNode=-1;
        var startByDepth=[];
        var prevNodeDepth=-1;
        treeWalk(groups,0,0,function(group,node,depth){
            if(isArray(group)){  //  down the tree
                startByDepth[depth]=lastNode;
            }else{   //  at a node
                i+=1;
                lastNode=i;
            //    console("&nbsp;&nbsp;&nbsp;d"+atDepth+" i"+i+" "+group)
                prevNodeDepth=depth;
            }
        },function(group,node,depth){  // up the tree
            if(isArray(group)){
                //  We finished a community so draw an arc
                if(depth>0){
                    var i0=startByDepth[depth]+1;
                    var i1=i;
                    var theta0=dTheta*i0;
                    var theta1=dTheta*i1;
                    var hue=180*(i0+i1)/numNodes;

                    var dr=(outerRadius-nodeRadius)*(depth-1)/(maxDepth-1);
                    var r1=nodeRadius;;//+dr;
                    var r2=outerRadius-dr;
                    var color1=HSVtoRGB(hue,0.2,1);
                    var color2=HSVtoRGB(hue,0.3,0.5);
                    drawThickArc(ctx,theta0-dTheta/3,theta1+dTheta/3,r1,r2,hexToCanvasColor(color1,0.333),hexToCanvasColor(color2,0.8));

                //    console("<- d"+depth+"  "+i0+"-"+i1);
                }

            }
        });

        //   Draw connectors between nodes

        ctx.lineWidth=1.5;
        var maxValue=-Infinity;
        var minValue=Infinity;
        for(var hash in distances){
            maxValue=Math.max(maxValue,distances[hash]);
            minValue=Math.min(minValue,distances[hash]);
        }
        if(maxValue==minValue){maxValue=5*maxValue}  // to set gray level for unweighted sets
        for(var hash in distances){
            var value=0.1+Math.max(0,0.9+0.6*Math.log(distances[hash]/maxValue));
          //  ctx.lineWidth=1.5+value;
            var keys=hash.split("~");
            var i=Number(keys[0]);
            var j=Number(keys[1]);
            var theta1=dTheta*Math.min(nodeSequence[i],nodeSequence[j]);
            var theta2=dTheta*Math.max(nodeSequence[i],nodeSequence[j]);
            ctx.beginPath();
            ctx.strokeStyle="rgba(0,0,0,"+value+")";

            var p1x=nodeRadius*Math.cos(theta1);
            var p1y=nodeRadius*Math.sin(theta1);
            var p2x=nodeRadius*Math.cos(theta2);
            var p2y=nodeRadius*Math.sin(theta2);
            var d=Math.sqrt(Math.pow(p1x-p2x,2)+Math.pow(p1y-p2y,2))/(2*nodeRadius);
            var pcx=0.5*(p1x+p2x)*(1-d);
            var pcy=0.5*(p1y+p2y)*(1-d);

            ctx.moveTo(p1x,p1y);
            ctx.quadraticCurveTo(pcx,pcy,p2x,p2y);
            ctx.stroke();
            ctx.closePath();
        }

        //  Draw nodes

        var theta=0.0;
        ctx.font='12px sans-serif';
        ctx.strokeStyle="rgba(0,0,0,0.6)";
        treeWalk(groups,0,0,function(group,node,depth){
            if(!isArray(group)){
                var hue=180*theta/pi;
                var color=HSVtoRGB(hue,0.5,1);
                //  Draw dot and names
                var px=nodeRadius*Math.cos(theta);
                var py=nodeRadius*Math.sin(theta);
                ctx.save();
                ctx.fillStyle=hexToCanvasColor(color,1);
                ctx.shadowColor="rgba(0,0,0,0.7)";
                ctx.shadowOffsetX=1;
                ctx.shadowOffsetY=1;
                ctx.shadowBlur=2;
                ctx.beginPath();
                ctx.arc(px,py,5,0.0,2*pi,false);
                ctx.fill();
                ctx.fillStyle="rgba(0,0,0,1)";
                ctx.shadowColor="rgba(0,0,0,0)"; // nix the shadow
                ctx.rotate(theta);
                var w=ctx.measureText(group).width;
                if(theta<1.57 || theta>4.71){ // right of center, text OK
                    ctx.fillText(group,nodeRadius+12,4);
                }else{                        // left of center, flip the text
                    ctx.save();
                    ctx.rotate(pi);
                    ctx.fillText(group,-nodeRadius-w-12,4);
                    ctx.restore();
                }
                ctx.stroke();
                ctx.restore();
                theta+=dTheta;
            }
        });
    }
    //  Main callback and sequence
    function getData(source,n,method,useWeights,callback){
        //  Reading data files or URLs is asynchronous, so we wrap all
        //  subsequent work in a callback to assure data arrival.
        if(source.indexOf("gml")!=-1){
            importGML(source,method,useWeights,callback);
        }else{
            switch(source){
                case "cities":{
                    var dataObj=cityDistances(n,method);break;
                }
                case "romeo":{
                    var dataObj=socialDistances("romeo",method);break;
                }
                case "dream":{
                    var dataObj=socialDistances("dream",method);break;
                }
                case "oz":{
                    var dataObj=socialDistances("oz",method);break;
                }
                default:
                    var dataObj=randomDistances(n);
            }
            dataObj.method=method;
            dataObj.useWeights=useWeights;
            callback(dataObj);
        }
    }
    function main(source){
        document.getElementById("console").innerHTML="";
        document.getElementById('notes').innerHTML="";
        //  For this demo always use the Newman (=CNM) method with edge weighting.
        getData(source,0,"newman",true,function(dataObj){
            //  This is the main routine, a callback from the async data import.
            var treeObj=buildTreeByCommunities(dataObj,true);
            var groups=findSubCommunities(treeObj,0,0);
            drawRingGraph(groups,dataObj.names,dataObj.distances,"ringGraph");
        });
    }

    //Exports
    self.buildTreeByCommunities = buildTreeByCommunities;
    self.findSubCommunities = findSubCommunities;
    //buildTreeByCommunities parameter should be
    //Object {names: Array[39], distances: Array[0], method: "newman", useWeights: true}

    self.getData = getData;
    self.socialDistances = socialDistances;

    //Receives nodes and edges on the d3 format clusters them, and return the clusters
    // the nodes should be a list of objects that at least contains an attribute id
    // and the edges should be a list of objects {source:index, target:index, count}
    self.cluster = function (nodes, edges) {
        var dataObj = {},
            treeObj, groups;

        dataObj.method = "newman";
        dataObj.useWeights = true;
        dataObj.names = nodes.map(function (d, i) { return ""+i });

        // dataObj.names = nodes;
        dataObj.distances = {};
        edges.forEach(function (d) {
            var hash = Math.min(d.source, d.target) + "~" + Math.max(d.source, d.target); // hash always has left key < right key})
            dataObj.distances[hash] = d.count;
        });

        // dataObj = addDummyMetaNode(dataObj);

        treeObj=buildTreeByCommunities(dataObj, false);
        groups=findSubCommunities(treeObj,0,0);

        // return removeDummyMetaNode(groups);
    }

    function addDummyMetaNode(dataObj) {
        //Add a dummy node linked to all the nodes to guarantee that the graph is connected
        dataObj.names.push("DUMMY");
        dataObj.names.forEach(function (d, i) {
            if (i===dataObj.names.length-1) {
                return;
            }
            var hash = i+"~"+ (dataObj.names.length-1);
            dataObj.distances[hash] = 0.1;
        });
        return dataObj;
    }

    function removeDummyMetaNode(groups) {
        var i, ele;
        for (i = 0; i < groups.length; i++) {
            ele = groups[i];
            if (ele instanceof Array) {
                ele = removeDummyMetaNode(ele);
                if (ele.length===0) {
                    //DUMMY was on an empty cluster, delete it
                    groups.splice(i, 1);
                }
                groups[i];
            } else {
                if (ele === "DUMMY") {
                    groups.splice(i, 1);//Remove
                    break;
                }
            }
        }
        return groups;
    }


    return self;
}


