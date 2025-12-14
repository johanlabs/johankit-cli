"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInVm = void 0;
// src/core/vm.ts
const vm2_1 = require("vm2");
function runInVm(code, sandbox = {}) {
    const vm = new vm2_1.NodeVM({
        console: 'inherit',
        sandbox,
        require: {
            external: true,
            builtin: ['*'],
        },
        wrapper: 'commonjs',
        timeout: 1000
    });
    const script = new vm2_1.VMScript(code);
    return vm.run(script);
}
exports.runInVm = runInVm;
