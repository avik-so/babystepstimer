import { Configurations } from "./BackgroundColorNeutral.1";

let _timerRunning: boolean;
let _currentCycleStartTime: number;
let _lastRemainingTime: string;
let _bodyBackgroundColor: string = Configurations.BackgroundColorNeutral;
let _threadTimer: NodeJS.Timer;


document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);


function command(arg: string): void {
    let args = { Url: { AbsoluteUri: `command://${arg}/` } }
    console.log('called', arg, args.Url.AbsoluteUri);
    if (args.Url.AbsoluteUri == "command://start/") {
        document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);

        _timerRunning = true;
        _currentCycleStartTime = Date.now();

        _threadTimer = setInterval(function() {
            if (_timerRunning) {
                let elapsedTime: number = Date.now() - _currentCycleStartTime;

                if (elapsedTime >= Configurations.SecondsInCycle * 1000 + 980) {
                    _currentCycleStartTime = Date.now();
                    elapsedTime = Date.now() - _currentCycleStartTime;
                }
                if (elapsedTime >= 5000 && elapsedTime < 6000 && _bodyBackgroundColor != Configurations.BackgroundColorNeutral) {
                    _bodyBackgroundColor = Configurations.BackgroundColorNeutral;
                }

                let remainingTime: string = getRemainingTimeCaption(elapsedTime);


                if (_lastRemainingTime !== remainingTime) {

                    if (remainingTime == "00:10") {
                        playSound("2166__suburban-grilla__bowl-struck.wav");
                    }
                    else if (remainingTime == "00:00") {
                        playSound("32304__acclivity__shipsbell.wav");
                        _bodyBackgroundColor = Configurations.BackgroundColorFailed;
                    }

                    document.body.innerHTML = CreateTimerHtml(remainingTime, _bodyBackgroundColor, true);
                    _lastRemainingTime = remainingTime;
                }
            }
        }, 10);
    }
    else if (args.Url.AbsoluteUri == "command://stop/") {
        _timerRunning = false;
        clearInterval(_threadTimer)
        document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);

    }
    else if (args.Url.AbsoluteUri == "command://reset/") {
        _currentCycleStartTime = Date.now();
        _bodyBackgroundColor = Configurations.BackgroundColorPassed;
    }
    else if (args.Url.AbsoluteUri == "command://quit/") {
        document.body.innerHTML = "";
        clearInterval(_threadTimer)
    }

};


function getRemainingTimeCaption(elapsedTime: number): string {

    let remainingTime: Date = new Date((Configurations.SecondsInCycle * 1000) - elapsedTime);
    var minute: string | number = remainingTime.getMinutes();
    var second: string | number = remainingTime.getSeconds();
    if (minute < 10) { minute = '0' + minute; }
    if (second < 10) { second = '0' + second; }

    return '' + minute + ':' + second
}

function CreateTimerHtml(timerText: string, bodyColor: string, running: boolean): string {

    let timerHtml: string = "<div style=\"border: 3px solid #555555; background: " + bodyColor +
        "; margin: 0; padding: 0;\">" +
        "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText +
        "</h1>" +
        "<div style=\"text-align: center\">";
    if (running) {
        timerHtml += "<a style=\"color: #555555;\" href=\"javascript:command('stop');\">Stop</a> " +
            "<a style=\"color: #555555;\" href=\"javascript:command('reset');\">Reset</a> ";
    }
    else {
        timerHtml += "<a style=\"color: #555555;\" href=\"javascript:command('start');\">Start</a> ";
    }
    timerHtml += "<a style=\"color: #555555;\" href=\"javascript:command('quit');\">Quit</a> ";
    timerHtml += "</div></div>"
    return timerHtml;

}

function playSound(url: string): void {
    let audio = new Audio();
    audio.src = `./babystep/sounds/${url}`;
    console.log(audio.src);
    audio.load();
    audio.play();
}


