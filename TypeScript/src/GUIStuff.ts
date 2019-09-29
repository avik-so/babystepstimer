import { HTMLOutput } from './HTMLOutput';
import { BellPlayer } from './BellPlayer';
import { Configurations } from './Configurations';
import { TimeCalculations } from './TimeCalculations';
export class GUIStuff {
    static resetGui(timeText: string, bgColor: string): void {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(timeText, bgColor);
    }
   
    public static drawFrame(remainingTime: string, bgColor: string) {
        document.body.innerHTML = HTMLOutput.CreateTimerHtml(remainingTime, bgColor);
    }
    public static mightChangeBGColor(elapsedTime: number, bgColor: string) {
        if (TimeCalculations.isElapsedTimeBetween5and6seconds(elapsedTime) && Configurations.isNotNeutralBG(bgColor)) {
            bgColor = Configurations.backgroundColorNeutral;
        }
        if (elapsedTime >= Configurations.secondsInCycle * 1000) {
            bgColor = Configurations.backgroundColorFailed;
        }
        return bgColor;
    }
}
