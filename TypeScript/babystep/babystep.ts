class Configurations {
  
    static  BackgroundColorNeutral: string = "#ffffff";
    static  BackgroundColorFailed: string = "#ffcccc";
    static  BackgroundColorPassed: string = "#ccffcc";
    static  SecondsInCycle: number = 120;
}

class BabyStepGUI {
  
    static CreateTimerHtml(timerText: string, bodyColor: string, running: boolean): string {

        let timerHtml: string = this.createTimerBox(bodyColor) ;
        timerHtml += this.createTimerHtml(timerText)  ;
        timerHtml += this.createMenuHTML(running);
        timerHtml += this.createTimerBoxClosingTag();
        return timerHtml;
    
    }
    private static createTimerBoxClosingTag():string{
        return '</div>'
    }
    private static createTimerBox(bodyColor:string):string{
        return `<div style=\"border: 3px solid #555555; background: ${bodyColor}; margin: 0; padding: 0;\">`
    }
    
    private  static createTimerHtml(timerText: string): string{
        return "<h1 style=\"text-align: center; font-size: 30px; color: #333333;\">" + timerText +  "</h1>"
    }
    
    private static createMenuHTML (isRunning: boolean):string {
        let menuHTML = '<div style=\"text-align: center\">'
        menuHTML += isRunning? this.createMenuLink('stop', 'Stop') + this.createMenuLink('reset', "Reset") : this.createMenuLink('start', 'Start')
        menuHTML += this.createMenuLink('quit', 'Quit');
        menuHTML += '</div>';
        return menuHTML;
    }
    
    private static createMenuLink(command: string, text: string): string {
        return `<a style=\"color: #555555;\" href=\"javascript:${command}();\">${text}</a> `
    }
    public static resetGui():void{
        document.body.innerHTML = this.CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);
    }
}

let currentStartTime: number;
let _lastRemainingTime: string;

let _bodyBackgroundColor: string = Configurations.BackgroundColorNeutral;
let _threadTimer: NodeJS.Timer;


document.body.innerHTML = BabyStepGUI.CreateTimerHtml(getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);


function quit():void {
    document.body.innerHTML = "";
    clearInterval(_threadTimer)
}

function reset():void {
    currentStartTime = Date.now();
    _bodyBackgroundColor = Configurations.BackgroundColorPassed;
}

function stop():void{
    clearInterval(_threadTimer)
    BabyStepGUI.resetGui();
}

function start():void {
    BabyStepGUI.resetGui()
    currentStartTime = Date.now();
    _threadTimer = setInterval(runNextTick(), 10);
}



function runNextTick(): (...args: any[]) => void {
    return function () {
             let elapsedTime: number = calculateElaspedTime();
            mightChangeBGColor(elapsedTime, _bodyBackgroundColor);
            let remainingTime: string = getRemainingTimeCaption(elapsedTime);
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
    document.body.innerHTML = BabyStepGUI .CreateTimerHtml(remainingTime, bgColor, true);
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

function playSound(url: string): void {
    let audio = new Audio();
    audio.src = `./babystep/sounds/${url}`;
    console.log(audio.src);
    audio.load();
    audio.play();
}