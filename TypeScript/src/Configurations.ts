export class Configurations {
    static backgroundColorNeutral: string = "#ffffff";
    static backgroundColorFailed: string = "#ffcccc";
    static backgroundColorPassed: string = "#ccffcc";
    static secondsInCycle: number = 120;
    static baseSoundURL: string = './sounds/';
    public static isNotNeutralBG(bgColor: string) {
        return bgColor != Configurations.backgroundColorNeutral;
    }
    public static getRemainingTimeCaption(elapsedTime: number): string {
        let remainingTime: Date = new Date((Configurations.secondsInCycle * 1000) - elapsedTime);
        var minute: string | number = remainingTime.getMinutes();
        var second: string | number = remainingTime.getSeconds();
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return '' + minute + ':' + second;
    }
}
