class Configurations {
  
    static  BackgroundColorNeutral: string = "#ffffff";
    static  BackgroundColorFailed: string = "#ffcccc";
    static  BackgroundColorPassed: string = "#ccffcc";
    static  SecondsInCycle: number = 120;
}

class GUIStuff {

    public static bodyBackgroundColor: string = Configurations.BackgroundColorNeutral;

    public static isNewSecond(remainingTime) {
        return this._lastRemainingTime !== remainingTime;
    }

    public static _lastRemainingTime: string = GUIStuff.getRemainingTimeCaption(Configurations.SecondsInCycle * 1000);
    public static runNextTick(): void {
        let elapsedTime: number = TimeStuff.calculateElaspedTime(Configurations.SecondsInCycle);
        this.bodyBackgroundColor = this.mightChangeBGColor(elapsedTime, this.bodyBackgroundColor);
        let remainingTime: string = this.getRemainingTimeCaption(elapsedTime);
        if (this.isNewSecond(remainingTime)) {
            this.updateUIForNewSecond(remainingTime);
            this._lastRemainingTime = remainingTime;
        }
    }
    public static updateUIForNewSecond(remainingTime: string): void{
        SoundStuff.playSoundAtKeyPoints(remainingTime);
        this.updateHtml(remainingTime, this.bodyBackgroundColor);
    }

    public static updateHtml(remainingTime: string, bgColor:string) {
        document.body.innerHTML = HTMLOutput .CreateTimerHtml(remainingTime, bgColor, true);
    }

    public static mightChangeBGColor(elapsedTime: number, bgColor: string) {
        if ( TimeStuff.isElapsedTimeBetween5and6seconds(elapsedTime) && this.isNotNeutralBG(bgColor)) {
            bgColor = Configurations.BackgroundColorNeutral;
        }
        if (elapsedTime >= Configurations.SecondsInCycle * 1000){
            bgColor = Configurations.BackgroundColorFailed;
        }
        return bgColor;
        
    }

    public static isNotNeutralBG(bgColor:string){
        return bgColor != Configurations.BackgroundColorNeutral;
    }

    public static getRemainingTimeCaption(elapsedTime: number): string {

        let remainingTime: Date = new Date((Configurations.SecondsInCycle * 1000) - elapsedTime);
        var minute: string | number = remainingTime.getMinutes();
        var second: string | number = remainingTime.getSeconds();
        if (minute < 10) { minute = '0' + minute; }
        if (second < 10) { second = '0' + second; }
    
        return '' + minute + ':' + second
    }
    
}

class HTMLOutput {
  
    static CreateTimerHtml(timerText: string, bodyColor: string, running: boolean): string {

        let timerHtml: string = this.createTimerBox(bodyColor) ;
        timerHtml += this.createTimerHtml(timerText)  ;
        timerHtml += this.createMenuHTML(running);
        timerHtml += this.createTimerBoxClosingTag();
        return timerHtml;
    
    }
    static resetGui():void{
        document.body.innerHTML = this.CreateTimerHtml(GUIStuff.getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, true);
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
        return `<a style=\"color: #555555;\" href=\"javascript:ActiveState.${command}();\">${text}</a> `
    }
 }



class ActiveState {


    public static _threadTimer: NodeJS.Timer ;
    public static quit():void {
        document.body.innerHTML = "";
        clearInterval(this._threadTimer)
    }
    
    public static reset():void {
        TimeStuff.currentStartTime = Date.now();
        GUIStuff.bodyBackgroundColor = Configurations.BackgroundColorPassed;
    }
    
    public static stop():void{
        clearInterval(this._threadTimer)
        HTMLOutput.resetGui();
    }
    
    public static start():void {
        HTMLOutput.resetGui()
        TimeStuff.currentStartTime = Date.now();
        this._threadTimer = setInterval(GUIStuff.runNextTick, 10);
    }
}


class SoundStuff {
    public static playSoundAtKeyPoints(remainingTime: string) {
        if (remainingTime == "00:10") {
            this.playSound("2166__suburban-grilla__bowl-struck.wav");
        }
        else if (remainingTime == "00:00") {
            this.playSound("32304__acclivity__shipsbell.wav");
           
        }
    }

    private static playSound(url: string): void {
        let audio = new Audio();
        audio.src = `./babystep/sounds/${url}`;
        console.log(audio.src);
        audio.load();
        audio.play();
    }
}

class TimeStuff {
   
    public static currentStartTime: number = Date.now();

    public static calculateElaspedTime( cycleTime: number) {
        let elapsedTime: number = Date.now() - this.currentStartTime;
        elapsedTime = this.resetTimeIfOver(elapsedTime, this.currentStartTime, cycleTime);
        return elapsedTime;
    }

    public static isElapsedTimeBetween5and6seconds(elapsedTime: number){
        return elapsedTime >= 5000 && elapsedTime < 6000
    }
    public static resetTimeIfOver(elapsedTime: number, currentStartTime: number, cycleTime: number) {
        if (elapsedTime >= cycleTime * 1000 + 980) {
            currentStartTime = Date.now();
            elapsedTime = Date.now() - currentStartTime;
        }
        return elapsedTime;
    }

}

document.body.innerHTML = HTMLOutput.CreateTimerHtml(GUIStuff.getRemainingTimeCaption(0), Configurations.BackgroundColorNeutral, false);