"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatches = validatePatches;
// src/core/validation.ts
const schema_1 = require("./schema");
/**
 * @deprecated Use validatePatches from core/schema instead.
 */
function validatePatches(json) {
    return (0, schema_1.validatePatches)(json);
}
