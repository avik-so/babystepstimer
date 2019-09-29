!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class n{static isNotNeutralBG(e){return e!=n.backgroundColorNeutral}static getRemainingTimeCaption(e){let t=new Date(1e3*n.secondsInCycle-e);var r=t.getMinutes(),i=t.getSeconds();return r<10&&(r="0"+r),i<10&&(i="0"+i),r+":"+i}}n.backgroundColorNeutral="#ffffff",n.backgroundColorFailed="#ffcccc",n.backgroundColorPassed="#ccffcc",n.secondsInCycle=120,n.baseSoundURL="./sounds/",t.Configurations=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(2),i=r(0),o=r(4);window.stop=o.Controller.stop,window.reset=o.Controller.reset,window.start=o.Controller.start,window.quit=o.Controller.quit,document.body.innerHTML=n.HTMLOutput.CreateTimerHtml(i.Configurations.getRemainingTimeCaption(0),i.Configurations.backgroundColorNeutral)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(0);t.HTMLOutput=class{static CreateTimerHtml(e,t){let r=this.createTimerBox(t);return r+=this.createTimerHtml(e),r+=this.createMenuHTML(e!==n.Configurations.getRemainingTimeCaption(0)),r+=this.createTimerBoxClosingTag()}static createTimerBoxClosingTag(){return"</div>"}static createTimerBox(e){return`<div style="border: 3px solid #555555; background: ${e}; margin: 0; padding: 0;">`}static createTimerHtml(e){return'<h1 style="text-align: center; font-size: 30px; color: #333333;">'+e+"</h1>"}static createMenuHTML(e){let t='<div style="text-align: center">';return t+=e?this.createMenuLink("stop")+this.createMenuLink("reset"):this.createMenuLink("start"),t+=this.createMenuLink("quit"),t+="</div>"}static createMenuLink(e){const t=e.charAt(0).toUpperCase()+e.substring(1);return`<a style="color: #555555;" href="javascript:${e}();">${t}</a> `}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.TimeCalculations=class{static isNewSecond(e,t){return e!==t}static calculateElaspedTime(e,t){let r=Date.now()-t;return r=this.resetTimeIfCycleComplete(r,e)}static isElapsedTimeBetween5and6seconds(e){return e>=5e3&&e<6e3}static resetTimeIfCycleComplete(e,t){return e>=1e3*t+980&&(e=0),e}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(0),i=r(3),o=r(5),a=r(6);class s{static runNextTick(){let e=i.TimeCalculations.calculateElaspedTime(n.Configurations.secondsInCycle,s.currentStartTime);0==e&&s.resetStartTime(),s.bodyBackgroundColor=o.GUIStuff.mightChangeBGColor(e,s.bodyBackgroundColor);let t=n.Configurations.getRemainingTimeCaption(e);i.TimeCalculations.isNewSecond(t,s.lastRemainingTime)&&(s.updateUIForNewSecond(t,s.bodyBackgroundColor),s.lastRemainingTime=t)}static resetStartTime(){s.currentStartTime=Date.now()}static quit(){document.body.innerHTML="",clearInterval(s._threadTimer)}static reset(){s.resetStartTime(),s.bodyBackgroundColor=n.Configurations.backgroundColorPassed}static stop(){o.GUIStuff.resetGui(n.Configurations.getRemainingTimeCaption(0),n.Configurations.backgroundColorNeutral),clearInterval(s._threadTimer)}static start(){o.GUIStuff.resetGui(n.Configurations.getRemainingTimeCaption(0),n.Configurations.backgroundColorNeutral),s.resetStartTime(),s._threadTimer=setInterval(s.runNextTick,10)}static updateUIForNewSecond(e,t){a.BellPlayer.playBelAtTime(e,"00:10",`${n.Configurations.baseSoundURL}2166__suburban-grilla__bowl-struck.wav`),a.BellPlayer.playBelAtTime(e,"00:00",`${n.Configurations.baseSoundURL}32304__acclivity__shipsbell.wav`),o.GUIStuff.drawFrame(e,t)}}s.lastRemainingTime=n.Configurations.getRemainingTimeCaption(0),s.bodyBackgroundColor=n.Configurations.backgroundColorNeutral,s.currentStartTime=Date.now(),t.Controller=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(2),i=r(0),o=r(3);t.GUIStuff=class{static resetGui(e,t){document.body.innerHTML=n.HTMLOutput.CreateTimerHtml(e,t)}static drawFrame(e,t){document.body.innerHTML=n.HTMLOutput.CreateTimerHtml(e,t)}static mightChangeBGColor(e,t){return o.TimeCalculations.isElapsedTimeBetween5and6seconds(e)&&i.Configurations.isNotNeutralBG(t)&&(t=i.Configurations.backgroundColorNeutral),e>=1e3*i.Configurations.secondsInCycle&&(t=i.Configurations.backgroundColorFailed),t}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.BellPlayer=class{static playBelAtTime(e,t,r){e==t&&this.playBell(r)}static playBell(e){let t=new Audio;t.src=e,console.log(t.src),t.load(),t.play()}}}]);