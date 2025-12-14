"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const CONFIG_FILENAME = "johankit.yaml";
const DEFAULT_IGNORE = [
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "tmp",
    "temp",
];
function loadConfig(basePath) {
    const configPath = path_1.default.join(basePath, CONFIG_FILENAME);
    try {
        const content = (0, fs_1.readFileSync)(configPath, "utf8");
        const loadedConfig = (0, js_yaml_1.load)(content);
        return {
            ignore: [
                ...DEFAULT_IGNORE,
                ...(loadedConfig.ignore || []),
            ],
        };
    }
    catch (error) {
        if (error instanceof Error && error.code === "ENOENT") {
            return {
                ignore: DEFAULT_IGNORE,
            };
        }
        console.warn(`[johankit] Aviso: Falha ao carregar ${CONFIG_FILENAME}. Usando defaults.`, error);
        return {
            ignore: DEFAULT_IGNORE,
        };
    }
}
exports.loadConfig = loadConfig;
