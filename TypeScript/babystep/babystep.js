"use strict";
class Configurations {
}
Configurations.BackgroundColorNeutral = "#ffffff";
Configurations.BackgroundColorFailed = "#ffcccc";
Configurations.BackgroundColorPassed = "#ccffcc";
Configurations.SecondsInCycle = 120;
class BabyStepGUI {
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
        return `<a style=\"color: #555555;\" href=\"javascript:${command}();\">${text}</a> `;
    }
    static resetGui() {
        document.body.innerHTML = this.CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);
    }
}
let currentStartTime;
let _lastRemainingTime;
let _bodyBackgroundColor = Configurations.BackgroundColorNeutral;
let _threadTimer;
document.body.innerHTML = BabyStepGUI.CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);
function quit() {
    document.body.innerHTML = "";
    clearInterval(_threadTimer);
}
function reset() {
    currentStartTime = Date.now();
    _bodyBackgroundColor = Configurations.BackgroundColorPassed;
}
function stop() {
    clearInterval(_threadTimer);
    BabyStepGUI.resetGui();
}
function start() {
    BabyStepGUI.resetGui();
    currentStartTime = Date.now();
    _threadTimer = setInterval(runNextTick(), 10);
}
function runNextTick() {
    return function () {
        let elapsedTime = calculateElaspedTime();
        mightChangeBGColor(elapsedTime, _bodyBackgroundColor);
        let remainingTime = getRemainingTimeCaption(elapsedTime);
        if (isNewSecond(remainingTime)) {
            playSoundIfTimeis10or0SecondsRemaining(remainingTime);
            updateHtml(remainingTime, _bodyBackgroundColor);
            _lastRemainingTime = remainingTime;
        }
    };
}
function isNewSecond(remainingTime) {
    return _lastRemainingTime !== remainingTime;
}
function playSoundIfTimeis10or0SecondsRemaining(remainingTime) {
    if (remainingTime == "00:10") {
        playSound("2166__suburban-grilla__bowl-struck.wav");
    }
    else if (remainingTime == "00:00") {
        playSound("32304__acclivity__shipsbell.wav");
    }
}
function calculateElaspedTime() {
    let elapsedTime = Date.now() - currentStartTime;
    elapsedTime = resetTimeIfOver(elapsedTime);
    return elapsedTime;
}
function updateHtml(remainingTime, bgColor) {
    document.body.innerHTML = BabyStepGUI.CreateTimerHtml(remainingTime, bgColor, true);
}
function mightChangeBGColor(elapsedTime, bgColor) {
    if (isElapsedTimeBetween5and6seconds(elapsedTime) && isNotNeutralBG(bgColor)) {
        _bodyBackgroundColor = Configurations.BackgroundColorNeutral;
    }
    if (elapsedTime >= Configurations.SecondsInCycle * 1000) {
        _bodyBackgroundColor = Configurations.BackgroundColorFailed;
    }
}
function isElapsedTimeBetween5and6seconds(elapsedTime) {
    return elapsedTime >= 5000 && elapsedTime < 6000;
}
function isNotNeutralBG(bgColor) {
    return bgColor != Configurations.BackgroundColorNeutral;
}
function resetTimeIfOver(elapsedTime) {
    if (elapsedTime >= Configurations.SecondsInCycle * 1000 + 980) {
        currentStartTime = Date.now();
        elapsedTime = Date.now() - currentStartTime;
    }
    return elapsedTime;
}
function getRemainingTimeCaption(elapsedTime) {
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
function playSound(url) {
    let audio = new Audio();
    audio.src = `./babystep/sounds/${url}`;
    console.log(audio.src);
    audio.load();
    audio.play();
}
