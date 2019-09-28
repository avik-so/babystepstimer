"use strict";
class Configurations {
}
Configurations.BackgroundColorNeutral = "#ffffff";
Configurations.BackgroundColorFailed = "#ffcccc";
Configurations.BackgroundColorPassed = "#ccffcc";
Configurations.SecondsInCycle = 120;
class GUIStuff {
    static runNextTick() {
        return function () {
            let elapsedTime = TimeStuff.calculateElaspedTime();
            GUIStuff.mightChangeBGColor(elapsedTime, ActiveState.bodyBackgroundColor);
            GUIStuff.updateUIForNewSecond(elapsedTime);
        };
    }
    static updateUIForNewSecond(elapsedTime) {
        let remainingTime = GUIStuff.getRemainingTimeCaption(elapsedTime);
        if (TimeStuff.isNewSecond(remainingTime)) {
            SoundStuff.playSoundAtKeyPoints(remainingTime);
            this.updateHtml(remainingTime, ActiveState.bodyBackgroundColor);
            ActiveState._lastRemainingTime = remainingTime;
        }
    }
    static updateHtml(remainingTime, bgColor) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(remainingTime, bgColor, true);
    }
    static mightChangeBGColor(elapsedTime, bgColor) {
        if (TimeStuff.isElapsedTimeBetween5and6seconds(elapsedTime) && this.isNotNeutralBG(bgColor)) {
            ActiveState.bodyBackgroundColor = Configurations.BackgroundColorNeutral;
        }
        if (elapsedTime >= Configurations.SecondsInCycle * 1000) {
            ActiveState.bodyBackgroundColor = Configurations.BackgroundColorFailed;
        }
    }
    static isNotNeutralBG(bgColor) {
        return bgColor != Configurations.BackgroundColorNeutral;
    }
    static getRemainingTimeCaption(elapsedTime) {
        let remainingTime = new Date((Configurations.SecondsInCycle * 1000) - elapsedTime);
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
class HTMLOutput {
    static CreateTimerHtml(timerText, bodyColor, running) {
        let timerHtml = this.createTimerBox(bodyColor);
        timerHtml += this.createTimerHtml(timerText);
        timerHtml += this.createMenuHTML(running);
        timerHtml += this.createTimerBoxClosingTag();
        return timerHtml;
    }
    static resetGui() {
        document.body.innerHTML = this.CreateTimerHtml(GUIStuff.getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);
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
        return `<a style=\"color: #555555;\" href=\"javascript:${command}();\">${text}</a> `;
    }
}
class ActiveState {
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
        HTMLOutput.resetGui();
    }
    static start() {
        HTMLOutput.resetGui();
        this.currentStartTime = Date.now();
        this._threadTimer = setInterval(GUIStuff.runNextTick(), 10);
    }
}
ActiveState.currentStartTime = Date.now();
ActiveState._lastRemainingTime = GUIStuff.getRemainingTimeCaption(Configurations.SecondsInCycle * 1000);
ActiveState.bodyBackgroundColor = Configurations.BackgroundColorNeutral;
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
class TimeStuff {
    static isNewSecond(remainingTime) {
        return ActiveState._lastRemainingTime !== remainingTime;
    }
    static calculateElaspedTime() {
        let elapsedTime = Date.now() - ActiveState.currentStartTime;
        elapsedTime = this.resetTimeIfOver(elapsedTime);
        return elapsedTime;
    }
    static isElapsedTimeBetween5and6seconds(elapsedTime) {
        return elapsedTime >= 5000 && elapsedTime < 6000;
    }
    static resetTimeIfOver(elapsedTime) {
        if (elapsedTime >= Configurations.SecondsInCycle * 1000 + 980) {
            ActiveState.currentStartTime = Date.now();
            elapsedTime = Date.now() - ActiveState.currentStartTime;
        }
        return elapsedTime;
    }
}
document.body.innerHTML = HTMLOutput.CreateTimerHtml(GUIStuff.getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);
