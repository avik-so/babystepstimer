class Configurations {
  
    static  BackgroundColorNeutral: string = "#ffffff";
    static  BackgroundColorFailed: string = "#ffcccc";
    static  BackgroundColorPassed: string = "#ccffcc";
    static  SecondsInCycle: number = 120;
}

let isTimerRunning: boolean;
let currentStartTime: number;
let _lastRemainingTime: string;

let _bodyBackgroundColor: string = Configurations.BackgroundColorNeutral;
let _threadTimer: NodeJS.Timer;


document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);


function pickACommand(arg: string): void {
    let args = { Url: { AbsoluteUri: `command://${arg}/` } }
    console.log('called', arg, args.Url.AbsoluteUri);
    if (args.Url.AbsoluteUri == "command://start/") {
        document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);

        isTimerRunning = true;
        currentStartTime = Date.now();

        _threadTimer = setInterval(IfTimerIsRunningResetElapsedTimeifOverUpdateBackgroundColorAndPlaySounds(), 10);
    }
    else if (args.Url.AbsoluteUri == "command://stop/") {
        isTimerRunning = false;
        clearInterval(_threadTimer)
        document.body.innerHTML = CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);

    }
    else if (args.Url.AbsoluteUri == "command://reset/") {
        currentStartTime = Date.now();
        _bodyBackgroundColor = Configurations.BackgroundColorPassed;
    }
    else if (args.Url.AbsoluteUri == "command://quit/") {
        document.body.innerHTML = "";
        clearInterval(_threadTimer)
    }

};


function IfTimerIsRunningResetElapsedTimeifOverUpdateBackgroundColorAndPlaySounds(): (...args: any[]) => void {
    return function () {
        if (isTimerRunning) {
            let elapsedTime: number = calculateElaspedTime();
            mightChangeBGColor(elapsedTime, _bodyBackgroundColor);
            let remainingTime: string = getRemainingTimeCaption(elapsedTime);
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
function playSoundIfTimeis10or0SecondsRemaining(remainingTime: string) {
    if (remainingTime == "00:10") {
        playSound("2166__suburban-grilla__bowl-struck.wav");
    }
    else if (remainingTime == "00:00") {
        playSound("32304__acclivity__shipsbell.wav");
       
    }
}

function calculateElaspedTime() {
    let elapsedTime: number = Date.now() - currentStartTime;
    elapsedTime = resetTimeIfOver(elapsedTime);
    return elapsedTime;
}

function updateHtml(remainingTime: string, bgColor:string) {
    document.body.innerHTML = CreateTimerHtml(remainingTime, bgColor, true);
}

function mightChangeBGColor(elapsedTime: number, bgColor: string) {
    if ( isElapsedTimeBetween5and6seconds(elapsedTime) && isNotNeutralBG(bgColor)) {
        _bodyBackgroundColor = Configurations.BackgroundColorNeutral;
    }
    if (elapsedTime >= Configurations.SecondsInCycle * 1000){
        _bodyBackgroundColor = Configurations.BackgroundColorFailed;
    }
    
}

function isElapsedTimeBetween5and6seconds(elapsedTime: number){
    return elapsedTime >= 5000 && elapsedTime < 6000
}

function isNotNeutralBG(bgColor:string){
    return bgColor != Configurations.BackgroundColorNeutral;
}

function resetTimeIfOver(elapsedTime: number) {
    if (elapsedTime >= Configurations.SecondsInCycle * 1000 + 980) {
        currentStartTime = Date.now();
        elapsedTime = Date.now() - currentStartTime;
    }
    return elapsedTime;
}

function getRemainingTimeCaption(elapsedTime: number): string {

    let remainingTime: Date = new Date((Configurations.SecondsInCycle * 1000) - elapsedTime);
    var minute: string | number = remainingTime.getMinutes();
    var second: string | number = remainingTime.getSeconds();
    if (minute < 10) { minute = '0' + minute; }
    if (second < 10) { second = '0' + second; }

    return '' + minute + ':' + second
}

function CreateTimerHtml(timerText: string, bodyColor: string, running: boolean): string {

    let timerHtml: string = createTimerBox(bodyColor) ;
    timerHtml += createTimerHtml(timerText)  ;
    timerHtml += createMenuHTML(running);
    timerHtml += createTimerBoxClosingTag();
    return timerHtml;

}
function createTimerBoxClosingTag():string{
    return '</div>'
}
function createTimerBox(bodyColor:string):string{
    return `<div style=\"border: 3px solid #555555; background: ${bodyColor}; margin: 0; padding: 0;\">`
}

function createTimerHtml(timerText: string): string{
    return "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText +  "</h1>"
}

function createMenuHTML (isRunning: boolean):string {
    let menuHTML = '<div style=\"text-align: center\">'
    menuHTML += isRunning? createMenuLink('stop', 'Stop') + createMenuLink('reset', "Reset") : createMenuLink('start', 'Start')
    menuHTML += createMenuLink('quit', 'Quit');
    menuHTML += '</div>';
    return menuHTML;
}

function createMenuLink(command: string, text: string): string {
    return `<a style=\"color: #555555;\" href=\"javascript:pickACommand('${command}');\">${text}</a> `
}

function playSound(url: string): void {
    let audio = new Audio();
    audio.src = `./babystep/sounds/${url}`;
    console.log(audio.src);
    audio.load();
    audio.play();
}




