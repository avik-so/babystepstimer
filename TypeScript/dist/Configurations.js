"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configurations {
    static isNotNeutralBG(bgColor) {
        return bgColor != Configurations.backgroundColorNeutral;
    }
    static getRemainingTimeCaption(elapsedTime) {
        let remainingTime = new Date((Configurations.secondsInCycle * 1000) - elapsedTime);
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
}
Configurations.backgroundColorNeutral = "#ffffff";
Configurations.backgroundColorFailed = "#ffcccc";
Configurations.backgroundColorPassed = "#ccffcc";
Configurations.secondsInCycle = 120;
Configurations.baseSoundURL = './sounds/';
exports.Configurations = Configurations;
//# sourceMappingURL=Configurations.js.map