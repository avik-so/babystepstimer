"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Configurations_1 = require("./Configurations");
const TimeCalculations_1 = require("./TimeCalculations");
const GUIStuff_1 = require("./GUIStuff");
const BellPlayer_1 = require("./BellPlayer");
class Controller {
    static runNextTick() {
        let elapsedTime = TimeCalculations_1.TimeCalculations.calculateElaspedTime(Configurations_1.Configurations.secondsInCycle, Controller.currentStartTime);
        if (elapsedTime == 0) {
            Controller.resetStartTime();
        }
        Controller.bodyBackgroundColor = GUIStuff_1.GUIStuff.mightChangeBGColor(elapsedTime, Controller.bodyBackgroundColor);
        let remainingTime = Configurations_1.Configurations.getRemainingTimeCaption(elapsedTime);
        if (TimeCalculations_1.TimeCalculations.isNewSecond(remainingTime, Controller.lastRemainingTime)) {
            Controller.updateUIForNewSecond(remainingTime, Controller.bodyBackgroundColor);
            Controller.lastRemainingTime = remainingTime;
        }
    }
    static resetStartTime() {
        Controller.currentStartTime = Date.now();
    }
    static quit() {
        document.body.innerHTML = "";
        clearInterval(Controller._threadTimer);
    }
    static reset() {
        Controller.resetStartTime();
        Controller.bodyBackgroundColor = Configurations_1.Configurations.backgroundColorPassed;
    }
    static stop() {
        GUIStuff_1.GUIStuff.resetGui(Configurations_1.Configurations.getRemainingTimeCaption(0), Configurations_1.Configurations.backgroundColorNeutral);
        clearInterval(Controller._threadTimer);
    }
    static start() {
        GUIStuff_1.GUIStuff.resetGui(Configurations_1.Configurations.getRemainingTimeCaption(0), Configurations_1.Configurations.backgroundColorNeutral);
        Controller.resetStartTime();
        Controller._threadTimer = setInterval(Controller.runNextTick, 10);
    }
    static updateUIForNewSecond(remainingTime, bgColor) {
        BellPlayer_1.BellPlayer.playBelAtTime(remainingTime, "00:10", `${Configurations_1.Configurations.baseSoundURL}2166__suburban-grilla__bowl-struck.wav`);
        BellPlayer_1.BellPlayer.playBelAtTime(remainingTime, "00:00", `${Configurations_1.Configurations.baseSoundURL}32304__acclivity__shipsbell.wav`);
        GUIStuff_1.GUIStuff.drawFrame(remainingTime, bgColor);
    }
}
Controller.lastRemainingTime = Configurations_1.Configurations.getRemainingTimeCaption(0);
Controller.bodyBackgroundColor = Configurations_1.Configurations.backgroundColorNeutral;
Controller.currentStartTime = Date.now();
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map