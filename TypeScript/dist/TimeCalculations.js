"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeCalculations {
    static isNewSecond(remainingTime, lastRemainingTime) {
        return remainingTime !== lastRemainingTime;
    }
    static calculateElaspedTime(cycleTime, startTime) {
        let elapsedTime = Date.now() - startTime;
        elapsedTime = this.resetTimeIfCycleComplete(elapsedTime, cycleTime);
        return elapsedTime;
    }
    static isElapsedTimeBetween5and6seconds(elapsedTime) {
        return elapsedTime >= 5000 && elapsedTime < 6000;
    }
    static resetTimeIfCycleComplete(elapsedTime, cycleTime) {
        if (elapsedTime >= cycleTime * 1000 + 980) {
            elapsedTime = 0;
        }
        return elapsedTime;
    }
}
exports.TimeCalculations = TimeCalculations;
//# sourceMappingURL=TimeCalculations.js.map