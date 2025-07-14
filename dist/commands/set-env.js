"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnv = setEnv;
const environment_1 = require("../utils/environment");
function setEnv(network) {
    if (!(0, environment_1.isValidNetwork)(network)) {
        console.log('Invalid network. Please use "stokenet" or "mainnet"');
        return;
    }
    (0, environment_1.setCurrentNetwork)(network);
    console.log(`Environment set to: ${network}`);
}
//# sourceMappingURL=set-env.js.map