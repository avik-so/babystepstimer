"use strict";
class Configurations {
    static isNotNeutralBG(bgColor) {
        return bgColor != Configurations.BackgroundColorNeutral;
    }
}
Configurations.BackgroundColorNeutral = "#ffffff";
Configurations.BackgroundColorFailed = "#ffcccc";
Configurations.BackgroundColorPassed = "#ccffcc";
Configurations.SecondsInCycle = 120;
class Controller {
    static runNextTick() {
        let elapsedTime = TimeCalculations.calculateElaspedTime(Configurations.SecondsInCycle, this.currentStartTime);
        this.bodyBackgroundColor = GUIStuff.mightChangeBGColor(elapsedTime, this.bodyBackgroundColor);
        let remainingTime = GUIStuff.getRemainingTimeCaption((Configurations.SecondsInCycle * 1000) - elapsedTime);
        if (TimeCalculations.isNewSecond(remainingTime, this.lastRemainingTime)) {
            GUIStuff.updateUIForNewSecond(remainingTime, this.bodyBackgroundColor);
            this.lastRemainingTime = remainingTime;
        }
    }
    static quit() {
        document.body.innerHTML = "";
        clearInterval(this._threadTimer);
    }
    static reset() {
        this.currentStartTime = Date.now();
        this.bodyBackgroundColor = Configurations.BackgroundColorPassed;
    }
    static stop() {
        clearInterval(this._threadTimer);
        GUIStuff.resetGui(Configurations.BackgroundColorNeutral);
    }
    static start() {
        GUIStuff.resetGui(Configurations.BackgroundColorNeutral);
        this.currentStartTime = Date.now();
        this._threadTimer = setInterval(this.runNextTick, 10);
    }
}
Controller.bodyBackgroundColor = Configurations.BackgroundColorNeutral;
Controller.currentStartTime = Date.now();
class GUIStuff {
    static resetGui(bgColor) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(this.getRemainingTimeCaption(Configurations.SecondsInCycle * 1000), bgColor, true);
    }
    static updateUIForNewSecond(remainingTime, bgColor) {
        SoundStuff.playSoundAtKeyPoints(remainingTime);
        this.updateHtml(remainingTime, bgColor);
    }
    static updateHtml(remainingTime, bgColor) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(remainingTime, bgColor, true);
    }
    static mightChangeBGColor(elapsedTime, bgColor) {
        if (TimeCalculations.isElapsedTimeBetween5and6seconds(elapsedTime) && Configurations.isNotNeutralBG(bgColor)) {
            bgColor = Configurations.BackgroundColorNeutral;
        }
        if (elapsedTime >= Configurations.SecondsInCycle * 1000) {
            bgColor = Configurations.BackgroundColorFailed;
        }
        return bgColor;
    }
    static getRemainingTimeCaption(time) {
        let remainingTime = new Date(time);
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
class SoundStuff {
    static playSoundAtKeyPoints(remainingTime) {
        if (remainingTime == "00:10") {
            this.playSound("2166__suburban-grilla__bowl-struck.wav");
        }
        else if (remainingTime == "00:00") {
            this.playSound("32304__acclivity__shipsbell.wav");
        }
    }
    static playSound(url) {
        let audio = new Audio();
        audio.src = `./babystep/sounds/${url}`;
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
        elapsedTime = this.resetTimeIfOver(elapsedTime, startTime, cycleTime);
        return elapsedTime;
    }
    static isElapsedTimeBetween5and6seconds(elapsedTime) {
        return elapsedTime >= 5000 && elapsedTime < 6000;
    }
    static resetTimeIfOver(elapsedTime, currentStartTime, cycleTime) {
        if (elapsedTime >= cycleTime * 1000 + 980) {
            currentStartTime = Date.now();
            elapsedTime = Date.now() - currentStartTime;
        }
        return elapsedTime;
    }
}
class HTMLOutput {
    static CreateTimerHtml(timerText, bodyColor, running) {
        let timerHtml = this.createTimerBox(bodyColor);
        timerHtml += this.createTimerHtml(timerText);
        timerHtml += this.createMenuHTML(running);
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
document.body.innerHTML = HTMLOutput.CreateTimerHtml(GUIStuff.getRemainingTimeCaption(Configurations.SecondsInCycle * 1000), Configurations.BackgroundColorNeutral, false);
