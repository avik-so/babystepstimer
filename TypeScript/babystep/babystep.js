"use strict";
class Configurations {
    static isNotNeutralBG(bgColor) {
        return bgColor != Configurations.backgroundColorNeutral;
    }
    static getRemainingTimeCaption(elapsedTime) {
        let remainingTime = new Date((Configurations.secondsInCycle * 1000) - elapsedTime);
        var minute = remainingTime.getMinutes();
        var second = remainingTime.getSeconds();
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return '' + minute + ':' + second;
    }
}
Configurations.backgroundColorNeutral = "#ffffff";
Configurations.backgroundColorFailed = "#ffcccc";
Configurations.backgroundColorPassed = "#ccffcc";
Configurations.secondsInCycle = 120;
Configurations.baseSoundURL = './babystep/sounds/';
class Controller {
    static runNextTick() {
        let elapsedTime = TimeCalculations.calculateElaspedTime(Configurations.secondsInCycle, Controller.currentStartTime);
        if (elapsedTime == 0) {
            Controller.currentStartTime = Date.now();
        }
        Controller.bodyBackgroundColor = GUIStuff.mightChangeBGColor(elapsedTime, Controller.bodyBackgroundColor);
        let remainingTime = Configurations.getRemainingTimeCaption(elapsedTime);
        if (TimeCalculations.isNewSecond(remainingTime, Controller.lastRemainingTime)) {
            GUIStuff.updateUIForNewSecond(remainingTime, Controller.bodyBackgroundColor);
            Controller.lastRemainingTime = remainingTime;
        }
    }
    static quit() {
        document.body.innerHTML = "";
        clearInterval(Controller._threadTimer);
    }
    static reset() {
        Controller.currentStartTime = Date.now();
        Controller.bodyBackgroundColor = Configurations.backgroundColorPassed;
    }
    static stop() {
        GUIStuff.resetGui(Configurations.getRemainingTimeCaption(0), Configurations.backgroundColorNeutral);
        clearInterval(Controller._threadTimer);
    }
    static start() {
        GUIStuff.resetGui(Configurations.getRemainingTimeCaption(0), Configurations.backgroundColorNeutral);
        Controller.currentStartTime = Date.now();
        Controller._threadTimer = setInterval(this.runNextTick, 10);
    }
}
Controller.lastRemainingTime = Configurations.getRemainingTimeCaption(0);
Controller.bodyBackgroundColor = Configurations.backgroundColorNeutral;
Controller.currentStartTime = Date.now();
class GUIStuff {
    static resetGui(timeText, bgColor) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(timeText, bgColor);
    }
    static updateUIForNewSecond(remainingTime, bgColor) {
        BellPlayer.playBelAtTime(remainingTime, "00:10", `${Configurations.baseSoundURL}2166__suburban-grilla__bowl-struck.wav`);
        BellPlayer.playBelAtTime(remainingTime, "00:00", `${Configurations.baseSoundURL}32304__acclivity__shipsbell.wav`);
        this.updateHtml(remainingTime, bgColor);
    }
    static updateHtml(remainingTime, bgColor) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(remainingTime, bgColor);
    }
    static mightChangeBGColor(elapsedTime, bgColor) {
        if (TimeCalculations.isElapsedTimeBetween5and6seconds(elapsedTime) && Configurations.isNotNeutralBG(bgColor)) {
            bgColor = Configurations.backgroundColorNeutral;
        }
        if (elapsedTime >= Configurations.secondsInCycle * 1000) {
            bgColor = Configurations.backgroundColorFailed;
        }
        return bgColor;
    }
}
class BellPlayer {
    static playBelAtTime(remainingTime, timeToPlay, sound) {
        if (remainingTime == timeToPlay) {
            this.playBell(sound);
        }
    }
    static playBell(url) {
        let audio = new Audio();
        audio.src = url;
        console.log(audio.src);
        audio.load();
        audio.play();
    }
}
class TimeCalculations {
    static isNewSecond(remainingTime, lastRemainingTime) {
        return remainingTime !== lastRemainingTime;
    }
    static calculateElaspedTime(cycleTime, startTime) {
        let elapsedTime = Date.now() - startTime;
        elapsedTime = this.resetTimeIfCycleComplete(elapsedTime, cycleTime);
        return elapsedTime;
    }
    static isElapsedTimeBetween5and6seconds(elapsedTime) {
        return elapsedTime >= 5000 && elapsedTime < 6000;
    }
    static resetTimeIfCycleComplete(elapsedTime, cycleTime) {
        if (elapsedTime >= cycleTime * 1000 + 980) {
            elapsedTime = 0;
        }
        return elapsedTime;
    }
}
class HTMLOutput {
    static CreateTimerHtml(timerText, bodyColor) {
        let timerHtml = this.createTimerBox(bodyColor);
        timerHtml += this.createTimerHtml(timerText);
        timerHtml += this.createMenuHTML(timerText !== Configurations.getRemainingTimeCaption(0));
        timerHtml += this.createTimerBoxClosingTag();
        return timerHtml;
    }
    static createTimerBoxClosingTag() {
        return '</div>';
    }
    static createTimerBox(bodyColor) {
        return `<div style=\"border: 3px solid #555555; background: ${bodyColor}; margin: 0; padding: 0;\">`;
    }
    static createTimerHtml(timerText) {
        return "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText + "</h1>";
    }
    static createMenuHTML(isRunning) {
        let menuHTML = '<div style=\"text-align: center\">';
        menuHTML += isRunning ? this.createMenuLink('stop', 'Stop') + this.createMenuLink('reset', "Reset") : this.createMenuLink('start', 'Start');
        menuHTML += this.createMenuLink('quit', 'Quit');
        menuHTML += '</div>';
        return menuHTML;
    }
    static createMenuLink(command, text) {
        //Hiddent dependecy on Controller class
        return `<a style=\"color: #555555;\" href=\"javascript:Controller.${command}();\">${text}</a> `;
    }
}
document.body.innerHTML = HTMLOutput.CreateTimerHtml(Configurations.getRemainingTimeCaption(0), Configurations.backgroundColorNeutral);
