"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatches = validatePatches;
function validatePatches(json) {
    if (!Array.isArray(json)) {
        throw new Error("Validation Error: Input is not a JSON array.");
    }
    return json.map((item, index) => {
        if (typeof item !== "object" || item === null) {
            throw new Error(`Validation Error: Item at index ${index} is not an object.`);
        }
        if (!["modify", "create", "delete"].includes(item.type)) {
            throw new Error(`Validation Error: Invalid type '${item.type}' at index ${index}.`);
        }
        if (typeof item.path !== "string" || !item.path.trim()) {
            throw new Error(`Validation Error: Invalid or missing path at index ${index}.`);
        }
        if (item.type !== "delete" && typeof item.content !== "string") {
            throw new Error(`Validation Error: Missing content for '${item.type}' at index ${index}.`);
        }
        return item;
    });
}
