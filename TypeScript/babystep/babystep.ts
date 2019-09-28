class Configurations {
  
    static  BackgroundColorNeutral: string = "#ffffff";
    static  BackgroundColorFailed: string = "#ffcccc";
    static  BackgroundColorPassed: string = "#ccffcc";
    static  SecondsInCycle: number = 120;
    public static isNotNeutralBG(bgColor:string){
        return bgColor != Configurations.BackgroundColorNeutral;
    }


}
class Controller {


    public static _threadTimer: NodeJS.Timer ;
    private static lastRemainingTime: string;
    private static bodyBackgroundColor: string = Configurations.BackgroundColorNeutral;
    public static currentStartTime: number = Date.now();
    public static runNextTick(): void {
        let elapsedTime: number = TimeCalculations.calculateElaspedTime(Configurations.SecondsInCycle, this.currentStartTime);
        this.bodyBackgroundColor = GUIStuff.mightChangeBGColor(elapsedTime, this.bodyBackgroundColor);
        let remainingTime: string = GUIStuff.getRemainingTimeCaption((Configurations.SecondsInCycle * 1000) - elapsedTime);
        if (TimeCalculations.isNewSecond(remainingTime, this.lastRemainingTime)) {
            GUIStuff.updateUIForNewSecond(remainingTime, this.bodyBackgroundColor);
            this.lastRemainingTime = remainingTime;
        }
    }


    public static quit():void {
        document.body.innerHTML = "";
        clearInterval(this._threadTimer)
    }
    
    public static reset():void {
        this.currentStartTime = Date.now();
        this.bodyBackgroundColor = Configurations.BackgroundColorPassed;
    }
    
    public static stop():void{
        clearInterval(this._threadTimer)
        GUIStuff.resetGui(Configurations.BackgroundColorNeutral);
    }
    
    public static start():void {
        GUIStuff.resetGui(Configurations.BackgroundColorNeutral)
        this.currentStartTime = Date.now();
        this._threadTimer = setInterval(this.runNextTick, 10);
    }
}



class GUIStuff {
  
    static resetGui(bgColor):void{
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(this.getRemainingTimeCaption(Configurations.SecondsInCycle * 1000), bgColor, true);
    }
    
    public static updateUIForNewSecond(remainingTime: string, bgColor: string): void{
        SoundStuff.playSoundAtKeyPoints(remainingTime);
        this.updateHtml(remainingTime, bgColor);
    }

    public static updateHtml(remainingTime: string, bgColor:string) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(remainingTime, bgColor, true);
    }

    public static mightChangeBGColor(elapsedTime: number, bgColor: string) {
        if ( TimeCalculations.isElapsedTimeBetween5and6seconds(elapsedTime) && Configurations.isNotNeutralBG(bgColor)) {
            bgColor = Configurations.BackgroundColorNeutral;
        }
        if (elapsedTime >= Configurations.SecondsInCycle * 1000){
            bgColor = Configurations.BackgroundColorFailed;
        }
        return bgColor;
        
    }

    public static getRemainingTimeCaption(time: number): string {

        let remainingTime: Date = new Date(time);
        var minute: string | number = remainingTime.getMinutes();
        var second: string | number = remainingTime.getSeconds();
        if (minute < 10) { minute = '0' + minute; }
        if (second < 10) { second = '0' + second; }
    
        return '' + minute + ':' + second
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

class TimeCalculations {
      
    public static isNewSecond(remainingTime: string, lastRemainingTime: string) {
        return remainingTime !== lastRemainingTime;
    }
    public static calculateElaspedTime( cycleTime: number, startTime: number) {
        let elapsedTime: number = Date.now() - startTime;
        elapsedTime = this.resetTimeIfOver(elapsedTime, startTime, cycleTime);
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

class HTMLOutput {
  
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
        //Hiddent dependecy on Controller class
        return `<a style=\"color: #555555;\" href=\"javascript:Controller.${command}();\">${text}</a> `
    }
 }


document.body.innerHTML = HTMLOutput.CreateTimerHtml(GUIStuff.getRemainingTimeCaption(Configurations.SecondsInCycle * 1000), Configurations.BackgroundColorNeutral, false);