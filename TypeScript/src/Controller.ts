import { Configurations } from './Configurations';
import { TimeCalculations } from './TimeCalculations';
import { GUIStuff } from './GUIStuff';
import { BellPlayer } from './BellPlayer';
export class Controller {
    public static _threadTimer: NodeJS.Timer;
    private static lastRemainingTime: string = Configurations.getRemainingTimeCaption(0);
    private static bodyBackgroundColor: string = Configurations.backgroundColorNeutral;
    public static currentStartTime: number = Date.now();
    public static runNextTick(): void {
        let elapsedTime: number = TimeCalculations.calculateElaspedTime(Configurations.secondsInCycle, Controller.currentStartTime);
        if (elapsedTime == 0) {
            Controller.resetStartTime()
        }
        Controller.bodyBackgroundColor = GUIStuff.mightChangeBGColor(elapsedTime, Controller.bodyBackgroundColor);
        let remainingTime: string = Configurations.getRemainingTimeCaption(elapsedTime);
        if (TimeCalculations.isNewSecond(remainingTime, Controller.lastRemainingTime)) {
            Controller.updateUIForNewSecond(remainingTime, Controller.bodyBackgroundColor);
            Controller.lastRemainingTime = remainingTime;
        }
    }
    private static resetStartTime()
    {
        Controller.currentStartTime = Date.now();
    }
    public static quit(): void {
        document.body.innerHTML = "";
        clearInterval(Controller._threadTimer);
    }
    public static reset(): void {
        Controller.resetStartTime();
        Controller.bodyBackgroundColor = Configurations.backgroundColorPassed;
    }
    public static stop(): void {
        GUIStuff.resetGui(Configurations.getRemainingTimeCaption(0), Configurations.backgroundColorNeutral);
        clearInterval(Controller._threadTimer);
    }
    public static start(): void {
        GUIStuff.resetGui(Configurations.getRemainingTimeCaption(0), Configurations.backgroundColorNeutral);
        Controller.resetStartTime();
        Controller._threadTimer = setInterval(Controller.runNextTick, 10);
    }

    private static updateUIForNewSecond(remainingTime: string, bgColor: string): void {
        BellPlayer.playBelAtTime(remainingTime, "00:10", `${Configurations.baseSoundURL}2166__suburban-grilla__bowl-struck.wav`);
        BellPlayer.playBelAtTime(remainingTime, "00:00", `${Configurations.baseSoundURL}32304__acclivity__shipsbell.wav`);
        GUIStuff.drawFrame(remainingTime, bgColor);
    }
}
