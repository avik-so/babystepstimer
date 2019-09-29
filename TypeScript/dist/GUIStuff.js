"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTMLOutput_1 = require("./HTMLOutput");
const Configurations_1 = require("./Configurations");
const TimeCalculations_1 = require("./TimeCalculations");
class GUIStuff {
    static resetGui(timeText, bgColor) {
        document.body.innerHTML = HTMLOutput_1.HTMLOutput.CreateTimerHtml(timeText, bgColor);
    }
    static drawFrame(remainingTime, bgColor) {
        document.body.innerHTML = HTMLOutput_1.HTMLOutput.CreateTimerHtml(remainingTime, bgColor);
    }
    static mightChangeBGColor(elapsedTime, bgColor) {
        if (TimeCalculations_1.TimeCalculations.isElapsedTimeBetween5and6seconds(elapsedTime) && Configurations_1.Configurations.isNotNeutralBG(bgColor)) {
            bgColor = Configurations_1.Configurations.backgroundColorNeutral;
        }
        if (elapsedTime >= Configurations_1.Configurations.secondsInCycle * 1000) {
            bgColor = Configurations_1.Configurations.backgroundColorFailed;
        }
        return bgColor;
    }
}
exports.GUIStuff = GUIStuff;
//# sourceMappingURL=GUIStuff.js.map