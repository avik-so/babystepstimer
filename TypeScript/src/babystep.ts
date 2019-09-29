import {HTMLOutput} from './HTMLOutput';
import { Configurations } from './Configurations';
import { Controller } from './Controller';


setupControls()
document.body.innerHTML = HTMLOutput.CreateTimerHtml(Configurations.getRemainingTimeCaption(0), Configurations.backgroundColorNeutral);

function setupControls() {
    (<any>window).stop = Controller.stop;
    (<any>window).reset = Controller.reset;
    (<any>window).start = Controller.start;
    (<any>window).quit = Controller.quit;
}