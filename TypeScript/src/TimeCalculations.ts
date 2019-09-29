export class TimeCalculations {
    public static isNewSecond(remainingTime: string, lastRemainingTime: string) {
        return remainingTime !== lastRemainingTime;
    }
    public static calculateElaspedTime(cycleTime: number, startTime: number) {
        let elapsedTime: number = Date.now() - startTime;
        elapsedTime = this.resetTimeIfCycleComplete(elapsedTime, cycleTime);
        return elapsedTime;
    }
    public static isElapsedTimeBetween5and6seconds(elapsedTime: number) {
        return elapsedTime >= 5000 && elapsedTime < 6000;
    }
    public static resetTimeIfCycleComplete(elapsedTime: number, cycleTime: number) {
        if (elapsedTime >= cycleTime * 1000 + 980) {
            elapsedTime = 0;
        }
        return elapsedTime;
    }
}
