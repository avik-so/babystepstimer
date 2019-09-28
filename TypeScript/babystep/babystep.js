"use strict";
class Configurations {
}
Configurations.BackgroundColorNeutral = "#ffffff";
Configurations.BackgroundColorFailed = "#ffcccc";
Configurations.BackgroundColorPassed = "#ccffcc";
Configurations.SecondsInCycle = 120;
let isTimerRunning;
let currentStartTime;
let _lastRemainingTime;
let _bodyBackgroundColor = Configurations.BackgroundColorNeutral;
let _threadTimer;
document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);
function pickACommand(arg) {
    let args = { Url: { AbsoluteUri: `command://${arg}/` } };
    console.log('called', arg, args.Url.AbsoluteUri);
    if (args.Url.AbsoluteUri == "command://start/") {
        document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);
        isTimerRunning = true;
        currentStartTime = Date.now();
        _threadTimer = setInterval(IfTimerIsRunningResetElapsedTimeifOverUpdateBackgroundColorAndPlaySounds(), 10);
    }
    else if (args.Url.AbsoluteUri == "command://stop/") {
        isTimerRunning = false;
        clearInterval(_threadTimer);
        document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);
    }
    else if (args.Url.AbsoluteUri == "command://reset/") {
        currentStartTime = Date.now();
        _bodyBackgroundColor = Configurations.BackgroundColorPassed;
    }
    else if (args.Url.AbsoluteUri == "command://quit/") {
        document.body.innerHTML = "";
        clearInterval(_threadTimer);
    }
}
;
function IfTimerIsRunningResetElapsedTimeifOverUpdateBackgroundColorAndPlaySounds() {
    return function () {
        if (isTimerRunning) {
            let elapsedTime = calculateElaspedTime();
            mightResetBGColor(elapsedTime, _bodyBackgroundColor);
            let remainingTime = getRemainingTimeCaption(elapsedTime);
            if (isNewSecond(remainingTime)) {
                playSoundIfTimeis10or0SecondsRemaining(remainingTime);
                updateHtml(remainingTime, _bodyBackgroundColor);
                _lastRemainingTime = remainingTime;
            }
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
        _bodyBackgroundColor = Configurations.BackgroundColorFailed;
    }
}
function calculateElaspedTime() {
    let elapsedTime = Date.now() - currentStartTime;
    elapsedTime = resetTimeIfOver(elapsedTime);
    return elapsedTime;
}
function updateHtml(remainingTime, bgColor) {
    document.body.innerHTML = CreateTimerHtml(remainingTime, bgColor, true);
}
function mightResetBGColor(elapsedTime, bgColor) {
    if (isElapsedTimeBetween5and6seconds(elapsedTime) && isNotNeutralBG(bgColor)) {
        _bodyBackgroundColor = Configurations.BackgroundColorNeutral;
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
function CreateTimerHtml(timerText, bodyColor, running) {
    let timerHtml = "<div style=\"border: 3px solid #555555; background: " + bodyColor +
        "; margin: 0; padding: 0;\">" +
        "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText +
        "</h1>" +
        "<div style=\"text-align: center\">";
    if (running) {
        timerHtml += "<a style=\"color: #555555;\" href=\"javascript:pickACommand('stop');\">Stop</a> " +
            "<a style=\"color: #555555;\" href=\"javascript:pickACommand('reset');\">Reset</a> ";
    }
    else {
        timerHtml += "<a style=\"color: #555555;\" href=\"javascript:pickACommand('start');\">Start</a> ";
    }
    timerHtml += "<a style=\"color: #555555;\" href=\"javascript:pickACommand('quit');\">Quit</a> ";
    timerHtml += "</div></div>";
    return timerHtml;
}
function playSound(url) {
    let audio = new Audio();
    audio.src = `./babystep/sounds/${url}`;
    console.log(audio.src);
    audio.load();
    audio.play();
}
