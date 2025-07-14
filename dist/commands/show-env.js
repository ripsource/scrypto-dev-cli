"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showEnv = showEnv;
const environment_1 = require("../utils/environment");
function showEnv() {
    const network = (0, environment_1.getCurrentNetwork)();
    if (network) {
        console.log(`Current environment: ${network}`);
    }
    else {
        console.log('No environment set. Use "scrypto-dev set-env <network>" to set one.');
    }
}
//# sourceMappingURL=show-env.js.map