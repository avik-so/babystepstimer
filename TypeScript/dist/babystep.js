"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTMLOutput_1 = require("./HTMLOutput");
const Configurations_1 = require("./Configurations");
const Controller_1 = require("./Controller");
setupControls();
document.body.innerHTML = HTMLOutput_1.HTMLOutput.CreateTimerHtml(Configurations_1.Configurations.getRemainingTimeCaption(0), Configurations_1.Configurations.backgroundColorNeutral);
function setupControls() {
    window.stop = Controller_1.Controller.stop;
    window.reset = Controller_1.Controller.reset;
    window.start = Controller_1.Controller.start;
    window.quit = Controller_1.Controller.quit;
}
//# sourceMappingURL=babystep.js.map