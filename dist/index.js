require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const fs_1 = __nccwpck_require__(5747);
const path = __importStar(__nccwpck_require__(5622));
const globby_1 = __importDefault(__nccwpck_require__(3398));
const imagemin_1 = __importDefault(__nccwpck_require__(3266));
const imagemin_mozjpeg_1 = __importDefault(__nccwpck_require__(9170));
const imagemin_pngquant_1 = __importDefault(__nccwpck_require__(6619));
const sharp_1 = __importDefault(__nccwpck_require__(4185));
const image_size_1 = __nccwpck_require__(8250);
function compress(source, quality, size) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.statSync(path.resolve(source)).size < size)
            return source;
        const result = yield imagemin_1.default([source], {
            destination: 'build/images',
            plugins: [
                imagemin_mozjpeg_1.default({
                    progressive: false,
                    quality
                }),
                imagemin_pngquant_1.default({
                    quality: [0.0, quality / 100]
                })
            ]
        });
        return compress(result[0].destinationPath, quality - 1, size);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = core.getInput('files');
        const quality = parseInt(core.getInput('quality')) || undefined;
        const minSize = parseInt(core.getInput('min-size'));
        const maxDimension = parseInt(core.getInput('max-dimension'));
        let fileArray = files.split('⭐');
        core.info(`输入文件：${fileArray}`);
        fileArray = fileArray.map(it => path.resolve(it));
        const filePaths = yield globby_1.default(fileArray, { onlyFiles: true });
        const outputs = [];
        for (let file of filePaths) {
            const size = fs_1.statSync(file).size;
            const realQuality = quality ? quality : (minSize / size) * 100;
            const dimension = image_size_1.imageSize(file);
            core.info(`正在处理：${file}`);
            core.info(` 压缩前大小：${size / 1024} KB`);
            core.info(` 压缩前尺寸 ：${dimension.width} x ${dimension.height}`);
            if (maxDimension &&
                dimension.width &&
                dimension.height &&
                (dimension.height > maxDimension || dimension.width > maxDimension)) {
                const result = yield sharp_1.default(file)
                    .resize(maxDimension, maxDimension, {
                    fit: 'inside'
                })
                    .toFile((file += '.resized.jpg'));
                core.info(` 压缩后尺寸 ：${result.width} x ${result.height}`);
            }
            if (size > minSize) {
                core.info(`质量：${realQuality}`);
                file = yield compress(file, realQuality, minSize);
                core.info(` 压缩后大小：${fs_1.statSync(path.resolve(file)).size / 1024} KB`);
            }
            outputs.push(file);
        }
        core.setOutput('images', outputs.join('⭐'));
    });
}
run();


/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3803:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __nccwpck_require__(5747);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
function createFileSystemAdapter(fsMethods) {
    if (fsMethods === undefined) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),

/***/ 8838:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
const MAJOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
const SUPPORTED_MAJOR_VERSION = 10;
const SUPPORTED_MINOR_VERSION = 10;
const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
/**
 * IS `true` for Node.js 10.10 and greater.
 */
exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;


/***/ }),

/***/ 5667:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const async = __nccwpck_require__(4507);
const sync = __nccwpck_require__(9560);
const settings_1 = __nccwpck_require__(8662);
exports.Settings = settings_1.default;
function scandir(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.scandir = scandir;
function scandirSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.scandirSync = scandirSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),

/***/ 4507:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fsStat = __nccwpck_require__(109);
const rpl = __nccwpck_require__(5288);
const constants_1 = __nccwpck_require__(8838);
const utils = __nccwpck_require__(6297);
function read(directory, settings, callback) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings, callback);
    }
    return readdir(directory, settings, callback);
}
exports.read = read;
function readdirWithFileTypes(directory, settings, callback) {
    settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
            return callFailureCallback(callback, readdirError);
        }
        const entries = dirents.map((dirent) => ({
            dirent,
            name: dirent.name,
            path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
        }));
        if (!settings.followSymbolicLinks) {
            return callSuccessCallback(callback, entries);
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
            if (rplError !== null) {
                return callFailureCallback(callback, rplError);
            }
            callSuccessCallback(callback, rplEntries);
        });
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function makeRplTaskEntry(entry, settings) {
    return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
            return done(null, entry);
        }
        settings.fs.stat(entry.path, (statError, stats) => {
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return done(statError);
                }
                return done(null, entry);
            }
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            return done(null, entry);
        });
    };
}
function readdir(directory, settings, callback) {
    settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
            return callFailureCallback(callback, readdirError);
        }
        const filepaths = names.map((name) => `${directory}${settings.pathSegmentSeparator}${name}`);
        const tasks = filepaths.map((filepath) => {
            return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
        });
        rpl(tasks, (rplError, results) => {
            if (rplError !== null) {
                return callFailureCallback(callback, rplError);
            }
            const entries = [];
            names.forEach((name, index) => {
                const stats = results[index];
                const entry = {
                    name,
                    path: filepaths[index],
                    dirent: utils.fs.createDirentFromStats(name, stats)
                };
                if (settings.stats) {
                    entry.stats = stats;
                }
                entries.push(entry);
            });
            callSuccessCallback(callback, entries);
        });
    });
}
exports.readdir = readdir;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),

/***/ 9560:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fsStat = __nccwpck_require__(109);
const constants_1 = __nccwpck_require__(8838);
const utils = __nccwpck_require__(6297);
function read(directory, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
    }
    return readdir(directory, settings);
}
exports.read = read;
function readdirWithFileTypes(directory, settings) {
    const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
    return dirents.map((dirent) => {
        const entry = {
            dirent,
            name: dirent.name,
            path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
            try {
                const stats = settings.fs.statSync(entry.path);
                entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            }
            catch (error) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    throw error;
                }
            }
        }
        return entry;
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function readdir(directory, settings) {
    const names = settings.fs.readdirSync(directory);
    return names.map((name) => {
        const entryPath = `${directory}${settings.pathSegmentSeparator}${name}`;
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
            name,
            path: entryPath,
            dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
            entry.stats = stats;
        }
        return entry;
    });
}
exports.readdir = readdir;


/***/ }),

/***/ 8662:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __nccwpck_require__(5622);
const fsStat = __nccwpck_require__(109);
const fs = __nccwpck_require__(3803);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this.followSymbolicLinks,
            fs: this.fs,
            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),

/***/ 883:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),

/***/ 6297:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __nccwpck_require__(883);
exports.fs = fs;


/***/ }),

/***/ 2987:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __nccwpck_require__(5747);
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync
};
function createFileSystemAdapter(fsMethods) {
    if (fsMethods === undefined) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),

/***/ 109:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const async = __nccwpck_require__(4147);
const sync = __nccwpck_require__(4527);
const settings_1 = __nccwpck_require__(2410);
exports.Settings = settings_1.default;
function stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.stat = stat;
function statSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.statSync = statSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),

/***/ 4147:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError !== null) {
            return callFailureCallback(callback, lstatError);
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            return callSuccessCallback(callback, lstat);
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return callFailureCallback(callback, statError);
                }
                return callSuccessCallback(callback, lstat);
            }
            if (settings.markSymbolicLink) {
                stat.isSymbolicLink = () => true;
            }
            callSuccessCallback(callback, stat);
        });
    });
}
exports.read = read;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),

/***/ 4527:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function read(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
    }
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
        }
        return stat;
    }
    catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
            return lstat;
        }
        throw error;
    }
}
exports.read = read;


/***/ }),

/***/ 2410:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __nccwpck_require__(2987);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),

/***/ 6026:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const async_1 = __nccwpck_require__(7523);
const stream_1 = __nccwpck_require__(6737);
const sync_1 = __nccwpck_require__(3068);
const settings_1 = __nccwpck_require__(141);
exports.Settings = settings_1.default;
function walk(directory, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
    }
    new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
exports.walk = walk;
function walkSync(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1.default(directory, settings);
    return provider.read();
}
exports.walkSync = walkSync;
function walkStream(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1.default(directory, settings);
    return provider.read();
}
exports.walkStream = walkStream;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),

/***/ 7523:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const async_1 = __nccwpck_require__(5732);
class AsyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = new Set();
    }
    read(callback) {
        this._reader.onError((error) => {
            callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
            this._storage.add(entry);
        });
        this._reader.onEnd(() => {
            callSuccessCallback(callback, [...this._storage]);
        });
        this._reader.read();
    }
}
exports.default = AsyncProvider;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, entries) {
    callback(null, entries);
}


/***/ }),

/***/ 6737:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const stream_1 = __nccwpck_require__(2413);
const async_1 = __nccwpck_require__(5732);
class StreamProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
            objectMode: true,
            read: () => { },
            destroy: this._reader.destroy.bind(this._reader)
        });
    }
    read() {
        this._reader.onError((error) => {
            this._stream.emit('error', error);
        });
        this._reader.onEntry((entry) => {
            this._stream.push(entry);
        });
        this._reader.onEnd(() => {
            this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
    }
}
exports.default = StreamProvider;


/***/ }),

/***/ 3068:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const sync_1 = __nccwpck_require__(3595);
class SyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
    }
    read() {
        return this._reader.read();
    }
}
exports.default = SyncProvider;


/***/ }),

/***/ 5732:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const events_1 = __nccwpck_require__(8614);
const fsScandir = __nccwpck_require__(5667);
const fastq = __nccwpck_require__(7340);
const common = __nccwpck_require__(7988);
const reader_1 = __nccwpck_require__(8311);
class AsyncReader extends reader_1.default {
    constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
            if (!this._isFatalError) {
                this._emitter.emit('end');
            }
        };
    }
    read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
            this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
    }
    destroy() {
        if (this._isDestroyed) {
            throw new Error('The reader is already destroyed');
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
    }
    onEntry(callback) {
        this._emitter.on('entry', callback);
    }
    onError(callback) {
        this._emitter.once('error', callback);
    }
    onEnd(callback) {
        this._emitter.once('end', callback);
    }
    _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
            if (error !== null) {
                this._handleError(error);
            }
        });
    }
    _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
            if (error !== null) {
                return done(error, undefined);
            }
            for (const entry of entries) {
                this._handleEntry(entry, item.base);
            }
            done(null, undefined);
        });
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit('error', error);
    }
    _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
            return;
        }
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _emitEntry(entry) {
        this._emitter.emit('entry', entry);
    }
}
exports.default = AsyncReader;


/***/ }),

/***/ 7988:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function isFatalError(settings, error) {
    if (settings.errorFilter === null) {
        return true;
    }
    return !settings.errorFilter(error);
}
exports.isFatalError = isFatalError;
function isAppliedFilter(filter, value) {
    return filter === null || filter(value);
}
exports.isAppliedFilter = isAppliedFilter;
function replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[\\/]/).join(separator);
}
exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
function joinPathSegments(a, b, separator) {
    if (a === '') {
        return b;
    }
    return a + separator + b;
}
exports.joinPathSegments = joinPathSegments;


/***/ }),

/***/ 8311:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common = __nccwpck_require__(7988);
class Reader {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
}
exports.default = Reader;


/***/ }),

/***/ 3595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fsScandir = __nccwpck_require__(5667);
const common = __nccwpck_require__(7988);
const reader_1 = __nccwpck_require__(8311);
class SyncReader extends reader_1.default {
    constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = new Set();
        this._queue = new Set();
    }
    read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return [...this._storage];
    }
    _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
    }
    _handleQueue() {
        for (const item of this._queue.values()) {
            this._handleDirectory(item.directory, item.base);
        }
    }
    _handleDirectory(directory, base) {
        try {
            const entries = this._scandir(directory, this._settings.fsScandirSettings);
            for (const entry of entries) {
                this._handleEntry(entry, base);
            }
        }
        catch (error) {
            this._handleError(error);
        }
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        throw error;
    }
    _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _pushToStorage(entry) {
        this._storage.add(entry);
    }
}
exports.default = SyncReader;


/***/ }),

/***/ 141:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __nccwpck_require__(5622);
const fsScandir = __nccwpck_require__(5667);
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, undefined);
        this.concurrency = this._getValue(this._options.concurrency, Infinity);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.fsScandirSettings = new fsScandir.Settings({
            followSymbolicLinks: this._options.followSymbolicLinks,
            fs: this._options.fs,
            pathSegmentSeparator: this._options.pathSegmentSeparator,
            stats: this._options.stats,
            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),

/***/ 9600:
/***/ ((module) => {

"use strict";


module.exports = (...arguments_) => {
	return [...new Set([].concat(...arguments_))];
};


/***/ }),

/***/ 2504:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const fs = __nccwpck_require__(5747);
const path = __nccwpck_require__(5622);
const url = __nccwpck_require__(8835);
const pify = __nccwpck_require__(6574);
const importLazy = __nccwpck_require__(1239)(require);

const binCheck = importLazy('bin-check');
const binVersionCheck = importLazy('bin-version-check');
const download = importLazy('download');
const osFilterObj = importLazy('os-filter-obj');

const statAsync = pify(fs.stat);
const chmodAsync = pify(fs.chmod);

/**
 * Initialize a new `BinWrapper`
 *
 * @param {Object} options
 * @api public
 */
module.exports = class BinWrapper {
	constructor(options = {}) {
		this.options = options;

		if (this.options.strip <= 0) {
			this.options.strip = 0;
		} else if (!this.options.strip) {
			this.options.strip = 1;
		}
	}

	/**
	 * Get or set files to download
	 *
	 * @param {String} src
	 * @param {String} os
	 * @param {String} arch
	 * @api public
	 */
	src(src, os, arch) {
		if (arguments.length === 0) {
			return this._src;
		}

		this._src = this._src || [];
		this._src.push({
			url: src,
			os,
			arch
		});

		return this;
	}

	/**
	 * Get or set the destination
	 *
	 * @param {String} dest
	 * @api public
	 */
	dest(dest) {
		if (arguments.length === 0) {
			return this._dest;
		}

		this._dest = dest;
		return this;
	}

	/**
	 * Get or set the binary
	 *
	 * @param {String} bin
	 * @api public
	 */
	use(bin) {
		if (arguments.length === 0) {
			return this._use;
		}

		this._use = bin;
		return this;
	}

	/**
	 * Get or set a semver range to test the binary against
	 *
	 * @param {String} range
	 * @api public
	 */
	version(range) {
		if (arguments.length === 0) {
			return this._version;
		}

		this._version = range;
		return this;
	}

	/**
	 * Get path to the binary
	 *
	 * @api public
	 */
	path() {
		return path.join(this.dest(), this.use());
	}

	/**
	 * Run
	 *
	 * @param {Array} cmd
	 * @api public
	 */
	run(cmd = ['--version']) {
		return this.findExisting().then(() => {
			if (this.options.skipCheck) {
				return;
			}

			return this.runCheck(cmd);
		});
	}

	/**
	 * Run binary check
	 *
	 * @param {Array} cmd
	 * @api private
	 */
	runCheck(cmd) {
		return binCheck(this.path(), cmd).then(works => {
			if (!works) {
				throw new Error(`The \`${this.path()}\` binary doesn't seem to work correctly`);
			}

			if (this.version()) {
				return binVersionCheck(this.path(), this.version());
			}

			return Promise.resolve();
		});
	}

	/**
	 * Find existing files
	 *
	 * @api private
	 */
	findExisting() {
		return statAsync(this.path()).catch(error => {
			if (error && error.code === 'ENOENT') {
				return this.download();
			}

			return Promise.reject(error);
		});
	}

	/**
	 * Download files
	 *
	 * @api private
	 */
	download() {
		const files = osFilterObj(this.src() || []);
		const urls = [];

		if (files.length === 0) {
			return Promise.reject(new Error('No binary found matching your system. It\'s probably not supported.'));
		}

		files.forEach(file => urls.push(file.url));

		return Promise.all(urls.map(url => download(url, this.dest(), {
			extract: true,
			strip: this.options.strip
		}))).then(result => {
			const resultingFiles = flatten(result.map((item, index) => {
				if (Array.isArray(item)) {
					return item.map(file => file.path);
				}

				const parsedUrl = url.parse(files[index].url);
				const parsedPath = path.parse(parsedUrl.pathname);

				return parsedPath.base;
			}));

			return Promise.all(resultingFiles.map(fileName => {
				return chmodAsync(path.join(this.dest(), fileName), 0o755);
			}));
		});
	}
};

function flatten(arr) {
	return arr.reduce((acc, elem) => {
		if (Array.isArray(elem)) {
			acc.push(...elem);
		} else {
			acc.push(elem);
		}

		return acc;
	}, []);
}


/***/ }),

/***/ 6574:
/***/ ((module) => {

"use strict";


const processFn = (fn, options) => function (...args) {
	const P = options.promiseModule;

	return new P((resolve, reject) => {
		if (options.multiArgs) {
			args.push((...result) => {
				if (options.errorFirst) {
					if (result[0]) {
						reject(result);
					} else {
						result.shift();
						resolve(result);
					}
				} else {
					resolve(result);
				}
			});
		} else if (options.errorFirst) {
			args.push((error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		} else {
			args.push(resolve);
		}

		fn.apply(this, args);
	});
};

module.exports = (input, options) => {
	options = Object.assign({
		exclude: [/.+(Sync|Stream)$/],
		errorFirst: true,
		promiseModule: Promise
	}, options);

	const objType = typeof input;
	if (!(input !== null && (objType === 'object' || objType === 'function'))) {
		throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? 'null' : objType}\``);
	}

	const filter = key => {
		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
		return options.include ? options.include.some(match) : !options.exclude.some(match);
	};

	let ret;
	if (objType === 'function') {
		ret = function (...args) {
			return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
		};
	} else {
		ret = Object.create(Object.getPrototypeOf(input));
	}

	for (const key in input) { // eslint-disable-line guard-for-in
		const property = input[key];
		ret[key] = typeof property === 'function' && filter(key) ? processFn(property, options) : property;
	}

	return ret;
};


/***/ }),

/***/ 7391:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
var cssKeywords = __nccwpck_require__(8510);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var rdif;
	var gdif;
	var bdif;
	var h;
	var s;

	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var v = Math.max(r, g, b);
	var diff = v - Math.min(r, g, b);
	var diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 6931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var conversions = __nccwpck_require__(7391);
var route = __nccwpck_require__(880);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 880:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var conversions = __nccwpck_require__(7391);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	var graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 8510:
/***/ ((module) => {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 1069:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
var colorNames = __nccwpck_require__(8510);
var swizzle = __nccwpck_require__(8679);

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = (parseFloat(match[1]) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ }),

/***/ 7177:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var colorString = __nccwpck_require__(1069);
var convert = __nccwpck_require__(6931);

var _slice = [].slice;

var skippedModels = [
	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// gray conflicts with some method names, and has its own method defined.
	'gray',

	// shouldn't really be in color-convert either...
	'hex'
];

var hashedModelKeys = {};
Object.keys(convert).forEach(function (model) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
});

var limiters = {};

function Color(obj, model) {
	if (!(this instanceof Color)) {
		return new Color(obj, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	var i;
	var channels;

	if (obj == null) { // eslint-disable-line no-eq-null,eqeqeq
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (obj instanceof Color) {
		this.model = obj.model;
		this.color = obj.color.slice();
		this.valpha = obj.valpha;
	} else if (typeof obj === 'string') {
		var result = colorString.get(obj);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + obj);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (obj.length) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		var newArr = _slice.call(obj, 0, channels);
		this.color = zeroArray(newArr, channels);
		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
	} else if (typeof obj === 'number') {
		// this is always RGB - can be converted later on.
		obj &= 0xFFFFFF;
		this.model = 'rgb';
		this.color = [
			(obj >> 16) & 0xFF,
			(obj >> 8) & 0xFF,
			obj & 0xFF
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		var keys = Object.keys(obj);
		if ('alpha' in obj) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
		}

		var hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
		}

		this.model = hashedModelKeys[hashedKeys];

		var labels = convert[this.model].labels;
		var color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(obj[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			var limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString: function () {
		return this.string();
	},

	toJSON: function () {
		return this[this.model]();
	},

	string: function (places) {
		var self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString: function (places) {
		var self = this.rgb().round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array: function () {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object: function () {
		var result = {};
		var channels = convert[this.model].channels;
		var labels = convert[this.model].labels;

		for (var i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray: function () {
		var rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject: function () {
		var rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round: function (places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha: function (val) {
		if (arguments.length) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
		}

		return this.valpha;
	},

	// rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return convert[this.model].keyword(this.color);
	},

	hex: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	rgbNumber: function () {
		var rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.rgb().color;

		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.rgb().color;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	isLight: function () {
		return !this.isDark();
	},

	negate: function () {
		var rgb = this.rgb();
		for (var i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}
		return rgb;
	},

	lighten: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten: function (ratio) {
		var hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken: function (ratio) {
		var hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale: function () {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var rgb = this.rgb().color;
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(val, val, val);
	},

	fade: function (ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer: function (ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate: function (degrees) {
		var hsl = this.hsl();
		var hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix: function (mixinColor, weight) {
		// ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}
		var color1 = mixinColor.rgb();
		var color2 = this.rgb();
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return Color.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue(),
				color1.alpha() * p + color2.alpha() * (1 - p));
	}
};

// model conversion methods and static constructors
Object.keys(convert).forEach(function (model) {
	if (skippedModels.indexOf(model) !== -1) {
		return;
	}

	var channels = convert[model].channels;

	// conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length) {
			return new Color(arguments, model);
		}

		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}
		return new Color(color, model);
	};
});

function roundTo(num, places) {
	return Number(num.toFixed(places));
}

function roundToPlace(places) {
	return function (num) {
		return roundTo(num, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	model.forEach(function (m) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	});

	model = model[0];

	return function (val) {
		var result;

		if (arguments.length) {
			if (modifier) {
				val = modifier(val);
			}

			result = this[model]();
			result.color[channel] = val;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(val) {
	return Array.isArray(val) ? val : [val];
}

function zeroArray(arr, length) {
	for (var i = 0; i < length; i++) {
		if (typeof arr[i] !== 'number') {
			arr[i] = 0;
		}
	}

	return arr;
}

module.exports = Color;


/***/ }),

/***/ 2746:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const cp = __nccwpck_require__(3129);
const parse = __nccwpck_require__(6855);
const enoent = __nccwpck_require__(4101);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 4101:
/***/ ((module) => {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 6855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const resolveCommand = __nccwpck_require__(7274);
const escape = __nccwpck_require__(4274);
const readShebang = __nccwpck_require__(1252);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 4274:
/***/ ((module) => {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 1252:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(5747);
const shebangCommand = __nccwpck_require__(7032);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 7274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const which = __nccwpck_require__(4207);
const getPathKey = __nccwpck_require__(539);

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: env[getPathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 4889:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var platform = __nccwpck_require__(2087).platform();
var spawnSync = __nccwpck_require__(3129).spawnSync;
var readdirSync = __nccwpck_require__(5747).readdirSync;

var GLIBC = 'glibc';
var MUSL = 'musl';

var spawnOptions = {
  encoding: 'utf8',
  env: process.env
};

if (!spawnSync) {
  spawnSync = function () {
    return { status: 126, stdout: '', stderr: '' };
  };
}

function contains (needle) {
  return function (haystack) {
    return haystack.indexOf(needle) !== -1;
  };
}

function versionFromMuslLdd (out) {
  return out.split(/[\r\n]+/)[1].trim().split(/\s/)[1];
}

function safeReaddirSync (path) {
  try {
    return readdirSync(path);
  } catch (e) {}
  return [];
}

var family = '';
var version = '';
var method = '';

if (platform === 'linux') {
  // Try getconf
  var glibc = spawnSync('getconf', ['GNU_LIBC_VERSION'], spawnOptions);
  if (glibc.status === 0) {
    family = GLIBC;
    version = glibc.stdout.trim().split(' ')[1];
    method = 'getconf';
  } else {
    // Try ldd
    var ldd = spawnSync('ldd', ['--version'], spawnOptions);
    if (ldd.status === 0 && ldd.stdout.indexOf(MUSL) !== -1) {
      family = MUSL;
      version = versionFromMuslLdd(ldd.stdout);
      method = 'ldd';
    } else if (ldd.status === 1 && ldd.stderr.indexOf(MUSL) !== -1) {
      family = MUSL;
      version = versionFromMuslLdd(ldd.stderr);
      method = 'ldd';
    } else {
      // Try filesystem (family only)
      var lib = safeReaddirSync('/lib');
      if (lib.some(contains('-linux-gnu'))) {
        family = GLIBC;
        method = 'filesystem';
      } else if (lib.some(contains('libc.musl-'))) {
        family = MUSL;
        method = 'filesystem';
      } else if (lib.some(contains('ld-musl-'))) {
        family = MUSL;
        method = 'filesystem';
      } else {
        var usrSbin = safeReaddirSync('/usr/sbin');
        if (usrSbin.some(contains('glibc'))) {
          family = GLIBC;
          method = 'filesystem';
        }
      }
    }
  }
}

var isNonGlibcLinux = (family !== '' && family !== GLIBC);

module.exports = {
  GLIBC: GLIBC,
  MUSL: MUSL,
  family: family,
  version: version,
  method: method,
  isNonGlibcLinux: isNonGlibcLinux
};


/***/ }),

/***/ 2738:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const pathType = __nccwpck_require__(3936);

const getExtensions = extensions => extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];

const getPath = (filepath, cwd) => {
	const pth = filepath[0] === '!' ? filepath.slice(1) : filepath;
	return path.isAbsolute(pth) ? pth : path.join(cwd, pth);
};

const addExtensions = (file, extensions) => {
	if (path.extname(file)) {
		return `**/${file}`;
	}

	return `**/${file}.${getExtensions(extensions)}`;
};

const getGlob = (directory, options) => {
	if (options.files && !Array.isArray(options.files)) {
		throw new TypeError(`Expected \`files\` to be of type \`Array\` but received type \`${typeof options.files}\``);
	}

	if (options.extensions && !Array.isArray(options.extensions)) {
		throw new TypeError(`Expected \`extensions\` to be of type \`Array\` but received type \`${typeof options.extensions}\``);
	}

	if (options.files && options.extensions) {
		return options.files.map(x => path.posix.join(directory, addExtensions(x, options.extensions)));
	}

	if (options.files) {
		return options.files.map(x => path.posix.join(directory, `**/${x}`));
	}

	if (options.extensions) {
		return [path.posix.join(directory, `**/*.${getExtensions(options.extensions)}`)];
	}

	return [path.posix.join(directory, '**')];
};

module.exports = async (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = await Promise.all([].concat(input).map(async x => {
		const isDirectory = await pathType.isDirectory(getPath(x, options.cwd));
		return isDirectory ? getGlob(x, options) : x;
	}));

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};

module.exports.sync = (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = [].concat(input).map(x => pathType.isDirectorySync(getPath(x, options.cwd)) ? getGlob(x, options) : x);

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};


/***/ }),

/***/ 3936:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

const {promisify} = __nccwpck_require__(1669);
const fs = __nccwpck_require__(5747);

async function isType(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		const stats = await promisify(fs[fsStatType])(filePath);
		return stats[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

function isTypeSync(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		return fs[fsStatType](filePath)[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

exports.isFile = isType.bind(null, 'stat', 'isFile');
exports.isDirectory = isType.bind(null, 'stat', 'isDirectory');
exports.isSymlink = isType.bind(null, 'lstat', 'isSymbolicLink');
exports.isFileSync = isTypeSync.bind(null, 'statSync', 'isFile');
exports.isDirectorySync = isTypeSync.bind(null, 'statSync', 'isDirectory');
exports.isSymlinkSync = isTypeSync.bind(null, 'lstatSync', 'isSymbolicLink');


/***/ }),

/***/ 1205:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var once = __nccwpck_require__(1223);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 5447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const childProcess = __nccwpck_require__(3129);
const crossSpawn = __nccwpck_require__(2746);
const stripFinalNewline = __nccwpck_require__(8174);
const npmRunPath = __nccwpck_require__(502);
const onetime = __nccwpck_require__(9082);
const makeError = __nccwpck_require__(2187);
const normalizeStdio = __nccwpck_require__(166);
const {spawnedKill, spawnedCancel, setupTimeout, setExitHandler} = __nccwpck_require__(9819);
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = __nccwpck_require__(2592);
const {mergePromise, getSpawnedPromise} = __nccwpck_require__(7814);
const {joinCommand, parseCommand} = __nccwpck_require__(8286);

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process.platform === 'win32' && path.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

module.exports = execa;

module.exports.sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

module.exports.command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

module.exports.commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

module.exports.node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false
		}
	);
};


/***/ }),

/***/ 8286:
/***/ ((module) => {

"use strict";

const SPACES_REGEXP = / +/g;

const joinCommand = (file, args = []) => {
	if (!Array.isArray(args)) {
		return file;
	}

	return [file, ...args].join(' ');
};

// Handle `execa.command()`
const parseCommand = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

module.exports = {
	joinCommand,
	parseCommand
};


/***/ }),

/***/ 2187:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {signalsByName} = __nccwpck_require__(2779);

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

module.exports = makeError;


/***/ }),

/***/ 9819:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const onExit = __nccwpck_require__(4931);

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os.constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	if (!Number.isFinite(timeout) || timeout < 0) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

module.exports = {
	spawnedKill,
	spawnedCancel,
	setupTimeout,
	setExitHandler
};


/***/ }),

/***/ 7814:
/***/ ((module) => {

"use strict";


const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

module.exports = {
	mergePromise,
	getSpawnedPromise
};



/***/ }),

/***/ 166:
/***/ ((module) => {

"use strict";

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => aliases.some(alias => opts[alias] !== undefined);

const normalizeStdio = opts => {
	if (!opts) {
		return;
	}

	const {stdio} = opts;

	if (stdio === undefined) {
		return aliases.map(alias => opts[alias]);
	}

	if (hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

module.exports = normalizeStdio;

// `ipc` is pushed unless it is already present
module.exports.node = opts => {
	const stdio = normalizeStdio(opts);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};


/***/ }),

/***/ 2592:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const isStream = __nccwpck_require__(1554);
const getStream = __nccwpck_require__(1766);
const mergeStream = __nccwpck_require__(2621);

// `input` option
const handleInput = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// TODO: Remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream(stream, {encoding, maxBuffer});
	}

	return getStream.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync = ({input}) => {
	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

module.exports = {
	handleInput,
	makeAllStream,
	getSpawnedResult,
	validateInputSync
};



/***/ }),

/***/ 5582:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const stringify = __nccwpck_require__(4810);
const compile = __nccwpck_require__(7123);
const expand = __nccwpck_require__(6944);
const parse = __nccwpck_require__(9889);

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

module.exports = braces;


/***/ }),

/***/ 7123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fill = __nccwpck_require__(791);
const utils = __nccwpck_require__(7691);

const compile = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      let range = fill(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

module.exports = compile;


/***/ }),

/***/ 5412:
/***/ ((module) => {

"use strict";


module.exports = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};


/***/ }),

/***/ 6944:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fill = __nccwpck_require__(791);
const stringify = __nccwpck_require__(4810);
const utils = __nccwpck_require__(7691);

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;


/***/ }),

/***/ 9889:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const stringify = __nccwpck_require__(4810);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __nccwpck_require__(5412);

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;
  let memo = {};

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;


/***/ }),

/***/ 4810:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const utils = __nccwpck_require__(7691);

module.exports = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};



/***/ }),

/***/ 7691:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};


/***/ }),

/***/ 791:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __nccwpck_require__(1669);
const toRegexRange = __nccwpck_require__(6867);

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;


/***/ }),

/***/ 2840:
/***/ ((module) => {

"use strict";
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};


/***/ }),

/***/ 3913:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const util = __nccwpck_require__(1669);
const braces = __nccwpck_require__(5582);
const picomatch = __nccwpck_require__(8569);
const utils = __nccwpck_require__(479);
const isEmptyString = val => typeof val === 'string' && (val === '' || val === './');

/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} list List of strings to match.
 * @param {String|Array<string>} patterns One or more glob patterns to use for matching.
 * @param {Object} options See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

const micromatch = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = state => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (let item of list) {
      let matched = isMatch(item, true);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter(item => !omit.has(item));

  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(', ')}"`);
    }

    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
    }
  }

  return matches;
};

/**
 * Backwards compatibility
 */

micromatch.match = micromatch;

/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = (pattern, options) => picomatch(pattern, options);

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Backwards compatibility
 */

micromatch.any = micromatch.isMatch;

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = new Set();
  let items = [];

  let onResult = state => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };

  let matches = micromatch(list, patterns, { ...options, onResult });

  for (let item of items) {
    if (!matches.includes(item)) {
      result.add(item);
    }
  }
  return [...result];
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = (str, pattern, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  if (Array.isArray(pattern)) {
    return pattern.some(p => micromatch.contains(str, p, options));
  }

  if (typeof pattern === 'string') {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }

    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
      return true;
    }
  }

  return micromatch.isMatch(str, pattern, { ...options, contains: true });
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = (obj, patterns, options) => {
  if (!utils.isObject(obj)) {
    throw new TypeError('Expected the first argument to be an object');
  }
  let keys = micromatch(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};

/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.some = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (items.some(item => isMatch(item))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (!items.every(item => isMatch(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.all = (str, patterns, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  return [].concat(patterns).every(p => picomatch(p, options)(str));
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch.capture = (glob, input, options) => {
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);

  if (match) {
    return match.slice(1).map(v => v === void 0 ? '' : v);
  }
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = (...args) => picomatch.makeRe(...args);

/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

micromatch.scan = (...args) => picomatch.scan(...args);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */

micromatch.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces(String(pattern), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};

/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch.braces = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return braces(pattern, options);
};

/**
 * Expand braces
 */

micromatch.braceExpand = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  return micromatch.braces(pattern, { ...options, expand: true });
};

/**
 * Expose micromatch
 */

module.exports = micromatch;


/***/ }),

/***/ 6867:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __nccwpck_require__(2840);

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit, options);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

module.exports = toRegexRange;


/***/ }),

/***/ 3664:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const taskManager = __nccwpck_require__(2708);
const async_1 = __nccwpck_require__(5679);
const stream_1 = __nccwpck_require__(4630);
const sync_1 = __nccwpck_require__(2405);
const settings_1 = __nccwpck_require__(952);
const utils = __nccwpck_require__(5444);
async function FastGlob(source, options) {
    assertPatternsInput(source);
    const works = getWorks(source, async_1.default, options);
    const result = await Promise.all(works);
    return utils.array.flatten(result);
}
// https://github.com/typescript-eslint/typescript-eslint/issues/60
// eslint-disable-next-line no-redeclare
(function (FastGlob) {
    function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
    }
    FastGlob.sync = sync;
    function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        /**
         * The stream returned by the provider cannot work with an asynchronous iterator.
         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
         * This affects performance (+25%). I don't see best solution right now.
         */
        return utils.stream.merge(works);
    }
    FastGlob.stream = stream;
    function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
    }
    FastGlob.generateTasks = generateTasks;
    function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
    }
    FastGlob.isDynamicPattern = isDynamicPattern;
    function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
    }
    FastGlob.escapePath = escapePath;
})(FastGlob || (FastGlob = {}));
function getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    const tasks = taskManager.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
}
function assertPatternsInput(input) {
    const source = [].concat(input);
    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
    if (!isValidSource) {
        throw new TypeError('Patterns must be a string (non empty) or an array of strings');
    }
}
module.exports = FastGlob;


/***/ }),

/***/ 2708:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
const utils = __nccwpck_require__(5444);
function generate(patterns, settings) {
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
    const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
    const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
    return staticTasks.concat(dynamicTasks);
}
exports.generate = generate;
function convertPatternsToTasks(positive, negative, dynamic) {
    const positivePatternsGroup = groupPatternsByBaseDirectory(positive);
    // When we have a global group – there is no reason to divide the patterns into independent tasks.
    // In this case, the global task covers the rest.
    if ('.' in positivePatternsGroup) {
        const task = convertPatternGroupToTask('.', positive, negative, dynamic);
        return [task];
    }
    return convertPatternGroupsToTasks(positivePatternsGroup, negative, dynamic);
}
exports.convertPatternsToTasks = convertPatternsToTasks;
function getPositivePatterns(patterns) {
    return utils.pattern.getPositivePatterns(patterns);
}
exports.getPositivePatterns = getPositivePatterns;
function getNegativePatternsAsPositive(patterns, ignore) {
    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map(utils.pattern.convertToPositivePattern);
    return positive;
}
exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
function groupPatternsByBaseDirectory(patterns) {
    const group = {};
    return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
            collection[base].push(pattern);
        }
        else {
            collection[base] = [pattern];
        }
        return collection;
    }, group);
}
exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
function convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
}
exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
function convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
    };
}
exports.convertPatternGroupToTask = convertPatternGroupToTask;


/***/ }),

/***/ 5679:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const stream_1 = __nccwpck_require__(2083);
const provider_1 = __nccwpck_require__(257);
class ProviderAsync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = [];
        return new Promise((resolve, reject) => {
            const stream = this.api(root, task, options);
            stream.once('error', reject);
            stream.on('data', (entry) => entries.push(options.transform(entry)));
            stream.once('end', () => resolve(entries));
        });
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderAsync;


/***/ }),

/***/ 6983:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils = __nccwpck_require__(5444);
const partial_1 = __nccwpck_require__(5295);
class DeepFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
    }
    _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
    }
    _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
            return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
            return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
            return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
    }
    _isSkippedByDeep(basePath, entryPath) {
        /**
         * Avoid unnecessary depth calculations when it doesn't matter.
         */
        if (this._settings.deep === Infinity) {
            return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
    }
    _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split('/').length;
        if (basePath === '') {
            return entryPathDepth;
        }
        const basePathDepth = basePath.split('/').length;
        return entryPathDepth - basePathDepth;
    }
    _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
    }
    _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
    }
    _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
    }
}
exports.default = DeepFilter;


/***/ }),

/***/ 1343:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils = __nccwpck_require__(5444);
class EntryFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = new Map();
    }
    getFilter(positive, negative) {
        const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils.pattern.convertPatternsToRe(negative, this._micromatchOptions);
        return (entry) => this._filter(entry, positiveRe, negativeRe);
    }
    _filter(entry, positiveRe, negativeRe) {
        if (this._settings.unique && this._isDuplicateEntry(entry)) {
            return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
            return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(entry.path, negativeRe)) {
            return false;
        }
        const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
        const isMatched = this._isMatchToPatterns(filepath, positiveRe) && !this._isMatchToPatterns(entry.path, negativeRe);
        if (this._settings.unique && isMatched) {
            this._createIndexRecord(entry);
        }
        return isMatched;
    }
    _isDuplicateEntry(entry) {
        return this.index.has(entry.path);
    }
    _createIndexRecord(entry) {
        this.index.set(entry.path, undefined);
    }
    _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
    }
    _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
        if (!this._settings.absolute) {
            return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, entryPath);
        return utils.pattern.matchAny(fullpath, patternsRe);
    }
    _isMatchToPatterns(entryPath, patternsRe) {
        const filepath = utils.path.removeLeadingDotSegment(entryPath);
        return utils.pattern.matchAny(filepath, patternsRe);
    }
}
exports.default = EntryFilter;


/***/ }),

/***/ 6654:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils = __nccwpck_require__(5444);
class ErrorFilter {
    constructor(_settings) {
        this._settings = _settings;
    }
    getFilter() {
        return (error) => this._isNonFatalError(error);
    }
    _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
}
exports.default = ErrorFilter;


/***/ }),

/***/ 2576:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils = __nccwpck_require__(5444);
class Matcher {
    constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
    }
    _fillStorage() {
        /**
         * The original pattern may include `{,*,**,a/*}`, which will lead to problems with matching (unresolved level).
         * So, before expand patterns with brace expansion into separated patterns.
         */
        const patterns = utils.pattern.expandPatternsWithBraceExpansion(this._patterns);
        for (const pattern of patterns) {
            const segments = this._getPatternSegments(pattern);
            const sections = this._splitSegmentsIntoSections(segments);
            this._storage.push({
                complete: sections.length <= 1,
                pattern,
                segments,
                sections
            });
        }
    }
    _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
            const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
            if (!dynamic) {
                return {
                    dynamic: false,
                    pattern: part
                };
            }
            return {
                dynamic: true,
                pattern: part,
                patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
            };
        });
    }
    _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
    }
}
exports.default = Matcher;


/***/ }),

/***/ 5295:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const matcher_1 = __nccwpck_require__(2576);
class PartialMatcher extends matcher_1.default {
    match(filepath) {
        const parts = filepath.split('/');
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
            const section = pattern.sections[0];
            /**
             * In this case, the pattern has a globstar and we must read all directories unconditionally,
             * but only if the level has reached the end of the first group.
             *
             * fixtures/{a,b}/**
             *  ^ true/false  ^ always true
            */
            if (!pattern.complete && levels > section.length) {
                return true;
            }
            const match = parts.every((part, index) => {
                const segment = pattern.segments[index];
                if (segment.dynamic && segment.patternRe.test(part)) {
                    return true;
                }
                if (!segment.dynamic && segment.pattern === part) {
                    return true;
                }
                return false;
            });
            if (match) {
                return true;
            }
        }
        return false;
    }
}
exports.default = PartialMatcher;


/***/ }),

/***/ 257:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __nccwpck_require__(5622);
const deep_1 = __nccwpck_require__(6983);
const entry_1 = __nccwpck_require__(1343);
const error_1 = __nccwpck_require__(6654);
const entry_2 = __nccwpck_require__(4029);
class Provider {
    constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
    }
    _getRootDirectory(task) {
        return path.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task) {
        const basePath = task.base === '.' ? '' : task.base;
        return {
            basePath,
            pathSegmentSeparator: '/',
            concurrency: this._settings.concurrency,
            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            stats: this._settings.stats,
            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer()
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this._settings.dot,
            matchBase: this._settings.baseNameMatch,
            nobrace: !this._settings.braceExpansion,
            nocase: !this._settings.caseSensitiveMatch,
            noext: !this._settings.extglob,
            noglobstar: !this._settings.globstar,
            posix: true,
            strictSlashes: false
        };
    }
}
exports.default = Provider;


/***/ }),

/***/ 4630:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const stream_1 = __nccwpck_require__(2413);
const stream_2 = __nccwpck_require__(2083);
const provider_1 = __nccwpck_require__(257);
class ProviderStream extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => destination.emit('error', error))
            .on('data', (entry) => destination.emit('data', options.transform(entry)))
            .once('end', () => destination.emit('end'));
        destination
            .once('close', () => source.destroy());
        return destination;
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderStream;


/***/ }),

/***/ 2405:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const sync_1 = __nccwpck_require__(6234);
const provider_1 = __nccwpck_require__(257);
class ProviderSync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderSync;


/***/ }),

/***/ 4029:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils = __nccwpck_require__(5444);
class EntryTransformer {
    constructor(_settings) {
        this._settings = _settings;
    }
    getTransformer() {
        return (entry) => this._transform(entry);
    }
    _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
            filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
            filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
            filepath += '/';
        }
        if (!this._settings.objectMode) {
            return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
    }
}
exports.default = EntryTransformer;


/***/ }),

/***/ 8062:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __nccwpck_require__(5622);
const fsStat = __nccwpck_require__(109);
const utils = __nccwpck_require__(5444);
class Reader {
    constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
    }
    _getFullEntryPath(filepath) {
        return path.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
            entry.stats = stats;
        }
        return entry;
    }
    _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
}
exports.default = Reader;


/***/ }),

/***/ 2083:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const stream_1 = __nccwpck_require__(2413);
const fsStat = __nccwpck_require__(109);
const fsWalk = __nccwpck_require__(6026);
const reader_1 = __nccwpck_require__(8062);
class ReaderStream extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
    }
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
            return this._getEntry(filepaths[index], patterns[index], options)
                .then((entry) => {
                if (entry !== null && options.entryFilter(entry)) {
                    stream.push(entry);
                }
                if (index === filepaths.length - 1) {
                    stream.end();
                }
                done();
            })
                .catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
            stream.write(i);
        }
        return stream;
    }
    _getEntry(filepath, pattern, options) {
        return this._getStat(filepath)
            .then((stats) => this._makeEntry(stats, pattern))
            .catch((error) => {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        });
    }
    _getStat(filepath) {
        return new Promise((resolve, reject) => {
            this._stat(filepath, this._fsStatSettings, (error, stats) => {
                return error === null ? resolve(stats) : reject(error);
            });
        });
    }
}
exports.default = ReaderStream;


/***/ }),

/***/ 6234:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fsStat = __nccwpck_require__(109);
const fsWalk = __nccwpck_require__(6026);
const reader_1 = __nccwpck_require__(8062);
class ReaderSync extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
exports.default = ReaderSync;


/***/ }),

/***/ 952:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
const fs = __nccwpck_require__(5747);
const os = __nccwpck_require__(2087);
const CPU_COUNT = os.cpus().length;
exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    lstatSync: fs.lstatSync,
    stat: fs.stat,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
            this.onlyFiles = false;
        }
        if (this.stats) {
            this.objectMode = true;
        }
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
    _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
    }
}
exports.default = Settings;


/***/ }),

/***/ 5325:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitWhen = exports.flatten = void 0;
function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
}
exports.flatten = flatten;
function splitWhen(items, predicate) {
    const result = [[]];
    let groupIndex = 0;
    for (const item of items) {
        if (predicate(item)) {
            groupIndex++;
            result[groupIndex] = [];
        }
        else {
            result[groupIndex].push(item);
        }
    }
    return result;
}
exports.splitWhen = splitWhen;


/***/ }),

/***/ 1230:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEnoentCodeError = void 0;
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
exports.isEnoentCodeError = isEnoentCodeError;


/***/ }),

/***/ 7543:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDirentFromStats = void 0;
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),

/***/ 5444:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
const array = __nccwpck_require__(5325);
exports.array = array;
const errno = __nccwpck_require__(1230);
exports.errno = errno;
const fs = __nccwpck_require__(7543);
exports.fs = fs;
const path = __nccwpck_require__(3873);
exports.path = path;
const pattern = __nccwpck_require__(1221);
exports.pattern = pattern;
const stream = __nccwpck_require__(8382);
exports.stream = stream;
const string = __nccwpck_require__(2203);
exports.string = string;


/***/ }),

/***/ 3873:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeLeadingDotSegment = exports.escape = exports.makeAbsolute = exports.unixify = void 0;
const path = __nccwpck_require__(5622);
const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
/**
 * Designed to work only with simple paths: `dir\\file`.
 */
function unixify(filepath) {
    return filepath.replace(/\\/g, '/');
}
exports.unixify = unixify;
function makeAbsolute(cwd, filepath) {
    return path.resolve(cwd, filepath);
}
exports.makeAbsolute = makeAbsolute;
function escape(pattern) {
    return pattern.replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
}
exports.escape = escape;
function removeLeadingDotSegment(entry) {
    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (entry.charAt(0) === '.') {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === '/' || secondCharactery === '\\') {
            return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
    }
    return entry;
}
exports.removeLeadingDotSegment = removeLeadingDotSegment;


/***/ }),

/***/ 1221:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
const path = __nccwpck_require__(5622);
const globParent = __nccwpck_require__(4655);
const micromatch = __nccwpck_require__(3913);
const picomatch = __nccwpck_require__(8569);
const GLOBSTAR = '**';
const ESCAPE_SYMBOL = '\\';
const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[.*]/;
const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\(.*\|.*\)/;
const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\(.*\)/;
const BRACE_EXPANSIONS_SYMBOLS_RE = /{.*(?:,|\.\.).*}/;
function isStaticPattern(pattern, options = {}) {
    return !isDynamicPattern(pattern, options);
}
exports.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern, options = {}) {
    /**
     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
     * An empty string cannot be a dynamic pattern.
     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
     */
    if (pattern === '') {
        return false;
    }
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
    }
    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.braceExpansion !== false && BRACE_EXPANSIONS_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    return false;
}
exports.isDynamicPattern = isDynamicPattern;
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
exports.convertToPositivePattern = convertToPositivePattern;
function convertToNegativePattern(pattern) {
    return '!' + pattern;
}
exports.convertToNegativePattern = convertToNegativePattern;
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
exports.isNegativePattern = isNegativePattern;
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
exports.isPositivePattern = isPositivePattern;
function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
}
exports.getNegativePatterns = getNegativePatterns;
function getPositivePatterns(patterns) {
    return patterns.filter(isPositivePattern);
}
exports.getPositivePatterns = getPositivePatterns;
function getBaseDirectory(pattern) {
    return globParent(pattern, { flipBackslashes: false });
}
exports.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern) {
    return pattern.includes(GLOBSTAR);
}
exports.hasGlobStar = hasGlobStar;
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + GLOBSTAR);
}
exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
function isAffectDepthOfReadingPattern(pattern) {
    const basename = path.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
function expandPatternsWithBraceExpansion(patterns) {
    return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
    }, []);
}
exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
function expandBraceExpansion(pattern) {
    return micromatch.braces(pattern, {
        expand: true,
        nodupes: true
    });
}
exports.expandBraceExpansion = expandBraceExpansion;
function getPatternParts(pattern, options) {
    let { parts } = picomatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
    /**
     * The scan method returns an empty array in some cases.
     * See micromatch/picomatch#58 for more details.
     */
    if (parts.length === 0) {
        parts = [pattern];
    }
    /**
     * The scan method does not return an empty part for the pattern with a forward slash.
     * This is another part of micromatch/picomatch#58.
     */
    if (parts[0].startsWith('/')) {
        parts[0] = parts[0].slice(1);
        parts.unshift('');
    }
    return parts;
}
exports.getPatternParts = getPatternParts;
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
exports.makeRe = makeRe;
function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
}
exports.convertPatternsToRe = convertPatternsToRe;
function matchAny(entry, patternsRe) {
    return patternsRe.some((patternRe) => patternRe.test(entry));
}
exports.matchAny = matchAny;


/***/ }),

/***/ 8382:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.merge = void 0;
const merge2 = __nccwpck_require__(2578);
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (error) => mergedStream.emit('error', error));
    });
    mergedStream.once('close', () => propagateCloseEventToSources(streams));
    mergedStream.once('end', () => propagateCloseEventToSources(streams));
    return mergedStream;
}
exports.merge = merge;
function propagateCloseEventToSources(streams) {
    streams.forEach((stream) => stream.emit('close'));
}


/***/ }),

/***/ 2203:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEmpty = exports.isString = void 0;
function isString(input) {
    return typeof input === 'string';
}
exports.isString = isString;
function isEmpty(input) {
    return input === '';
}
exports.isEmpty = isEmpty;


/***/ }),

/***/ 7340:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var reusify = __nccwpck_require__(2113)

function fastqueue (context, worker, concurrency) {
  if (typeof context === 'function') {
    concurrency = worker
    worker = context
    context = null
  }

  var cache = reusify(Task)
  var queueHead = null
  var queueTail = null
  var _running = 0
  var errorHandler = null

  var self = {
    push: push,
    drain: noop,
    saturated: noop,
    pause: pause,
    paused: false,
    concurrency: concurrency,
    running: running,
    resume: resume,
    idle: idle,
    length: length,
    getQueue: getQueue,
    unshift: unshift,
    empty: noop,
    kill: kill,
    killAndDrain: killAndDrain,
    error: error
  }

  return self

  function running () {
    return _running
  }

  function pause () {
    self.paused = true
  }

  function length () {
    var current = queueHead
    var counter = 0

    while (current) {
      current = current.next
      counter++
    }

    return counter
  }

  function getQueue () {
    var current = queueHead
    var tasks = []

    while (current) {
      tasks.push(current.value)
      current = current.next
    }

    return tasks
  }

  function resume () {
    if (!self.paused) return
    self.paused = false
    for (var i = 0; i < self.concurrency; i++) {
      _running++
      release()
    }
  }

  function idle () {
    return _running === 0 && self.length() === 0
  }

  function push (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop
    current.errorHandler = errorHandler

    if (_running === self.concurrency || self.paused) {
      if (queueTail) {
        queueTail.next = current
        queueTail = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function unshift (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueHead) {
        current.next = queueHead
        queueHead = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function release (holder) {
    if (holder) {
      cache.release(holder)
    }
    var next = queueHead
    if (next) {
      if (!self.paused) {
        if (queueTail === queueHead) {
          queueTail = null
        }
        queueHead = next.next
        next.next = null
        worker.call(context, next.value, next.worked)
        if (queueTail === null) {
          self.empty()
        }
      } else {
        _running--
      }
    } else if (--_running === 0) {
      self.drain()
    }
  }

  function kill () {
    queueHead = null
    queueTail = null
    self.drain = noop
  }

  function killAndDrain () {
    queueHead = null
    queueTail = null
    self.drain()
    self.drain = noop
  }

  function error (handler) {
    errorHandler = handler
  }
}

function noop () {}

function Task () {
  this.value = null
  this.callback = noop
  this.next = null
  this.release = noop
  this.context = null
  this.errorHandler = null

  var self = this

  this.worked = function worked (err, result) {
    var callback = self.callback
    var errorHandler = self.errorHandler
    var val = self.value
    self.value = null
    self.callback = noop
    if (self.errorHandler) {
      errorHandler(err, val)
    }
    callback.call(self.context, err, result)
    self.release(self)
  }
}

module.exports = fastqueue


/***/ }),

/***/ 4126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const Token = __nccwpck_require__(4261);
const strtok3 = __nccwpck_require__(3026);
const {
	stringToBytes,
	tarHeaderChecksumMatches,
	uint32SyncSafeToken
} = __nccwpck_require__(4875);
const supported = __nccwpck_require__(7860);

const minimumBytes = 4100; // A fair amount of file-types are detectable within this range

async function fromStream(stream) {
	const tokenizer = await strtok3.fromStream(stream);
	try {
		return await fromTokenizer(tokenizer);
	} finally {
		await tokenizer.close();
	}
}

async function fromBuffer(input) {
	if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
		throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``);
	}

	const buffer = input instanceof Buffer ? input : Buffer.from(input);

	if (!(buffer && buffer.length > 1)) {
		return;
	}

	const tokenizer = strtok3.fromBuffer(buffer);
	return fromTokenizer(tokenizer);
}

function _check(buffer, headers, options) {
	options = {
		offset: 0,
		...options
	};

	for (const [index, header] of headers.entries()) {
		// If a bitmask is set
		if (options.mask) {
			// If header doesn't equal `buf` with bits masked off
			if (header !== (options.mask[index] & buffer[index + options.offset])) {
				return false;
			}
		} else if (header !== buffer[index + options.offset]) {
			return false;
		}
	}

	return true;
}

async function _checkSequence(sequence, tokenizer, ignoreBytes) {
	const buffer = Buffer.alloc(minimumBytes);
	await tokenizer.ignore(ignoreBytes);

	await tokenizer.peekBuffer(buffer, {mayBeLess: true});

	return buffer.includes(Buffer.from(sequence));
}

async function fromTokenizer(tokenizer) {
	try {
		return _fromTokenizer(tokenizer);
	} catch (error) {
		if (!(error instanceof strtok3.EndOfStreamError)) {
			throw error;
		}
	}
}

async function _fromTokenizer(tokenizer) {
	let buffer = Buffer.alloc(minimumBytes);
	const bytesRead = 12;
	const check = (header, options) => _check(buffer, header, options);
	const checkString = (header, options) => check(stringToBytes(header), options);
	const checkSequence = (sequence, ignoreBytes) => _checkSequence(sequence, tokenizer, ignoreBytes);

	// Keep reading until EOF if the file size is unknown.
	if (!tokenizer.fileInfo.size) {
		tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
	}

	await tokenizer.peekBuffer(buffer, {length: bytesRead, mayBeLess: true});

	// -- 2-byte signatures --

	if (check([0x42, 0x4D])) {
		return {
			ext: 'bmp',
			mime: 'image/bmp'
		};
	}

	if (check([0x0B, 0x77])) {
		return {
			ext: 'ac3',
			mime: 'audio/vnd.dolby.dd-raw'
		};
	}

	if (check([0x78, 0x01])) {
		return {
			ext: 'dmg',
			mime: 'application/x-apple-diskimage'
		};
	}

	if (check([0x4D, 0x5A])) {
		return {
			ext: 'exe',
			mime: 'application/x-msdownload'
		};
	}

	if (check([0x25, 0x21])) {
		await tokenizer.peekBuffer(buffer, {length: 24, mayBeLess: true});

		if (checkString('PS-Adobe-', {offset: 2}) &&
			checkString(' EPSF-', {offset: 14})) {
			return {
				ext: 'eps',
				mime: 'application/eps'
			};
		}

		return {
			ext: 'ps',
			mime: 'application/postscript'
		};
	}

	if (
		check([0x1F, 0xA0]) ||
		check([0x1F, 0x9D])
	) {
		return {
			ext: 'Z',
			mime: 'application/x-compress'
		};
	}

	// -- 3-byte signatures --

	if (check([0xFF, 0xD8, 0xFF])) {
		return {
			ext: 'jpg',
			mime: 'image/jpeg'
		};
	}

	if (check([0x49, 0x49, 0xBC])) {
		return {
			ext: 'jxr',
			mime: 'image/vnd.ms-photo'
		};
	}

	if (check([0x1F, 0x8B, 0x8])) {
		return {
			ext: 'gz',
			mime: 'application/gzip'
		};
	}

	if (check([0x42, 0x5A, 0x68])) {
		return {
			ext: 'bz2',
			mime: 'application/x-bzip2'
		};
	}

	if (checkString('ID3')) {
		await tokenizer.ignore(6); // Skip ID3 header until the header size
		const id3HeaderLen = await tokenizer.readToken(uint32SyncSafeToken);
		if (tokenizer.position + id3HeaderLen > tokenizer.fileInfo.size) {
			// Guess file type based on ID3 header for backward compatibility
			return {
				ext: 'mp3',
				mime: 'audio/mpeg'
			};
		}

		await tokenizer.ignore(id3HeaderLen);
		return fromTokenizer(tokenizer); // Skip ID3 header, recursion
	}

	// Musepack, SV7
	if (checkString('MP+')) {
		return {
			ext: 'mpc',
			mime: 'audio/x-musepack'
		};
	}

	if (
		(buffer[0] === 0x43 || buffer[0] === 0x46) &&
		check([0x57, 0x53], {offset: 1})
	) {
		return {
			ext: 'swf',
			mime: 'application/x-shockwave-flash'
		};
	}

	// -- 4-byte signatures --

	if (check([0x47, 0x49, 0x46])) {
		return {
			ext: 'gif',
			mime: 'image/gif'
		};
	}

	if (checkString('FLIF')) {
		return {
			ext: 'flif',
			mime: 'image/flif'
		};
	}

	if (checkString('8BPS')) {
		return {
			ext: 'psd',
			mime: 'image/vnd.adobe.photoshop'
		};
	}

	if (checkString('WEBP', {offset: 8})) {
		return {
			ext: 'webp',
			mime: 'image/webp'
		};
	}

	// Musepack, SV8
	if (checkString('MPCK')) {
		return {
			ext: 'mpc',
			mime: 'audio/x-musepack'
		};
	}

	if (checkString('FORM')) {
		return {
			ext: 'aif',
			mime: 'audio/aiff'
		};
	}

	if (checkString('icns', {offset: 0})) {
		return {
			ext: 'icns',
			mime: 'image/icns'
		};
	}

	// Zip-based file formats
	// Need to be before the `zip` check
	if (check([0x50, 0x4B, 0x3, 0x4])) { // Local file header signature
		try {
			while (tokenizer.position + 30 < tokenizer.fileInfo.size) {
				await tokenizer.readBuffer(buffer, {length: 30});

				// https://en.wikipedia.org/wiki/Zip_(file_format)#File_headers
				const zipHeader = {
					compressedSize: buffer.readUInt32LE(18),
					uncompressedSize: buffer.readUInt32LE(22),
					filenameLength: buffer.readUInt16LE(26),
					extraFieldLength: buffer.readUInt16LE(28)
				};

				zipHeader.filename = await tokenizer.readToken(new Token.StringType(zipHeader.filenameLength, 'utf-8'));
				await tokenizer.ignore(zipHeader.extraFieldLength);

				// Assumes signed `.xpi` from addons.mozilla.org
				if (zipHeader.filename === 'META-INF/mozilla.rsa') {
					return {
						ext: 'xpi',
						mime: 'application/x-xpinstall'
					};
				}

				if (zipHeader.filename.endsWith('.rels') || zipHeader.filename.endsWith('.xml')) {
					const type = zipHeader.filename.split('/')[0];
					switch (type) {
						case '_rels':
							break;
						case 'word':
							return {
								ext: 'docx',
								mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
							};
						case 'ppt':
							return {
								ext: 'pptx',
								mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
							};
						case 'xl':
							return {
								ext: 'xlsx',
								mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
							};
						default:
							break;
					}
				}

				if (zipHeader.filename.startsWith('xl/')) {
					return {
						ext: 'xlsx',
						mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					};
				}

				// The docx, xlsx and pptx file types extend the Office Open XML file format:
				// https://en.wikipedia.org/wiki/Office_Open_XML_file_formats
				// We look for:
				// - one entry named '[Content_Types].xml' or '_rels/.rels',
				// - one entry indicating specific type of file.
				// MS Office, OpenOffice and LibreOffice may put the parts in different order, so the check should not rely on it.
				if (zipHeader.filename === 'mimetype' && zipHeader.compressedSize === zipHeader.uncompressedSize) {
					const mimeType = await tokenizer.readToken(new Token.StringType(zipHeader.compressedSize, 'utf-8'));

					switch (mimeType) {
						case 'application/epub+zip':
							return {
								ext: 'epub',
								mime: 'application/epub+zip'
							};
						case 'application/vnd.oasis.opendocument.text':
							return {
								ext: 'odt',
								mime: 'application/vnd.oasis.opendocument.text'
							};
						case 'application/vnd.oasis.opendocument.spreadsheet':
							return {
								ext: 'ods',
								mime: 'application/vnd.oasis.opendocument.spreadsheet'
							};
						case 'application/vnd.oasis.opendocument.presentation':
							return {
								ext: 'odp',
								mime: 'application/vnd.oasis.opendocument.presentation'
							};
						default:
					}
				}

				// Try to find next header manually when current one is corrupted
				if (zipHeader.compressedSize === 0) {
					let nextHeaderIndex = -1;

					while (nextHeaderIndex < 0 && (tokenizer.position < tokenizer.fileInfo.size)) {
						await tokenizer.peekBuffer(buffer, {mayBeLess: true});

						nextHeaderIndex = buffer.indexOf('504B0304', 0, 'hex');
						// Move position to the next header if found, skip the whole buffer otherwise
						await tokenizer.ignore(nextHeaderIndex >= 0 ? nextHeaderIndex : buffer.length);
					}
				} else {
					await tokenizer.ignore(zipHeader.compressedSize);
				}
			}
		} catch (error) {
			if (!(error instanceof strtok3.EndOfStreamError)) {
				throw error;
			}
		}

		return {
			ext: 'zip',
			mime: 'application/zip'
		};
	}

	if (checkString('OggS')) {
		// This is an OGG container
		await tokenizer.ignore(28);
		const type = Buffer.alloc(8);
		await tokenizer.readBuffer(type);

		// Needs to be before `ogg` check
		if (_check(type, [0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64])) {
			return {
				ext: 'opus',
				mime: 'audio/opus'
			};
		}

		// If ' theora' in header.
		if (_check(type, [0x80, 0x74, 0x68, 0x65, 0x6F, 0x72, 0x61])) {
			return {
				ext: 'ogv',
				mime: 'video/ogg'
			};
		}

		// If '\x01video' in header.
		if (_check(type, [0x01, 0x76, 0x69, 0x64, 0x65, 0x6F, 0x00])) {
			return {
				ext: 'ogm',
				mime: 'video/ogg'
			};
		}

		// If ' FLAC' in header  https://xiph.org/flac/faq.html
		if (_check(type, [0x7F, 0x46, 0x4C, 0x41, 0x43])) {
			return {
				ext: 'oga',
				mime: 'audio/ogg'
			};
		}

		// 'Speex  ' in header https://en.wikipedia.org/wiki/Speex
		if (_check(type, [0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20])) {
			return {
				ext: 'spx',
				mime: 'audio/ogg'
			};
		}

		// If '\x01vorbis' in header
		if (_check(type, [0x01, 0x76, 0x6F, 0x72, 0x62, 0x69, 0x73])) {
			return {
				ext: 'ogg',
				mime: 'audio/ogg'
			};
		}

		// Default OGG container https://www.iana.org/assignments/media-types/application/ogg
		return {
			ext: 'ogx',
			mime: 'application/ogg'
		};
	}

	if (
		check([0x50, 0x4B]) &&
		(buffer[2] === 0x3 || buffer[2] === 0x5 || buffer[2] === 0x7) &&
		(buffer[3] === 0x4 || buffer[3] === 0x6 || buffer[3] === 0x8)
	) {
		return {
			ext: 'zip',
			mime: 'application/zip'
		};
	}

	//

	// File Type Box (https://en.wikipedia.org/wiki/ISO_base_media_file_format)
	// It's not required to be first, but it's recommended to be. Almost all ISO base media files start with `ftyp` box.
	// `ftyp` box must contain a brand major identifier, which must consist of ISO 8859-1 printable characters.
	// Here we check for 8859-1 printable characters (for simplicity, it's a mask which also catches one non-printable character).
	if (
		checkString('ftyp', {offset: 4}) &&
		(buffer[8] & 0x60) !== 0x00 // Brand major, first character ASCII?
	) {
		// They all can have MIME `video/mp4` except `application/mp4` special-case which is hard to detect.
		// For some cases, we're specific, everything else falls to `video/mp4` with `mp4` extension.
		const brandMajor = buffer.toString('binary', 8, 12).replace('\0', ' ').trim();
		switch (brandMajor) {
			case 'avif':
				return {ext: 'avif', mime: 'image/avif'};
			case 'mif1':
				return {ext: 'heic', mime: 'image/heif'};
			case 'msf1':
				return {ext: 'heic', mime: 'image/heif-sequence'};
			case 'heic':
			case 'heix':
				return {ext: 'heic', mime: 'image/heic'};
			case 'hevc':
			case 'hevx':
				return {ext: 'heic', mime: 'image/heic-sequence'};
			case 'qt':
				return {ext: 'mov', mime: 'video/quicktime'};
			case 'M4V':
			case 'M4VH':
			case 'M4VP':
				return {ext: 'm4v', mime: 'video/x-m4v'};
			case 'M4P':
				return {ext: 'm4p', mime: 'video/mp4'};
			case 'M4B':
				return {ext: 'm4b', mime: 'audio/mp4'};
			case 'M4A':
				return {ext: 'm4a', mime: 'audio/x-m4a'};
			case 'F4V':
				return {ext: 'f4v', mime: 'video/mp4'};
			case 'F4P':
				return {ext: 'f4p', mime: 'video/mp4'};
			case 'F4A':
				return {ext: 'f4a', mime: 'audio/mp4'};
			case 'F4B':
				return {ext: 'f4b', mime: 'audio/mp4'};
			case 'crx':
				return {ext: 'cr3', mime: 'image/x-canon-cr3'};
			default:
				if (brandMajor.startsWith('3g')) {
					if (brandMajor.startsWith('3g2')) {
						return {ext: '3g2', mime: 'video/3gpp2'};
					}

					return {ext: '3gp', mime: 'video/3gpp'};
				}

				return {ext: 'mp4', mime: 'video/mp4'};
		}
	}

	if (checkString('MThd')) {
		return {
			ext: 'mid',
			mime: 'audio/midi'
		};
	}

	if (
		checkString('wOFF') &&
		(
			check([0x00, 0x01, 0x00, 0x00], {offset: 4}) ||
			checkString('OTTO', {offset: 4})
		)
	) {
		return {
			ext: 'woff',
			mime: 'font/woff'
		};
	}

	if (
		checkString('wOF2') &&
		(
			check([0x00, 0x01, 0x00, 0x00], {offset: 4}) ||
			checkString('OTTO', {offset: 4})
		)
	) {
		return {
			ext: 'woff2',
			mime: 'font/woff2'
		};
	}

	if (check([0xD4, 0xC3, 0xB2, 0xA1]) || check([0xA1, 0xB2, 0xC3, 0xD4])) {
		return {
			ext: 'pcap',
			mime: 'application/vnd.tcpdump.pcap'
		};
	}

	// Sony DSD Stream File (DSF)
	if (checkString('DSD ')) {
		return {
			ext: 'dsf',
			mime: 'audio/x-dsf' // Non-standard
		};
	}

	if (checkString('LZIP')) {
		return {
			ext: 'lz',
			mime: 'application/x-lzip'
		};
	}

	if (checkString('fLaC')) {
		return {
			ext: 'flac',
			mime: 'audio/x-flac'
		};
	}

	if (check([0x42, 0x50, 0x47, 0xFB])) {
		return {
			ext: 'bpg',
			mime: 'image/bpg'
		};
	}

	if (checkString('wvpk')) {
		return {
			ext: 'wv',
			mime: 'audio/wavpack'
		};
	}

	if (checkString('%PDF')) {
		// Check if this is an Adobe Illustrator file
		const isAiFile = await checkSequence('Adobe Illustrator', 1350);
		if (isAiFile) {
			return {
				ext: 'ai',
				mime: 'application/postscript'
			};
		}

		// Assume this is just a normal PDF
		return {
			ext: 'pdf',
			mime: 'application/pdf'
		};
	}

	if (check([0x00, 0x61, 0x73, 0x6D])) {
		return {
			ext: 'wasm',
			mime: 'application/wasm'
		};
	}

	// TIFF, little-endian type
	if (check([0x49, 0x49, 0x2A, 0x0])) {
		if (checkString('CR', {offset: 8})) {
			return {
				ext: 'cr2',
				mime: 'image/x-canon-cr2'
			};
		}

		if (check([0x1C, 0x00, 0xFE, 0x00], {offset: 8}) || check([0x1F, 0x00, 0x0B, 0x00], {offset: 8})) {
			return {
				ext: 'nef',
				mime: 'image/x-nikon-nef'
			};
		}

		if (
			check([0x08, 0x00, 0x00, 0x00], {offset: 4}) &&
			(check([0x2D, 0x00, 0xFE, 0x00], {offset: 8}) ||
				check([0x27, 0x00, 0xFE, 0x00], {offset: 8}))
		) {
			return {
				ext: 'dng',
				mime: 'image/x-adobe-dng'
			};
		}

		buffer = Buffer.alloc(24);
		await tokenizer.peekBuffer(buffer);
		if (
			(check([0x10, 0xFB, 0x86, 0x01], {offset: 4}) || check([0x08, 0x00, 0x00, 0x00], {offset: 4})) &&
			// This pattern differentiates ARW from other TIFF-ish file types:
			check([0x00, 0xFE, 0x00, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x03, 0x01], {offset: 9})
		) {
			return {
				ext: 'arw',
				mime: 'image/x-sony-arw'
			};
		}

		return {
			ext: 'tif',
			mime: 'image/tiff'
		};
	}

	// TIFF, big-endian type
	if (check([0x4D, 0x4D, 0x0, 0x2A])) {
		return {
			ext: 'tif',
			mime: 'image/tiff'
		};
	}

	if (checkString('MAC ')) {
		return {
			ext: 'ape',
			mime: 'audio/ape'
		};
	}

	// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
	if (check([0x1A, 0x45, 0xDF, 0xA3])) { // Root element: EBML
		async function readField() {
			const msb = await tokenizer.peekNumber(Token.UINT8);
			let mask = 0x80;
			let ic = 0; // 0 = A, 1 = B, 2 = C, 3 = D

			while ((msb & mask) === 0) {
				++ic;
				mask >>= 1;
			}

			const id = Buffer.alloc(ic + 1);
			await tokenizer.readBuffer(id);
			return id;
		}

		async function readElement() {
			const id = await readField();
			const lenField = await readField();
			lenField[0] ^= 0x80 >> (lenField.length - 1);
			const nrLen = Math.min(6, lenField.length); // JavaScript can max read 6 bytes integer
			return {
				id: id.readUIntBE(0, id.length),
				len: lenField.readUIntBE(lenField.length - nrLen, nrLen)
			};
		}

		async function readChildren(level, children) {
			while (children > 0) {
				const e = await readElement();
				if (e.id === 0x4282) {
					return tokenizer.readToken(new Token.StringType(e.len, 'utf-8')); // Return DocType
				}

				await tokenizer.ignore(e.len); // ignore payload
				--children;
			}
		}

		const re = await readElement();
		const docType = await readChildren(1, re.len);

		switch (docType) {
			case 'webm':
				return {
					ext: 'webm',
					mime: 'video/webm'
				};

			case 'matroska':
				return {
					ext: 'mkv',
					mime: 'video/x-matroska'
				};

			default:
				return;
		}
	}

	// RIFF file format which might be AVI, WAV, QCP, etc
	if (check([0x52, 0x49, 0x46, 0x46])) {
		if (check([0x41, 0x56, 0x49], {offset: 8})) {
			return {
				ext: 'avi',
				mime: 'video/vnd.avi'
			};
		}

		if (check([0x57, 0x41, 0x56, 0x45], {offset: 8})) {
			return {
				ext: 'wav',
				mime: 'audio/vnd.wave'
			};
		}

		// QLCM, QCP file
		if (check([0x51, 0x4C, 0x43, 0x4D], {offset: 8})) {
			return {
				ext: 'qcp',
				mime: 'audio/qcelp'
			};
		}
	}

	if (checkString('SQLi')) {
		return {
			ext: 'sqlite',
			mime: 'application/x-sqlite3'
		};
	}

	if (check([0x4E, 0x45, 0x53, 0x1A])) {
		return {
			ext: 'nes',
			mime: 'application/x-nintendo-nes-rom'
		};
	}

	if (checkString('Cr24')) {
		return {
			ext: 'crx',
			mime: 'application/x-google-chrome-extension'
		};
	}

	if (
		checkString('MSCF') ||
		checkString('ISc(')
	) {
		return {
			ext: 'cab',
			mime: 'application/vnd.ms-cab-compressed'
		};
	}

	if (check([0xED, 0xAB, 0xEE, 0xDB])) {
		return {
			ext: 'rpm',
			mime: 'application/x-rpm'
		};
	}

	if (check([0xC5, 0xD0, 0xD3, 0xC6])) {
		return {
			ext: 'eps',
			mime: 'application/eps'
		};
	}

	// -- 5-byte signatures --

	if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
		return {
			ext: 'otf',
			mime: 'font/otf'
		};
	}

	if (checkString('#!AMR')) {
		return {
			ext: 'amr',
			mime: 'audio/amr'
		};
	}

	if (checkString('{\\rtf')) {
		return {
			ext: 'rtf',
			mime: 'application/rtf'
		};
	}

	if (check([0x46, 0x4C, 0x56, 0x01])) {
		return {
			ext: 'flv',
			mime: 'video/x-flv'
		};
	}

	if (checkString('IMPM')) {
		return {
			ext: 'it',
			mime: 'audio/x-it'
		};
	}

	if (
		checkString('-lh0-', {offset: 2}) ||
		checkString('-lh1-', {offset: 2}) ||
		checkString('-lh2-', {offset: 2}) ||
		checkString('-lh3-', {offset: 2}) ||
		checkString('-lh4-', {offset: 2}) ||
		checkString('-lh5-', {offset: 2}) ||
		checkString('-lh6-', {offset: 2}) ||
		checkString('-lh7-', {offset: 2}) ||
		checkString('-lzs-', {offset: 2}) ||
		checkString('-lz4-', {offset: 2}) ||
		checkString('-lz5-', {offset: 2}) ||
		checkString('-lhd-', {offset: 2})
	) {
		return {
			ext: 'lzh',
			mime: 'application/x-lzh-compressed'
		};
	}

	// MPEG program stream (PS or MPEG-PS)
	if (check([0x00, 0x00, 0x01, 0xBA])) {
		//  MPEG-PS, MPEG-1 Part 1
		if (check([0x21], {offset: 4, mask: [0xF1]})) {
			return {
				ext: 'mpg', // May also be .ps, .mpeg
				mime: 'video/MP1S'
			};
		}

		// MPEG-PS, MPEG-2 Part 1
		if (check([0x44], {offset: 4, mask: [0xC4]})) {
			return {
				ext: 'mpg', // May also be .mpg, .m2p, .vob or .sub
				mime: 'video/MP2P'
			};
		}
	}

	// -- 6-byte signatures --

	if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
		return {
			ext: 'xz',
			mime: 'application/x-xz'
		};
	}

	if (checkString('<?xml ')) {
		return {
			ext: 'xml',
			mime: 'application/xml'
		};
	}

	if (checkString('BEGIN:')) {
		return {
			ext: 'ics',
			mime: 'text/calendar'
		};
	}

	if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
		return {
			ext: '7z',
			mime: 'application/x-7z-compressed'
		};
	}

	if (
		check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) &&
		(buffer[6] === 0x0 || buffer[6] === 0x1)
	) {
		return {
			ext: 'rar',
			mime: 'application/x-rar-compressed'
		};
	}

	// -- 7-byte signatures --

	if (checkString('BLENDER')) {
		return {
			ext: 'blend',
			mime: 'application/x-blender'
		};
	}

	if (checkString('!<arch>')) {
		await tokenizer.ignore(8);
		const str = await tokenizer.readToken(new Token.StringType(13, 'ascii'));
		if (str === 'debian-binary') {
			return {
				ext: 'deb',
				mime: 'application/x-deb'
			};
		}

		return {
			ext: 'ar',
			mime: 'application/x-unix-archive'
		};
	}

	// -- 8-byte signatures --

	if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
		// APNG format (https://wiki.mozilla.org/APNG_Specification)
		// 1. Find the first IDAT (image data) chunk (49 44 41 54)
		// 2. Check if there is an "acTL" chunk before the IDAT one (61 63 54 4C)

		// Offset calculated as follows:
		// - 8 bytes: PNG signature
		// - 4 (length) + 4 (chunk type) + 13 (chunk data) + 4 (CRC): IHDR chunk

		await tokenizer.ignore(8); // ignore PNG signature

		async function readChunkHeader() {
			return {
				length: await tokenizer.readToken(Token.INT32_BE),
				type: await tokenizer.readToken(new Token.StringType(4, 'binary'))
			};
		}

		do {
			const chunk = await readChunkHeader();
			switch (chunk.type) {
				case 'IDAT':
					return {
						ext: 'png',
						mime: 'image/png'
					};
				case 'acTL':
					return {
						ext: 'apng',
						mime: 'image/apng'
					};
				default:
					await tokenizer.ignore(chunk.length + 4); // Ignore chunk-data + CRC
			}
		} while (tokenizer.position < tokenizer.fileInfo.size);

		return {
			ext: 'png',
			mime: 'image/png'
		};
	}

	if (check([0x41, 0x52, 0x52, 0x4F, 0x57, 0x31, 0x00, 0x00])) {
		return {
			ext: 'arrow',
			mime: 'application/x-apache-arrow'
		};
	}

	if (check([0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00])) {
		return {
			ext: 'glb',
			mime: 'model/gltf-binary'
		};
	}

	// `mov` format variants
	if (
		check([0x66, 0x72, 0x65, 0x65], {offset: 4}) || // `free`
		check([0x6D, 0x64, 0x61, 0x74], {offset: 4}) || // `mdat` MJPEG
		check([0x6D, 0x6F, 0x6F, 0x76], {offset: 4}) || // `moov`
		check([0x77, 0x69, 0x64, 0x65], {offset: 4}) // `wide`
	) {
		return {
			ext: 'mov',
			mime: 'video/quicktime'
		};
	}

	// -- 9-byte signatures --

	if (check([0x49, 0x49, 0x52, 0x4F, 0x08, 0x00, 0x00, 0x00, 0x18])) {
		return {
			ext: 'orf',
			mime: 'image/x-olympus-orf'
		};
	}

	// -- 12-byte signatures --

	if (check([0x49, 0x49, 0x55, 0x00, 0x18, 0x00, 0x00, 0x00, 0x88, 0xE7, 0x74, 0xD8])) {
		return {
			ext: 'rw2',
			mime: 'image/x-panasonic-rw2'
		};
	}

	// ASF_Header_Object first 80 bytes
	if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
		async function readHeader() {
			const guid = Buffer.alloc(16);
			await tokenizer.readBuffer(guid);
			return {
				id: guid,
				size: await tokenizer.readToken(Token.UINT64_LE)
			};
		}

		await tokenizer.ignore(30);
		// Search for header should be in first 1KB of file.
		while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
			const header = await readHeader();
			let payload = header.size - 24;
			if (_check(header.id, [0x91, 0x07, 0xDC, 0xB7, 0xB7, 0xA9, 0xCF, 0x11, 0x8E, 0xE6, 0x00, 0xC0, 0x0C, 0x20, 0x53, 0x65])) {
				// Sync on Stream-Properties-Object (B7DC0791-A9B7-11CF-8EE6-00C00C205365)
				const typeId = Buffer.alloc(16);
				payload -= await tokenizer.readBuffer(typeId);

				if (_check(typeId, [0x40, 0x9E, 0x69, 0xF8, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B])) {
					// Found audio:
					return {
						ext: 'wma',
						mime: 'audio/x-ms-wma'
					};
				}

				if (_check(typeId, [0xC0, 0xEF, 0x19, 0xBC, 0x4D, 0x5B, 0xCF, 0x11, 0xA8, 0xFD, 0x00, 0x80, 0x5F, 0x5C, 0x44, 0x2B])) {
					// Found video:
					return {
						ext: 'wmv',
						mime: 'video/x-ms-asf'
					};
				}

				break;
			}

			await tokenizer.ignore(payload);
		}

		// Default to ASF generic extension
		return {
			ext: 'asf',
			mime: 'application/vnd.ms-asf'
		};
	}

	if (check([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A])) {
		return {
			ext: 'ktx',
			mime: 'image/ktx'
		};
	}

	if ((check([0x7E, 0x10, 0x04]) || check([0x7E, 0x18, 0x04])) && check([0x30, 0x4D, 0x49, 0x45], {offset: 4})) {
		return {
			ext: 'mie',
			mime: 'application/x-mie'
		};
	}

	if (check([0x27, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], {offset: 2})) {
		return {
			ext: 'shp',
			mime: 'application/x-esri-shape'
		};
	}

	if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
		// JPEG-2000 family

		await tokenizer.ignore(20);
		const type = await tokenizer.readToken(new Token.StringType(4, 'ascii'));
		switch (type) {
			case 'jp2 ':
				return {
					ext: 'jp2',
					mime: 'image/jp2'
				};
			case 'jpx ':
				return {
					ext: 'jpx',
					mime: 'image/jpx'
				};
			case 'jpm ':
				return {
					ext: 'jpm',
					mime: 'image/jpm'
				};
			case 'mjp2':
				return {
					ext: 'mj2',
					mime: 'image/mj2'
				};
			default:
				return;
		}
	}

	// -- Unsafe signatures --

	if (
		check([0x0, 0x0, 0x1, 0xBA]) ||
		check([0x0, 0x0, 0x1, 0xB3])
	) {
		return {
			ext: 'mpg',
			mime: 'video/mpeg'
		};
	}

	if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
		return {
			ext: 'ttf',
			mime: 'font/ttf'
		};
	}

	if (check([0x00, 0x00, 0x01, 0x00])) {
		return {
			ext: 'ico',
			mime: 'image/x-icon'
		};
	}

	if (check([0x00, 0x00, 0x02, 0x00])) {
		return {
			ext: 'cur',
			mime: 'image/x-icon'
		};
	}

	// Increase sample size from 12 to 256.
	await tokenizer.peekBuffer(buffer, {length: Math.min(256, tokenizer.fileInfo.size), mayBeLess: true});

	// `raf` is here just to keep all the raw image detectors together.
	if (checkString('FUJIFILMCCD-RAW')) {
		return {
			ext: 'raf',
			mime: 'image/x-fujifilm-raf'
		};
	}

	if (checkString('Extended Module:')) {
		return {
			ext: 'xm',
			mime: 'audio/x-xm'
		};
	}

	if (checkString('Creative Voice File')) {
		return {
			ext: 'voc',
			mime: 'audio/x-voc'
		};
	}

	if (check([0x04, 0x00, 0x00, 0x00]) && buffer.length >= 16) { // Rough & quick check Pickle/ASAR
		const jsonSize = buffer.readUInt32LE(12);
		if (jsonSize > 12 && jsonSize < 240 && buffer.length >= jsonSize + 16) {
			try {
				const header = buffer.slice(16, jsonSize + 16).toString();
				const json = JSON.parse(header);
				// Check if Pickle is ASAR
				if (json.files) { // Final check, assuring Pickle/ASAR format
					return {
						ext: 'asar',
						mime: 'application/x-asar'
					};
				}
			} catch (_) {
			}
		}
	}

	if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3E])) {
		return {
			ext: 'msi',
			mime: 'application/x-msi'
		};
	}

	if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
		return {
			ext: 'mxf',
			mime: 'application/mxf'
		};
	}

	if (checkString('SCRM', {offset: 44})) {
		return {
			ext: 's3m',
			mime: 'audio/x-s3m'
		};
	}

	if (check([0x47], {offset: 4}) && (check([0x47], {offset: 192}) || check([0x47], {offset: 196}))) {
		return {
			ext: 'mts',
			mime: 'video/mp2t'
		};
	}

	if (check([0x42, 0x4F, 0x4F, 0x4B, 0x4D, 0x4F, 0x42, 0x49], {offset: 60})) {
		return {
			ext: 'mobi',
			mime: 'application/x-mobipocket-ebook'
		};
	}

	if (check([0x44, 0x49, 0x43, 0x4D], {offset: 128})) {
		return {
			ext: 'dcm',
			mime: 'application/dicom'
		};
	}

	if (check([0x4C, 0x00, 0x00, 0x00, 0x01, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46])) {
		return {
			ext: 'lnk',
			mime: 'application/x.ms.shortcut' // Invented by us
		};
	}

	if (check([0x62, 0x6F, 0x6F, 0x6B, 0x00, 0x00, 0x00, 0x00, 0x6D, 0x61, 0x72, 0x6B, 0x00, 0x00, 0x00, 0x00])) {
		return {
			ext: 'alias',
			mime: 'application/x.apple.alias' // Invented by us
		};
	}

	if (
		check([0x4C, 0x50], {offset: 34}) &&
		(
			check([0x00, 0x00, 0x01], {offset: 8}) ||
			check([0x01, 0x00, 0x02], {offset: 8}) ||
			check([0x02, 0x00, 0x02], {offset: 8})
		)
	) {
		return {
			ext: 'eot',
			mime: 'application/vnd.ms-fontobject'
		};
	}

	if (check([0x06, 0x06, 0xED, 0xF5, 0xD8, 0x1D, 0x46, 0xE5, 0xBD, 0x31, 0xEF, 0xE7, 0xFE, 0x74, 0xB7, 0x1D])) {
		return {
			ext: 'indd',
			mime: 'application/x-indesign'
		};
	}

	// Increase sample size from 256 to 512
	await tokenizer.peekBuffer(buffer, {length: Math.min(512, tokenizer.fileInfo.size), mayBeLess: true});

	// Requires a buffer size of 512 bytes
	if (tarHeaderChecksumMatches(buffer)) {
		return {
			ext: 'tar',
			mime: 'application/x-tar'
		};
	}

	if (check([0xFF, 0xFE, 0xFF, 0x0E, 0x53, 0x00, 0x6B, 0x00, 0x65, 0x00, 0x74, 0x00, 0x63, 0x00, 0x68, 0x00, 0x55, 0x00, 0x70, 0x00, 0x20, 0x00, 0x4D, 0x00, 0x6F, 0x00, 0x64, 0x00, 0x65, 0x00, 0x6C, 0x00])) {
		return {
			ext: 'skp',
			mime: 'application/vnd.sketchup.skp'
		};
	}

	if (checkString('-----BEGIN PGP MESSAGE-----')) {
		return {
			ext: 'pgp',
			mime: 'application/pgp-encrypted'
		};
	}

	// Check for MPEG header at different starting offsets
	for (let start = 0; start < 2 && start < (buffer.length - 16); start++) {
		// Check MPEG 1 or 2 Layer 3 header, or 'layer 0' for ADTS (MPEG sync-word 0xFFE)
		if (buffer.length >= start + 2 && check([0xFF, 0xE0], {offset: start, mask: [0xFF, 0xE0]})) {
			if (check([0x10], {offset: start + 1, mask: [0x16]})) {
				// Check for (ADTS) MPEG-2
				if (check([0x08], {offset: start + 1, mask: [0x08]})) {
					return {
						ext: 'aac',
						mime: 'audio/aac'
					};
				}

				// Must be (ADTS) MPEG-4
				return {
					ext: 'aac',
					mime: 'audio/aac'
				};
			}

			// MPEG 1 or 2 Layer 3 header
			// Check for MPEG layer 3
			if (check([0x02], {offset: start + 1, mask: [0x06]})) {
				return {
					ext: 'mp3',
					mime: 'audio/mpeg'
				};
			}

			// Check for MPEG layer 2
			if (check([0x04], {offset: start + 1, mask: [0x06]})) {
				return {
					ext: 'mp2',
					mime: 'audio/mpeg'
				};
			}

			// Check for MPEG layer 1
			if (check([0x06], {offset: start + 1, mask: [0x06]})) {
				return {
					ext: 'mp1',
					mime: 'audio/mpeg'
				};
			}
		}
	}
}

const stream = readableStream => new Promise((resolve, reject) => {
	// Using `eval` to work around issues when bundling with Webpack
	const stream = eval('require')('stream'); // eslint-disable-line no-eval

	readableStream.on('error', reject);
	readableStream.once('readable', async () => {
		// Set up output stream
		const pass = new stream.PassThrough();
		let outputStream;
		if (stream.pipeline) {
			outputStream = stream.pipeline(readableStream, pass, () => {
			});
		} else {
			outputStream = readableStream.pipe(pass);
		}

		// Read the input stream and detect the filetype
		const chunk = readableStream.read(minimumBytes) || readableStream.read() || Buffer.alloc(0);
		try {
			const fileType = await fromBuffer(chunk);
			pass.fileType = fileType;
		} catch (error) {
			reject(error);
		}

		resolve(outputStream);
	});
});

const fileType = {
	fromStream,
	fromTokenizer,
	fromBuffer,
	stream
};

Object.defineProperty(fileType, 'extensions', {
	get() {
		return new Set(supported.extensions);
	}
});

Object.defineProperty(fileType, 'mimeTypes', {
	get() {
		return new Set(supported.mimeTypes);
	}
});

module.exports = fileType;


/***/ }),

/***/ 4930:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const strtok3 = __nccwpck_require__(2635);
const core = __nccwpck_require__(4126);

async function fromFile(path) {
	const tokenizer = await strtok3.fromFile(path);
	try {
		return await core.fromTokenizer(tokenizer);
	} finally {
		await tokenizer.close();
	}
}

const fileType = {
	fromFile
};

Object.assign(fileType, core);

Object.defineProperty(fileType, 'extensions', {
	get() {
		return core.extensions;
	}
});

Object.defineProperty(fileType, 'mimeTypes', {
	get() {
		return core.mimeTypes;
	}
});

module.exports = fileType;


/***/ }),

/***/ 7860:
/***/ ((module) => {

"use strict";


module.exports = {
	extensions: [
		'jpg',
		'png',
		'apng',
		'gif',
		'webp',
		'flif',
		'cr2',
		'cr3',
		'orf',
		'arw',
		'dng',
		'nef',
		'rw2',
		'raf',
		'tif',
		'bmp',
		'icns',
		'jxr',
		'psd',
		'indd',
		'zip',
		'tar',
		'rar',
		'gz',
		'bz2',
		'7z',
		'dmg',
		'mp4',
		'mid',
		'mkv',
		'webm',
		'mov',
		'avi',
		'mpg',
		'mp2',
		'mp3',
		'm4a',
		'oga',
		'ogg',
		'ogv',
		'opus',
		'flac',
		'wav',
		'spx',
		'amr',
		'pdf',
		'epub',
		'exe',
		'swf',
		'rtf',
		'wasm',
		'woff',
		'woff2',
		'eot',
		'ttf',
		'otf',
		'ico',
		'flv',
		'ps',
		'xz',
		'sqlite',
		'nes',
		'crx',
		'xpi',
		'cab',
		'deb',
		'ar',
		'rpm',
		'Z',
		'lz',
		'msi',
		'mxf',
		'mts',
		'blend',
		'bpg',
		'docx',
		'pptx',
		'xlsx',
		'3gp',
		'3g2',
		'jp2',
		'jpm',
		'jpx',
		'mj2',
		'aif',
		'qcp',
		'odt',
		'ods',
		'odp',
		'xml',
		'mobi',
		'heic',
		'cur',
		'ktx',
		'ape',
		'wv',
		'wmv',
		'wma',
		'dcm',
		'ics',
		'glb',
		'pcap',
		'dsf',
		'lnk',
		'alias',
		'voc',
		'ac3',
		'm4v',
		'm4p',
		'm4b',
		'f4v',
		'f4p',
		'f4b',
		'f4a',
		'mie',
		'asf',
		'ogm',
		'ogx',
		'mpc',
		'arrow',
		'shp',
		'aac',
		'mp1',
		'it',
		's3m',
		'xm',
		'ai',
		'skp',
		'avif',
		'eps',
		'lzh',
		'pgp',
		'asar'
	],
	mimeTypes: [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'image/flif',
		'image/x-canon-cr2',
		'image/x-canon-cr3',
		'image/tiff',
		'image/bmp',
		'image/vnd.ms-photo',
		'image/vnd.adobe.photoshop',
		'application/x-indesign',
		'application/epub+zip',
		'application/x-xpinstall',
		'application/vnd.oasis.opendocument.text',
		'application/vnd.oasis.opendocument.spreadsheet',
		'application/vnd.oasis.opendocument.presentation',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/zip',
		'application/x-tar',
		'application/x-rar-compressed',
		'application/gzip',
		'application/x-bzip2',
		'application/x-7z-compressed',
		'application/x-apple-diskimage',
		'application/x-apache-arrow',
		'video/mp4',
		'audio/midi',
		'video/x-matroska',
		'video/webm',
		'video/quicktime',
		'video/vnd.avi',
		'audio/vnd.wave',
		'audio/qcelp',
		'audio/x-ms-wma',
		'video/x-ms-asf',
		'application/vnd.ms-asf',
		'video/mpeg',
		'video/3gpp',
		'audio/mpeg',
		'audio/mp4', // RFC 4337
		'audio/opus',
		'video/ogg',
		'audio/ogg',
		'application/ogg',
		'audio/x-flac',
		'audio/ape',
		'audio/wavpack',
		'audio/amr',
		'application/pdf',
		'application/x-msdownload',
		'application/x-shockwave-flash',
		'application/rtf',
		'application/wasm',
		'font/woff',
		'font/woff2',
		'application/vnd.ms-fontobject',
		'font/ttf',
		'font/otf',
		'image/x-icon',
		'video/x-flv',
		'application/postscript',
		'application/eps',
		'application/x-xz',
		'application/x-sqlite3',
		'application/x-nintendo-nes-rom',
		'application/x-google-chrome-extension',
		'application/vnd.ms-cab-compressed',
		'application/x-deb',
		'application/x-unix-archive',
		'application/x-rpm',
		'application/x-compress',
		'application/x-lzip',
		'application/x-msi',
		'application/x-mie',
		'application/mxf',
		'video/mp2t',
		'application/x-blender',
		'image/bpg',
		'image/jp2',
		'image/jpx',
		'image/jpm',
		'image/mj2',
		'audio/aiff',
		'application/xml',
		'application/x-mobipocket-ebook',
		'image/heif',
		'image/heif-sequence',
		'image/heic',
		'image/heic-sequence',
		'image/icns',
		'image/ktx',
		'application/dicom',
		'audio/x-musepack',
		'text/calendar',
		'model/gltf-binary',
		'application/vnd.tcpdump.pcap',
		'audio/x-dsf', // Non-standard
		'application/x.ms.shortcut', // Invented by us
		'application/x.apple.alias', // Invented by us
		'audio/x-voc',
		'audio/vnd.dolby.dd-raw',
		'audio/x-m4a',
		'image/apng',
		'image/x-olympus-orf',
		'image/x-sony-arw',
		'image/x-adobe-dng',
		'image/x-nikon-nef',
		'image/x-panasonic-rw2',
		'image/x-fujifilm-raf',
		'video/x-m4v',
		'video/3gpp2',
		'application/x-esri-shape',
		'audio/aac',
		'audio/x-it',
		'audio/x-s3m',
		'audio/x-xm',
		'video/MP1S',
		'video/MP2P',
		'application/vnd.sketchup.skp',
		'image/avif',
		'application/x-lzh-compressed',
		'application/pgp-encrypted',
		'application/x-asar'
	]
};


/***/ }),

/***/ 4875:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.stringToBytes = string => [...string].map(character => character.charCodeAt(0));

exports.tarHeaderChecksumMatches = buffer => { // Does not check if checksum field characters are valid
	if (buffer.length < 512) { // `tar` header size, cannot compute checksum without it
		return false;
	}

	const readSum = parseInt(buffer.toString('utf8', 148, 154).replace(/\0.*$/, '').trim(), 8); // Read sum in header
	if (isNaN(readSum)) {
		return false;
	}

	const MASK_8TH_BIT = 0x80;

	let sum = 256; // Initialize sum, with 256 as sum of 8 spaces in checksum field
	let signedBitSum = 0; // Initialize signed bit sum

	for (let i = 0; i < 148; i++) {
		const byte = buffer[i];
		sum += byte;
		signedBitSum += byte & MASK_8TH_BIT; // Add signed bit to signed bit sum
	}

	// Skip checksum field

	for (let i = 156; i < 512; i++) {
		const byte = buffer[i];
		sum += byte;
		signedBitSum += byte & MASK_8TH_BIT; // Add signed bit to signed bit sum
	}

	// Some implementations compute checksum incorrectly using signed bytes
	return (
		// Checksum in header equals the sum we calculated
		readSum === sum ||

		// Checksum in header equals sum we calculated plus signed-to-unsigned delta
		readSum === (sum - (signedBitSum << 1))
	);
};

/**
ID3 UINT32 sync-safe tokenizer token.
28 bits (representing up to 256MB) integer, the msb is 0 to avoid "false syncsignals".
*/
exports.uint32SyncSafeToken = {
	get: (buffer, offset) => {
		return (buffer[offset + 3] & 0x7F) | ((buffer[offset + 2]) << 7) | ((buffer[offset + 1]) << 14) | ((buffer[offset]) << 21);
	},
	len: 4
};


/***/ }),

/***/ 1585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __nccwpck_require__(2413);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 1766:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {constants: BufferConstants} = __nccwpck_require__(4293);
const pump = __nccwpck_require__(8341);
const bufferStream = __nccwpck_require__(1585);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
// TODO: Remove this for the next major release
module.exports.default = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 4655:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isGlob = __nccwpck_require__(4466);
var pathPosixDirname = __nccwpck_require__(5622).posix.dirname;
var isWin32 = __nccwpck_require__(2087).platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (enclosure.test(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};


/***/ }),

/***/ 9038:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {promisify} = __nccwpck_require__(1669);
const fs = __nccwpck_require__(5747);
const path = __nccwpck_require__(5622);
const fastGlob = __nccwpck_require__(3664);
const gitIgnore = __nccwpck_require__(2069);
const slash = __nccwpck_require__(2158);

const DEFAULT_IGNORE = [
	'**/node_modules/**',
	'**/flow-typed/**',
	'**/coverage/**',
	'**/.git'
];

const readFileP = promisify(fs.readFile);

const mapGitIgnorePatternTo = base => ignore => {
	if (ignore.startsWith('!')) {
		return '!' + path.posix.join(base, ignore.slice(1));
	}

	return path.posix.join(base, ignore);
};

const parseGitIgnore = (content, options) => {
	const base = slash(path.relative(options.cwd, path.dirname(options.fileName)));

	return content
		.split(/\r?\n/)
		.filter(Boolean)
		.filter(line => !line.startsWith('#'))
		.map(mapGitIgnorePatternTo(base));
};

const reduceIgnore = files => {
	const ignores = gitIgnore();
	for (const file of files) {
		ignores.add(parseGitIgnore(file.content, {
			cwd: file.cwd,
			fileName: file.filePath
		}));
	}

	return ignores;
};

const ensureAbsolutePathForCwd = (cwd, p) => {
	cwd = slash(cwd);
	if (path.isAbsolute(p)) {
		if (slash(p).startsWith(cwd)) {
			return p;
		}

		throw new Error(`Path ${p} is not in cwd ${cwd}`);
	}

	return path.join(cwd, p);
};

const getIsIgnoredPredecate = (ignores, cwd) => {
	return p => ignores.ignores(slash(path.relative(cwd, ensureAbsolutePathForCwd(cwd, p.path || p))));
};

const getFile = async (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = await readFileP(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const getFileSync = (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = fs.readFileSync(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const normalizeOptions = ({
	ignore = [],
	cwd = slash(process.cwd())
} = {}) => {
	return {ignore, cwd};
};

module.exports = async options => {
	options = normalizeOptions(options);

	const paths = await fastGlob('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = await Promise.all(paths.map(file => getFile(file, options.cwd)));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};

module.exports.sync = options => {
	options = normalizeOptions(options);

	const paths = fastGlob.sync('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = paths.map(file => getFileSync(file, options.cwd));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};


/***/ }),

/***/ 3398:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const fs = __nccwpck_require__(5747);
const arrayUnion = __nccwpck_require__(9600);
const merge2 = __nccwpck_require__(2578);
const fastGlob = __nccwpck_require__(3664);
const dirGlob = __nccwpck_require__(2738);
const gitignore = __nccwpck_require__(9038);
const {FilterStream, UniqueStream} = __nccwpck_require__(2408);

const DEFAULT_FILTER = () => false;

const isNegative = pattern => pattern[0] === '!';

const assertPatternsInput = patterns => {
	if (!patterns.every(pattern => typeof pattern === 'string')) {
		throw new TypeError('Patterns must be a string or an array of strings');
	}
};

const checkCwdOption = (options = {}) => {
	if (!options.cwd) {
		return;
	}

	let stat;
	try {
		stat = fs.statSync(options.cwd);
	} catch {
		return;
	}

	if (!stat.isDirectory()) {
		throw new Error('The `cwd` option must be a path to a directory');
	}
};

const getPathString = p => p.stats instanceof fs.Stats ? p.path : p;

const generateGlobTasks = (patterns, taskOptions) => {
	patterns = arrayUnion([].concat(patterns));
	assertPatternsInput(patterns);
	checkCwdOption(taskOptions);

	const globTasks = [];

	taskOptions = {
		ignore: [],
		expandDirectories: true,
		...taskOptions
	};

	for (const [index, pattern] of patterns.entries()) {
		if (isNegative(pattern)) {
			continue;
		}

		const ignore = patterns
			.slice(index)
			.filter(pattern => isNegative(pattern))
			.map(pattern => pattern.slice(1));

		const options = {
			...taskOptions,
			ignore: taskOptions.ignore.concat(ignore)
		};

		globTasks.push({pattern, options});
	}

	return globTasks;
};

const globDirs = (task, fn) => {
	let options = {};
	if (task.options.cwd) {
		options.cwd = task.options.cwd;
	}

	if (Array.isArray(task.options.expandDirectories)) {
		options = {
			...options,
			files: task.options.expandDirectories
		};
	} else if (typeof task.options.expandDirectories === 'object') {
		options = {
			...options,
			...task.options.expandDirectories
		};
	}

	return fn(task.pattern, options);
};

const getPattern = (task, fn) => task.options.expandDirectories ? globDirs(task, fn) : [task.pattern];

const getFilterSync = options => {
	return options && options.gitignore ?
		gitignore.sync({cwd: options.cwd, ignore: options.ignore}) :
		DEFAULT_FILTER;
};

const globToTask = task => glob => {
	const {options} = task;
	if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
		options.ignore = dirGlob.sync(options.ignore);
	}

	return {
		pattern: glob,
		options
	};
};

module.exports = async (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const getFilter = async () => {
		return options && options.gitignore ?
			gitignore({cwd: options.cwd, ignore: options.ignore}) :
			DEFAULT_FILTER;
	};

	const getTasks = async () => {
		const tasks = await Promise.all(globTasks.map(async task => {
			const globs = await getPattern(task, dirGlob);
			return Promise.all(globs.map(globToTask(task)));
		}));

		return arrayUnion(...tasks);
	};

	const [filter, tasks] = await Promise.all([getFilter(), getTasks()]);
	const paths = await Promise.all(tasks.map(task => fastGlob(task.pattern, task.options)));

	return arrayUnion(...paths).filter(path_ => !filter(getPathString(path_)));
};

module.exports.sync = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = [];
	for (const task of globTasks) {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		tasks.push(...newTask);
	}

	const filter = getFilterSync(options);

	let matches = [];
	for (const task of tasks) {
		matches = arrayUnion(matches, fastGlob.sync(task.pattern, task.options));
	}

	return matches.filter(path_ => !filter(path_));
};

module.exports.stream = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = [];
	for (const task of globTasks) {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		tasks.push(...newTask);
	}

	const filter = getFilterSync(options);
	const filterStream = new FilterStream(p => !filter(p));
	const uniqueStream = new UniqueStream();

	return merge2(tasks.map(task => fastGlob.stream(task.pattern, task.options)))
		.pipe(filterStream)
		.pipe(uniqueStream);
};

module.exports.generateGlobTasks = generateGlobTasks;

module.exports.hasMagic = (patterns, options) => []
	.concat(patterns)
	.some(pattern => fastGlob.isDynamicPattern(pattern, options));

module.exports.gitignore = gitignore;


/***/ }),

/***/ 2069:
/***/ ((module) => {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const EMPTY = ''
const SPACE = ' '
const ESCAPE = '\\'
const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g
// /foo,
// ./foo,
// ../foo,
// .
// ..
const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/

const SLASH = '/'
const KEY_IGNORE = typeof Symbol !== 'undefined'
  ? Symbol.for('node-ignore')
  /* istanbul ignore next */
  : 'node-ignore'

const define = (object, key, value) =>
  Object.defineProperty(object, key, {value})

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : EMPTY
)

// See fixtures #59
const cleanRangeBackSlash = slashes => {
  const {length} = slashes
  return slashes.slice(0, length - length % 2)
}

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const REPLACERS = [

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    match => match.indexOf('\\') === 0
      ? SPACE
      : EMPTY
  ],

  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => SPACE
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    match => `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule
    /(^|[^\\]+)\\\*(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1) => `${p1}[^\\/]*`
  ],

  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],

  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],

  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.

    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE
      // '\\[bar]' -> '\\\\[bar\\]'
      ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`
      : close === ']'
        ? endEscape.length % 2 === 0
          // A normal case, and it is a range notation
          // '[bar]'
          // '[bar\\\\]'
          ? `[${sanitizeRange(range)}${endEscape}]`
          // Invalid range notaton
          // '[bar\\]' -> '[bar\\\\]'
          : '[]'
        : '[]'
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ],

  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1
        // '\^':
        // '/*' does not match EMPTY
        // '/*' does not match everything

        // '\\\/':
        // 'abc/*' does not match 'abc/'
        ? `${p1}[^/]+`

        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        : '[^/]*'

      return `${prefix}(?=$|\\/$)`
    }
  ],
]

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, negative, ignorecase) => {
  const r = regexCache[pattern]
  if (r) {
    return r
  }

  // const replacers = negative
  //   ? NEGATIVE_REPLACERS
  //   : POSITIVE_REPLACERS

  const source = REPLACERS.reduce(
    (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
    pattern
  )

  return regexCache[pattern] = ignorecase
    ? new RegExp(source, 'i')
    : new RegExp(source)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern.split(REGEX_SPLITALL_CRLF)

class IgnoreRule {
  constructor (
    origin,
    pattern,
    negative,
    regex
  ) {
    this.origin = origin
    this.pattern = pattern
    this.negative = negative
    this.regex = regex
  }
}

const createRule = (pattern, ignorecase) => {
  const origin = pattern
  let negative = false

  // > An optional prefix "!" which negates the pattern;
  if (pattern.indexOf('!') === 0) {
    negative = true
    pattern = pattern.substr(1)
  }

  pattern = pattern
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regex = makeRegex(pattern, negative, ignorecase)

  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  )
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore EMPTY, so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative
checkPath.convert = p => p

class Ignore {
  constructor ({
    ignorecase = true
  } = {}) {
    this._rules = []
    this._ignorecase = ignorecase
    define(this, KEY_IGNORE, true)
    this._initCache()
  }

  _initCache () {
    this._ignoreCache = Object.create(null)
    this._testCache = Object.create(null)
  }

  _addPattern (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules)
      this._added = true
      return
    }

    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignorecase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._addPattern, this)

    // Some rules have just added to the ignore,
    // making the behavior changed.
    if (this._added) {
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X

  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen

  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.

  // @returns {TestResult} true if a file is ignored
  _testOne (path, checkUnignored) {
    let ignored = false
    let unignored = false

    this._rules.forEach(rule => {
      const {negative} = rule
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule.regex.test(path)

      if (matched) {
        ignored = !negative
        unignored = negative
      }
    })

    return {
      ignored,
      unignored
    }
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(path, originalPath, throwError)

    return this._t(path, cache, checkUnignored, slices)
  }

  _t (path, cache, checkUnignored, slices) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._testOne(path, checkUnignored)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._testOne(path, checkUnignored)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const returnFalse = () => false

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, returnFalse)

factory.isPathValid = isPathValid

// Fixes typescript
factory.default = factory

module.exports = factory

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && (
    process.env && process.env.IGNORE_TEST_WIN32
    || process.platform === 'win32'
  )
) {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


/***/ }),

/***/ 2158:
/***/ ((module) => {

"use strict";

module.exports = path => {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}

	return path.replace(/\\/g, '/');
};


/***/ }),

/***/ 2408:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {Transform} = __nccwpck_require__(2413);

class ObjectTransform extends Transform {
	constructor() {
		super({
			objectMode: true
		});
	}
}

class FilterStream extends ObjectTransform {
	constructor(filter) {
		super();
		this._filter = filter;
	}

	_transform(data, encoding, callback) {
		if (this._filter(data)) {
			this.push(data);
		}

		callback();
	}
}

class UniqueStream extends ObjectTransform {
	constructor() {
		super();
		this._pushed = new Set();
	}

	_transform(data, encoding, callback) {
		if (!this._pushed.has(data)) {
			this.push(data);
			this._pushed.add(data);
		}

		callback();
	}
}

module.exports = {
	FilterStream,
	UniqueStream
};


/***/ }),

/***/ 7356:
/***/ ((module) => {

"use strict";


module.exports = clone

var getPrototypeOf = Object.getPrototypeOf || function (obj) {
  return obj.__proto__
}

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: getPrototypeOf(obj) }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),

/***/ 7758:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(5747)
var polyfills = __nccwpck_require__(263)
var legacy = __nccwpck_require__(3086)
var clone = __nccwpck_require__(7356)

var util = __nccwpck_require__(1669)

/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue
var previousSymbol

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  })
}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

// Once time initialization
if (!fs[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = global[gracefulQueue] || []
  publishQueue(fs, queue)

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry()
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs, arguments)
      retry()
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs[gracefulQueue])
      __nccwpck_require__(2357).equal(fs[gracefulQueue].length, 0)
    })
  }
}

if (!global[gracefulQueue]) {
  publishQueue(global, fs[gracefulQueue]);
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$copyFile = fs.copyFile
  if (fs$copyFile)
    fs.copyFile = copyFile
  function copyFile (src, dest, flags, cb) {
    if (typeof flags === 'function') {
      cb = flags
      flags = 0
    }
    return fs$copyFile(src, dest, flags, function (err) {
      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([fs$copyFile, [src, dest, flags, cb]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    })
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  // legacy names
  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  fs[gracefulQueue].push(elem)
}

function retry () {
  var elem = fs[gracefulQueue].shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),

/***/ 3086:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = __nccwpck_require__(2413).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),

/***/ 263:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var constants = __nccwpck_require__(7619)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
  var chdir = process.chdir
  process.chdir = function (d) {
    cwd = null
    chdir.call(process, d)
  }
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read)
    return read
  })(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options
        options = null
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),

/***/ 8213:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 2779:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.signalsByNumber=exports.signalsByName=void 0;var _os=__nccwpck_require__(2087);

var _signals=__nccwpck_require__(8821);
var _realtime=__nccwpck_require__(1229);



const getSignalsByName=function(){
const signals=(0,_signals.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return{
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0,_signals.getSignals)();
const length=_realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return{};
}

const{name,description,supported,action,forced,standard}=signal;
return{
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 1229:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return{
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map

/***/ }),

/***/ 8821:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.getSignals=void 0;var _os=__nccwpck_require__(2087);

var _core=__nccwpck_require__(8213);
var _realtime=__nccwpck_require__(1229);



const getSignals=function(){
const realtimeSignals=(0,_realtime.getRealtimeSignals)();
const signals=[..._core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return{name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map

/***/ }),

/***/ 3092:
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 7606:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.detector = void 0;
const types_1 = __nccwpck_require__(6379);
const keys = Object.keys(types_1.typeHandlers);
// This map helps avoid validating for every single image type
const firstBytes = {
    0x38: 'psd',
    0x42: 'bmp',
    0x44: 'dds',
    0x47: 'gif',
    0x49: 'tiff',
    0x4d: 'tiff',
    0x52: 'webp',
    0x69: 'icns',
    0x89: 'png',
    0xff: 'jpg'
};
function detector(buffer) {
    const byte = buffer[0];
    if (byte in firstBytes) {
        const type = firstBytes[byte];
        if (type && types_1.typeHandlers[type].validate(buffer)) {
            return type;
        }
    }
    const finder = (key) => types_1.typeHandlers[key].validate(buffer);
    return keys.find(finder);
}
exports.detector = detector;


/***/ }),

/***/ 8250:
/***/ (function(module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.types = exports.setConcurrency = exports.disableTypes = exports.disableFS = exports.imageSize = void 0;
const fs = __nccwpck_require__(5747);
const path = __nccwpck_require__(5622);
const queue_1 = __nccwpck_require__(3795);
const types_1 = __nccwpck_require__(6379);
const detector_1 = __nccwpck_require__(7606);
// Maximum buffer size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
const MaxBufferSize = 512 * 1024;
// This queue is for async `fs` operations, to avoid reaching file-descriptor limits
const queue = new queue_1.default({ concurrency: 100, autostart: true });
const globalOptions = {
    disabledFS: false,
    disabledTypes: []
};
/**
 * Return size information based on a buffer
 *
 * @param {Buffer} buffer
 * @param {String} filepath
 * @returns {Object}
 */
function lookup(buffer, filepath) {
    // detect the file type.. don't rely on the extension
    const type = detector_1.detector(buffer);
    if (typeof type !== 'undefined') {
        if (globalOptions.disabledTypes.indexOf(type) > -1) {
            throw new TypeError('disabled file type: ' + type);
        }
        // find an appropriate handler for this file type
        if (type in types_1.typeHandlers) {
            const size = types_1.typeHandlers[type].calculate(buffer, filepath);
            if (size !== undefined) {
                size.type = type;
                return size;
            }
        }
    }
    // throw up, if we don't understand the file
    throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')');
}
/**
 * Reads a file into a buffer.
 * @param {String} filepath
 * @returns {Promise<Buffer>}
 */
function asyncFileToBuffer(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const handle = yield fs.promises.open(filepath, 'r');
        const { size } = yield handle.stat();
        if (size <= 0) {
            yield handle.close();
            throw new Error('Empty file');
        }
        const bufferSize = Math.min(size, MaxBufferSize);
        const buffer = Buffer.alloc(bufferSize);
        yield handle.read(buffer, 0, bufferSize, 0);
        yield handle.close();
        return buffer;
    });
}
/**
 * Synchronously reads a file into a buffer, blocking the nodejs process.
 *
 * @param {String} filepath
 * @returns {Buffer}
 */
function syncFileToBuffer(filepath) {
    // read from the file, synchronously
    const descriptor = fs.openSync(filepath, 'r');
    const { size } = fs.fstatSync(descriptor);
    if (size <= 0) {
        fs.closeSync(descriptor);
        throw new Error('Empty file');
    }
    const bufferSize = Math.min(size, MaxBufferSize);
    const buffer = Buffer.alloc(bufferSize);
    fs.readSync(descriptor, buffer, 0, bufferSize, 0);
    fs.closeSync(descriptor);
    return buffer;
}
// eslint-disable-next-line @typescript-eslint/no-use-before-define
module.exports = exports = imageSize; // backwards compatibility
exports.default = imageSize;
/**
 * @param {Buffer|string} input - buffer or relative/absolute path of the image file
 * @param {Function=} [callback] - optional function for async detection
 */
function imageSize(input, callback) {
    // Handle buffer input
    if (Buffer.isBuffer(input)) {
        return lookup(input);
    }
    // input should be a string at this point
    if (typeof input !== 'string' || globalOptions.disabledFS) {
        throw new TypeError('invalid invocation. input should be a Buffer');
    }
    // resolve the file path
    const filepath = path.resolve(input);
    if (typeof callback === 'function') {
        queue.push(() => asyncFileToBuffer(filepath)
            .then((buffer) => process.nextTick(callback, null, lookup(buffer, filepath)))
            .catch(callback));
    }
    else {
        const buffer = syncFileToBuffer(filepath);
        return lookup(buffer, filepath);
    }
}
exports.imageSize = imageSize;
const disableFS = (v) => { globalOptions.disabledFS = v; };
exports.disableFS = disableFS;
const disableTypes = (types) => { globalOptions.disabledTypes = types; };
exports.disableTypes = disableTypes;
const setConcurrency = (c) => { queue.concurrency = c; };
exports.setConcurrency = setConcurrency;
exports.types = Object.keys(types_1.typeHandlers);


/***/ }),

/***/ 1446:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readUInt = void 0;
// Abstract reading multi-byte unsigned integers
function readUInt(buffer, bits, offset, isBigEndian) {
    offset = offset || 0;
    const endian = isBigEndian ? 'BE' : 'LE';
    const methodName = ('readUInt' + bits + endian);
    return buffer[methodName].call(buffer, offset);
}
exports.readUInt = readUInt;


/***/ }),

/***/ 6379:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeHandlers = void 0;
// load all available handlers explicitely for browserify support
const bmp_1 = __nccwpck_require__(7098);
const cur_1 = __nccwpck_require__(3769);
const dds_1 = __nccwpck_require__(8773);
const gif_1 = __nccwpck_require__(3941);
const icns_1 = __nccwpck_require__(7045);
const ico_1 = __nccwpck_require__(313);
const j2c_1 = __nccwpck_require__(5947);
const jp2_1 = __nccwpck_require__(6542);
const jpg_1 = __nccwpck_require__(7710);
const ktx_1 = __nccwpck_require__(645);
const png_1 = __nccwpck_require__(7622);
const pnm_1 = __nccwpck_require__(5664);
const psd_1 = __nccwpck_require__(659);
const svg_1 = __nccwpck_require__(7544);
const tiff_1 = __nccwpck_require__(3651);
const webp_1 = __nccwpck_require__(5759);
exports.typeHandlers = {
    bmp: bmp_1.BMP,
    cur: cur_1.CUR,
    dds: dds_1.DDS,
    gif: gif_1.GIF,
    icns: icns_1.ICNS,
    ico: ico_1.ICO,
    j2c: j2c_1.J2C,
    jp2: jp2_1.JP2,
    jpg: jpg_1.JPG,
    ktx: ktx_1.KTX,
    png: png_1.PNG,
    pnm: pnm_1.PNM,
    psd: psd_1.PSD,
    svg: svg_1.SVG,
    tiff: tiff_1.TIFF,
    webp: webp_1.WEBP,
};


/***/ }),

/***/ 7098:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BMP = void 0;
exports.BMP = {
    validate(buffer) {
        return ('BM' === buffer.toString('ascii', 0, 2));
    },
    calculate(buffer) {
        return {
            height: Math.abs(buffer.readInt32LE(22)),
            width: buffer.readUInt32LE(18)
        };
    }
};


/***/ }),

/***/ 3769:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CUR = void 0;
const ico_1 = __nccwpck_require__(313);
const TYPE_CURSOR = 2;
exports.CUR = {
    validate(buffer) {
        if (buffer.readUInt16LE(0) !== 0) {
            return false;
        }
        return buffer.readUInt16LE(2) === TYPE_CURSOR;
    },
    calculate(buffer) {
        return ico_1.ICO.calculate(buffer);
    }
};


/***/ }),

/***/ 8773:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DDS = void 0;
exports.DDS = {
    validate(buffer) {
        return buffer.readUInt32LE(0) === 0x20534444;
    },
    calculate(buffer) {
        return {
            height: buffer.readUInt32LE(12),
            width: buffer.readUInt32LE(16)
        };
    }
};


/***/ }),

/***/ 3941:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GIF = void 0;
const gifRegexp = /^GIF8[79]a/;
exports.GIF = {
    validate(buffer) {
        const signature = buffer.toString('ascii', 0, 6);
        return (gifRegexp.test(signature));
    },
    calculate(buffer) {
        return {
            height: buffer.readUInt16LE(8),
            width: buffer.readUInt16LE(6)
        };
    }
};


/***/ }),

/***/ 7045:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICNS = void 0;
/**
 * ICNS Header
 *
 * | Offset | Size | Purpose                                                |
 * | 0	    | 4    | Magic literal, must be "icns" (0x69, 0x63, 0x6e, 0x73) |
 * | 4      | 4    | Length of file, in bytes, msb first.                   |
 *
 */
const SIZE_HEADER = 4 + 4; // 8
const FILE_LENGTH_OFFSET = 4; // MSB => BIG ENDIAN
/**
 * Image Entry
 *
 * | Offset | Size | Purpose                                                          |
 * | 0	    | 4    | Icon type, see OSType below.                                     |
 * | 4      | 4    | Length of data, in bytes (including type and length), msb first. |
 * | 8      | n    | Icon data                                                        |
 */
const ENTRY_LENGTH_OFFSET = 4; // MSB => BIG ENDIAN
const ICON_TYPE_SIZE = {
    ICON: 32,
    'ICN#': 32,
    // m => 16 x 16
    'icm#': 16,
    icm4: 16,
    icm8: 16,
    // s => 16 x 16
    'ics#': 16,
    ics4: 16,
    ics8: 16,
    is32: 16,
    s8mk: 16,
    icp4: 16,
    // l => 32 x 32
    icl4: 32,
    icl8: 32,
    il32: 32,
    l8mk: 32,
    icp5: 32,
    ic11: 32,
    // h => 48 x 48
    ich4: 48,
    ich8: 48,
    ih32: 48,
    h8mk: 48,
    // . => 64 x 64
    icp6: 64,
    ic12: 32,
    // t => 128 x 128
    it32: 128,
    t8mk: 128,
    ic07: 128,
    // . => 256 x 256
    ic08: 256,
    ic13: 256,
    // . => 512 x 512
    ic09: 512,
    ic14: 512,
    // . => 1024 x 1024
    ic10: 1024,
};
function readImageHeader(buffer, imageOffset) {
    const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
    return [
        buffer.toString('ascii', imageOffset, imageLengthOffset),
        buffer.readUInt32BE(imageLengthOffset)
    ];
}
function getImageSize(type) {
    const size = ICON_TYPE_SIZE[type];
    return { width: size, height: size, type };
}
exports.ICNS = {
    validate(buffer) {
        return ('icns' === buffer.toString('ascii', 0, 4));
    },
    calculate(buffer) {
        const bufferLength = buffer.length;
        const fileLength = buffer.readUInt32BE(FILE_LENGTH_OFFSET);
        let imageOffset = SIZE_HEADER;
        let imageHeader = readImageHeader(buffer, imageOffset);
        let imageSize = getImageSize(imageHeader[0]);
        imageOffset += imageHeader[1];
        if (imageOffset === fileLength) {
            return imageSize;
        }
        const result = {
            height: imageSize.height,
            images: [imageSize],
            width: imageSize.width
        };
        while (imageOffset < fileLength && imageOffset < bufferLength) {
            imageHeader = readImageHeader(buffer, imageOffset);
            imageSize = getImageSize(imageHeader[0]);
            imageOffset += imageHeader[1];
            result.images.push(imageSize);
        }
        return result;
    }
};


/***/ }),

/***/ 313:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICO = void 0;
const TYPE_ICON = 1;
/**
 * ICON Header
 *
 * | Offset | Size | Purpose |
 * | 0	    | 2    | Reserved. Must always be 0.  |
 * | 2      | 2    | Image type: 1 for icon (.ICO) image, 2 for cursor (.CUR) image. Other values are invalid. |
 * | 4      | 2    | Number of images in the file. |
 *
 */
const SIZE_HEADER = 2 + 2 + 2; // 6
/**
 * Image Entry
 *
 * | Offset | Size | Purpose |
 * | 0	    | 1    | Image width in pixels. Can be any number between 0 and 255. Value 0 means width is 256 pixels. |
 * | 1      | 1    | Image height in pixels. Can be any number between 0 and 255. Value 0 means height is 256 pixels. |
 * | 2      | 1    | Number of colors in the color palette. Should be 0 if the image does not use a color palette. |
 * | 3      | 1    | Reserved. Should be 0. |
 * | 4      | 2    | ICO format: Color planes. Should be 0 or 1. |
 * |        |      | CUR format: The horizontal coordinates of the hotspot in number of pixels from the left. |
 * | 6      | 2    | ICO format: Bits per pixel. |
 * |        |      | CUR format: The vertical coordinates of the hotspot in number of pixels from the top. |
 * | 8      | 4    | The size of the image's data in bytes |
 * | 12     | 4    | The offset of BMP or PNG data from the beginning of the ICO/CUR file |
 *
 */
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4; // 16
function getSizeFromOffset(buffer, offset) {
    const value = buffer.readUInt8(offset);
    return value === 0 ? 256 : value;
}
function getImageSize(buffer, imageIndex) {
    const offset = SIZE_HEADER + (imageIndex * SIZE_IMAGE_ENTRY);
    return {
        height: getSizeFromOffset(buffer, offset + 1),
        width: getSizeFromOffset(buffer, offset)
    };
}
exports.ICO = {
    validate(buffer) {
        if (buffer.readUInt16LE(0) !== 0) {
            return false;
        }
        return buffer.readUInt16LE(2) === TYPE_ICON;
    },
    calculate(buffer) {
        const nbImages = buffer.readUInt16LE(4);
        const imageSize = getImageSize(buffer, 0);
        if (nbImages === 1) {
            return imageSize;
        }
        const imgs = [imageSize];
        for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
            imgs.push(getImageSize(buffer, imageIndex));
        }
        const result = {
            height: imageSize.height,
            images: imgs,
            width: imageSize.width
        };
        return result;
    }
};


/***/ }),

/***/ 5947:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.J2C = void 0;
exports.J2C = {
    validate(buffer) {
        // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
        return buffer.toString('hex', 0, 4) === 'ff4fff51';
    },
    calculate(buffer) {
        return {
            height: buffer.readUInt32BE(12),
            width: buffer.readUInt32BE(8),
        };
    }
};


/***/ }),

/***/ 6542:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JP2 = void 0;
const BoxTypes = {
    ftyp: '66747970',
    ihdr: '69686472',
    jp2h: '6a703268',
    jp__: '6a502020',
    rreq: '72726571',
    xml_: '786d6c20'
};
const calculateRREQLength = (box) => {
    const unit = box.readUInt8(0);
    let offset = 1 + (2 * unit);
    const numStdFlags = box.readUInt16BE(offset);
    const flagsLength = numStdFlags * (2 + unit);
    offset = offset + 2 + flagsLength;
    const numVendorFeatures = box.readUInt16BE(offset);
    const featuresLength = numVendorFeatures * (16 + unit);
    return offset + 2 + featuresLength;
};
const parseIHDR = (box) => {
    return {
        height: box.readUInt32BE(4),
        width: box.readUInt32BE(8),
    };
};
exports.JP2 = {
    validate(buffer) {
        const signature = buffer.toString('hex', 4, 8);
        const signatureLength = buffer.readUInt32BE(0);
        if (signature !== BoxTypes.jp__ || signatureLength < 1) {
            return false;
        }
        const ftypeBoxStart = signatureLength + 4;
        const ftypBoxLength = buffer.readUInt32BE(signatureLength);
        const ftypBox = buffer.slice(ftypeBoxStart, ftypeBoxStart + ftypBoxLength);
        return ftypBox.toString('hex', 0, 4) === BoxTypes.ftyp;
    },
    calculate(buffer) {
        const signatureLength = buffer.readUInt32BE(0);
        const ftypBoxLength = buffer.readUInt16BE(signatureLength + 2);
        let offset = signatureLength + 4 + ftypBoxLength;
        const nextBoxType = buffer.toString('hex', offset, offset + 4);
        switch (nextBoxType) {
            case BoxTypes.rreq:
                // WHAT ARE THESE 4 BYTES?????
                // eslint-disable-next-line no-case-declarations
                const MAGIC = 4;
                offset = offset + 4 + MAGIC + calculateRREQLength(buffer.slice(offset + 4));
                return parseIHDR(buffer.slice(offset + 8, offset + 24));
            case BoxTypes.jp2h:
                return parseIHDR(buffer.slice(offset + 8, offset + 24));
            default:
                throw new TypeError('Unsupported header found: ' + buffer.toString('ascii', offset, offset + 4));
        }
    }
};


/***/ }),

/***/ 7710:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// NOTE: we only support baseline and progressive JPGs here
// due to the structure of the loader class, we only get a buffer
// with a maximum size of 4096 bytes. so if the SOF marker is outside
// if this range we can't detect the file size correctly.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JPG = void 0;
const readUInt_1 = __nccwpck_require__(1446);
const EXIF_MARKER = '45786966';
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = '4d4d';
const LITTLE_ENDIAN_BYTE_ALIGN = '4949';
// Each entry is exactly 12 bytes
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(buffer) {
    return (buffer.toString('hex', 2, 6) === EXIF_MARKER);
}
function extractSize(buffer, index) {
    return {
        height: buffer.readUInt16BE(index),
        width: buffer.readUInt16BE(index + 2)
    };
}
function extractOrientation(exifBlock, isBigEndian) {
    // TODO: assert that this contains 0x002A
    // let STATIC_MOTOROLA_TIFF_HEADER_BYTES = 2
    // let TIFF_IMAGE_FILE_DIRECTORY_BYTES = 4
    // TODO: derive from TIFF_IMAGE_FILE_DIRECTORY_BYTES
    const idfOffset = 8;
    // IDF osset works from right after the header bytes
    // (so the offset includes the tiff byte align)
    const offset = EXIF_HEADER_BYTES + idfOffset;
    const idfDirectoryEntries = readUInt_1.readUInt(exifBlock, 16, offset, isBigEndian);
    for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
        const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + (directoryEntryNumber * IDF_ENTRY_BYTES);
        const end = start + IDF_ENTRY_BYTES;
        // Skip on corrupt EXIF blocks
        if (start > exifBlock.length) {
            return;
        }
        const block = exifBlock.slice(start, end);
        const tagNumber = readUInt_1.readUInt(block, 16, 0, isBigEndian);
        // 0x0112 (decimal: 274) is the `orientation` tag ID
        if (tagNumber === 274) {
            const dataFormat = readUInt_1.readUInt(block, 16, 2, isBigEndian);
            if (dataFormat !== 3) {
                return;
            }
            // unsinged int has 2 bytes per component
            // if there would more than 4 bytes in total it's a pointer
            const numberOfComponents = readUInt_1.readUInt(block, 32, 4, isBigEndian);
            if (numberOfComponents !== 1) {
                return;
            }
            return readUInt_1.readUInt(block, 16, 8, isBigEndian);
        }
    }
}
function validateExifBlock(buffer, index) {
    // Skip APP1 Data Size
    const exifBlock = buffer.slice(APP1_DATA_SIZE_BYTES, index);
    // Consider byte alignment
    const byteAlign = exifBlock.toString('hex', EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
    // Ignore Empty EXIF. Validate byte alignment
    const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
    const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
    if (isBigEndian || isLittleEndian) {
        return extractOrientation(exifBlock, isBigEndian);
    }
}
function validateBuffer(buffer, index) {
    // index should be within buffer limits
    if (index > buffer.length) {
        throw new TypeError('Corrupt JPG, exceeded buffer limits');
    }
    // Every JPEG block must begin with a 0xFF
    if (buffer[index] !== 0xFF) {
        throw new TypeError('Invalid JPG, marker table corrupted');
    }
}
exports.JPG = {
    validate(buffer) {
        const SOIMarker = buffer.toString('hex', 0, 2);
        return ('ffd8' === SOIMarker);
    },
    calculate(buffer) {
        // Skip 4 chars, they are for signature
        buffer = buffer.slice(4);
        let orientation;
        let next;
        while (buffer.length) {
            // read length of the next block
            const i = buffer.readUInt16BE(0);
            if (isEXIF(buffer)) {
                orientation = validateExifBlock(buffer, i);
            }
            // ensure correct format
            validateBuffer(buffer, i);
            // 0xFFC0 is baseline standard(SOF)
            // 0xFFC1 is baseline optimized(SOF)
            // 0xFFC2 is progressive(SOF2)
            next = buffer[i + 1];
            if (next === 0xC0 || next === 0xC1 || next === 0xC2) {
                const size = extractSize(buffer, i + 5);
                // TODO: is orientation=0 a valid answer here?
                if (!orientation) {
                    return size;
                }
                return {
                    height: size.height,
                    orientation,
                    width: size.width
                };
            }
            // move to the next block
            buffer = buffer.slice(i + 2);
        }
        throw new TypeError('Invalid JPG, no size found');
    }
};


/***/ }),

/***/ 645:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KTX = void 0;
const SIGNATURE = 'KTX 11';
exports.KTX = {
    validate(buffer) {
        return SIGNATURE === buffer.toString('ascii', 1, 7);
    },
    calculate(buffer) {
        return {
            height: buffer.readUInt32LE(40),
            width: buffer.readUInt32LE(36),
        };
    }
};


/***/ }),

/***/ 7622:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PNG = void 0;
const pngSignature = 'PNG\r\n\x1a\n';
const pngImageHeaderChunkName = 'IHDR';
// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = 'CgBI';
exports.PNG = {
    validate(buffer) {
        if (pngSignature === buffer.toString('ascii', 1, 8)) {
            let chunkName = buffer.toString('ascii', 12, 16);
            if (chunkName === pngFriedChunkName) {
                chunkName = buffer.toString('ascii', 28, 32);
            }
            if (chunkName !== pngImageHeaderChunkName) {
                throw new TypeError('Invalid PNG');
            }
            return true;
        }
        return false;
    },
    calculate(buffer) {
        if (buffer.toString('ascii', 12, 16) === pngFriedChunkName) {
            return {
                height: buffer.readUInt32BE(36),
                width: buffer.readUInt32BE(32)
            };
        }
        return {
            height: buffer.readUInt32BE(20),
            width: buffer.readUInt32BE(16)
        };
    }
};


/***/ }),

/***/ 5664:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PNM = void 0;
const PNMTypes = {
    P1: 'pbm/ascii',
    P2: 'pgm/ascii',
    P3: 'ppm/ascii',
    P4: 'pbm',
    P5: 'pgm',
    P6: 'ppm',
    P7: 'pam',
    PF: 'pfm'
};
const Signatures = Object.keys(PNMTypes);
const handlers = {
    default: (lines) => {
        let dimensions = [];
        while (lines.length > 0) {
            const line = lines.shift();
            if (line[0] === '#') {
                continue;
            }
            dimensions = line.split(' ');
            break;
        }
        if (dimensions.length === 2) {
            return {
                height: parseInt(dimensions[1], 10),
                width: parseInt(dimensions[0], 10),
            };
        }
        else {
            throw new TypeError('Invalid PNM');
        }
    },
    pam: (lines) => {
        const size = {};
        while (lines.length > 0) {
            const line = lines.shift();
            if (line.length > 16 || line.charCodeAt(0) > 128) {
                continue;
            }
            const [key, value] = line.split(' ');
            if (key && value) {
                size[key.toLowerCase()] = parseInt(value, 10);
            }
            if (size.height && size.width) {
                break;
            }
        }
        if (size.height && size.width) {
            return {
                height: size.height,
                width: size.width
            };
        }
        else {
            throw new TypeError('Invalid PAM');
        }
    }
};
exports.PNM = {
    validate(buffer) {
        const signature = buffer.toString('ascii', 0, 2);
        return Signatures.includes(signature);
    },
    calculate(buffer) {
        const signature = buffer.toString('ascii', 0, 2);
        const type = PNMTypes[signature];
        // TODO: this probably generates garbage. move to a stream based parser
        const lines = buffer.toString('ascii', 3).split(/[\r\n]+/);
        const handler = handlers[type] || handlers.default;
        return handler(lines);
    }
};


/***/ }),

/***/ 659:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PSD = void 0;
exports.PSD = {
    validate(buffer) {
        return ('8BPS' === buffer.toString('ascii', 0, 4));
    },
    calculate(buffer) {
        return {
            height: buffer.readUInt32BE(14),
            width: buffer.readUInt32BE(18)
        };
    }
};


/***/ }),

/***/ 7544:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SVG = void 0;
const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
    height: /\sheight=(['"])([^%]+?)\1/,
    root: svgReg,
    viewbox: /\sviewBox=(['"])(.+?)\1/i,
    width: /\swidth=(['"])([^%]+?)\1/,
};
const INCH_CM = 2.54;
const units = {
    in: 96,
    cm: 96 / INCH_CM,
    em: 16,
    ex: 8,
    m: 96 / INCH_CM * 100,
    mm: 96 / INCH_CM / 10,
    pc: 96 / 72 / 12,
    pt: 96 / 72,
    px: 1
};
const unitsReg = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join('|')})?$`);
function parseLength(len) {
    const m = unitsReg.exec(len);
    if (!m) {
        return undefined;
    }
    return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
    const bounds = viewbox.split(' ');
    return {
        height: parseLength(bounds[3]),
        width: parseLength(bounds[2])
    };
}
function parseAttributes(root) {
    const width = root.match(extractorRegExps.width);
    const height = root.match(extractorRegExps.height);
    const viewbox = root.match(extractorRegExps.viewbox);
    return {
        height: height && parseLength(height[2]),
        viewbox: viewbox && parseViewbox(viewbox[2]),
        width: width && parseLength(width[2]),
    };
}
function calculateByDimensions(attrs) {
    return {
        height: attrs.height,
        width: attrs.width,
    };
}
function calculateByViewbox(attrs, viewbox) {
    const ratio = viewbox.width / viewbox.height;
    if (attrs.width) {
        return {
            height: Math.floor(attrs.width / ratio),
            width: attrs.width,
        };
    }
    if (attrs.height) {
        return {
            height: attrs.height,
            width: Math.floor(attrs.height * ratio),
        };
    }
    return {
        height: viewbox.height,
        width: viewbox.width,
    };
}
exports.SVG = {
    validate(buffer) {
        const str = String(buffer);
        return svgReg.test(str);
    },
    calculate(buffer) {
        const root = buffer.toString('utf8').match(extractorRegExps.root);
        if (root) {
            const attrs = parseAttributes(root[0]);
            if (attrs.width && attrs.height) {
                return calculateByDimensions(attrs);
            }
            if (attrs.viewbox) {
                return calculateByViewbox(attrs, attrs.viewbox);
            }
        }
        throw new TypeError('Invalid SVG');
    }
};


/***/ }),

/***/ 3651:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TIFF = void 0;
// based on http://www.compix.com/fileformattif.htm
// TO-DO: support big-endian as well
const fs = __nccwpck_require__(5747);
const readUInt_1 = __nccwpck_require__(1446);
// Read IFD (image-file-directory) into a buffer
function readIFD(buffer, filepath, isBigEndian) {
    const ifdOffset = readUInt_1.readUInt(buffer, 32, 4, isBigEndian);
    // read only till the end of the file
    let bufferSize = 1024;
    const fileSize = fs.statSync(filepath).size;
    if (ifdOffset + bufferSize > fileSize) {
        bufferSize = fileSize - ifdOffset - 10;
    }
    // populate the buffer
    const endBuffer = Buffer.alloc(bufferSize);
    const descriptor = fs.openSync(filepath, 'r');
    fs.readSync(descriptor, endBuffer, 0, bufferSize, ifdOffset);
    fs.closeSync(descriptor);
    return endBuffer.slice(2);
}
// TIFF values seem to be messed up on Big-Endian, this helps
function readValue(buffer, isBigEndian) {
    const low = readUInt_1.readUInt(buffer, 16, 8, isBigEndian);
    const high = readUInt_1.readUInt(buffer, 16, 10, isBigEndian);
    return (high << 16) + low;
}
// move to the next tag
function nextTag(buffer) {
    if (buffer.length > 24) {
        return buffer.slice(12);
    }
}
// Extract IFD tags from TIFF metadata
function extractTags(buffer, isBigEndian) {
    const tags = {};
    let temp = buffer;
    while (temp && temp.length) {
        const code = readUInt_1.readUInt(temp, 16, 0, isBigEndian);
        const type = readUInt_1.readUInt(temp, 16, 2, isBigEndian);
        const length = readUInt_1.readUInt(temp, 32, 4, isBigEndian);
        // 0 means end of IFD
        if (code === 0) {
            break;
        }
        else {
            // 256 is width, 257 is height
            // if (code === 256 || code === 257) {
            if (length === 1 && (type === 3 || type === 4)) {
                tags[code] = readValue(temp, isBigEndian);
            }
            // move to the next tag
            temp = nextTag(temp);
        }
    }
    return tags;
}
// Test if the TIFF is Big Endian or Little Endian
function determineEndianness(buffer) {
    const signature = buffer.toString('ascii', 0, 2);
    if ('II' === signature) {
        return 'LE';
    }
    else if ('MM' === signature) {
        return 'BE';
    }
}
const signatures = [
    // '492049', // currently not supported
    '49492a00',
    '4d4d002a', // Big Endian
    // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
exports.TIFF = {
    validate(buffer) {
        return signatures.includes(buffer.toString('hex', 0, 4));
    },
    calculate(buffer, filepath) {
        if (!filepath) {
            throw new TypeError('Tiff doesn\'t support buffer');
        }
        // Determine BE/LE
        const isBigEndian = determineEndianness(buffer) === 'BE';
        // read the IFD
        const ifdBuffer = readIFD(buffer, filepath, isBigEndian);
        // extract the tags from the IFD
        const tags = extractTags(ifdBuffer, isBigEndian);
        const width = tags[256];
        const height = tags[257];
        if (!width || !height) {
            throw new TypeError('Invalid Tiff. Missing tags');
        }
        return { height, width };
    }
};


/***/ }),

/***/ 5759:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WEBP = void 0;
function calculateExtended(buffer) {
    return {
        height: 1 + buffer.readUIntLE(7, 3),
        width: 1 + buffer.readUIntLE(4, 3)
    };
}
function calculateLossless(buffer) {
    return {
        height: 1 + (((buffer[4] & 0xF) << 10) | (buffer[3] << 2) | ((buffer[2] & 0xC0) >> 6)),
        width: 1 + (((buffer[2] & 0x3F) << 8) | buffer[1])
    };
}
function calculateLossy(buffer) {
    // `& 0x3fff` returns the last 14 bits
    // TO-DO: include webp scaling in the calculations
    return {
        height: buffer.readInt16LE(8) & 0x3fff,
        width: buffer.readInt16LE(6) & 0x3fff
    };
}
exports.WEBP = {
    validate(buffer) {
        const riffHeader = 'RIFF' === buffer.toString('ascii', 0, 4);
        const webpHeader = 'WEBP' === buffer.toString('ascii', 8, 12);
        const vp8Header = 'VP8' === buffer.toString('ascii', 12, 15);
        return (riffHeader && webpHeader && vp8Header);
    },
    calculate(buffer) {
        const chunkHeader = buffer.toString('ascii', 12, 16);
        buffer = buffer.slice(20, 30);
        // Extended webp stream signature
        if (chunkHeader === 'VP8X') {
            const extendedHeader = buffer[0];
            const validStart = (extendedHeader & 0xc0) === 0;
            const validEnd = (extendedHeader & 0x01) === 0;
            if (validStart && validEnd) {
                return calculateExtended(buffer);
            }
            else {
                // TODO: breaking change
                throw new TypeError('Invalid WebP');
            }
        }
        // Lossless webp stream signature
        if (chunkHeader === 'VP8 ' && buffer[0] !== 0x2f) {
            return calculateLossy(buffer);
        }
        // Lossy webp stream signature
        const signature = buffer.toString('hex', 3, 6);
        if (chunkHeader === 'VP8L' && signature !== '9d012a') {
            return calculateLossless(buffer);
        }
        throw new TypeError('Invalid WebP');
    }
};


/***/ }),

/***/ 9170:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const execa = __nccwpck_require__(5447);
const isJpg = __nccwpck_require__(7358);
const mozjpeg = __nccwpck_require__(2893);

module.exports = options => async buffer => {
	options = {
		trellis: true,
		trellisDC: true,
		overshoot: true,
		...options
	};

	if (!Buffer.isBuffer(buffer)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isJpg(buffer)) {
		return Promise.resolve(buffer);
	}

	// TODO: Remove these sometime far in the future
	if (options.fastcrush) {
		return Promise.reject(new Error('Option `fastcrush` was renamed to `fastCrush`'));
	}

	if (options.maxmemory) {
		return Promise.reject(new Error('Option `maxmemory` was renamed to `maxMemory`'));
	}

	if (options.notrellis) {
		return Promise.reject(new Error('Option `notrellis` was renamed to `trellis` and inverted'));
	}

	if (options.noovershoot) {
		return Promise.reject(new Error('Option `noovershoot` was renamed to `overshoot` and inverted'));
	}

	const args = [];

	if (typeof options.quality !== 'undefined') {
		args.push('-quality', options.quality);
	}

	if (options.progressive === false) {
		args.push('-baseline');
	}

	if (options.targa) {
		args.push('-targa');
	}

	if (options.revert) {
		args.push('-revert');
	}

	if (options.fastCrush) {
		args.push('-fastcrush');
	}

	if (typeof options.dcScanOpt !== 'undefined') {
		args.push('-dc-scan-opt', options.dcScanOpt);
	}

	if (!options.trellis) {
		args.push('-notrellis');
	}

	if (!options.trellisDC) {
		args.push('-notrellis-dc');
	}

	if (options.tune) {
		args.push(`-tune-${options.tune}`);
	}

	if (!options.overshoot) {
		args.push('-noovershoot');
	}

	if (options.arithmetic) {
		args.push('-arithmetic');
	}

	if (options.dct) {
		args.push('-dct', options.dct);
	}

	if (options.quantBaseline) {
		args.push('-quant-baseline', options.quantBaseline);
	}

	if (typeof options.quantTable !== 'undefined') {
		args.push('-quant-table', options.quantTable);
	}

	if (options.smooth) {
		args.push('-smooth', options.smooth);
	}

	if (options.maxMemory) {
		args.push('-maxmemory', options.maxMemory);
	}

	if (options.sample) {
		args.push('-sample', options.sample.join(','));
	}

	const {stdout} = await execa(mozjpeg, args, {
		encoding: null,
		input: buffer,
		maxBuffer: Infinity
	});

	return stdout;
};


/***/ }),

/***/ 6619:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const execa = __nccwpck_require__(5447);
const isPng = __nccwpck_require__(786);
const isStream = __nccwpck_require__(1554);
const pngquant = __nccwpck_require__(5335);
const ow = __nccwpck_require__(670);

const imageminPngquant = (options = {}) => input => {
	const isBuffer = Buffer.isBuffer(input);

	if (!isBuffer && !isStream(input)) {
		return Promise.reject(new TypeError(`Expected a Buffer or Stream, got ${typeof input}`));
	}

	if (isBuffer && !isPng(input)) {
		return Promise.resolve(input);
	}

	const args = ['-'];

	if (typeof options.speed !== 'undefined') {
		ow(options.speed, ow.number.integer.inRange(1, 11));
		args.push('--speed', options.speed);
	}

	if (typeof options.strip !== 'undefined') {
		ow(options.strip, ow.boolean);

		if (options.strip) {
			args.push('--strip');
		}
	}

	if (typeof options.quality !== 'undefined') {
		ow(options.quality, ow.array.length(2).ofType(ow.number.inRange(0, 1)));
		const [min, max] = options.quality;
		args.push('--quality', `${Math.round(min * 100)}-${Math.round(max * 100)}`);
	}

	if (typeof options.dithering !== 'undefined') {
		ow(options.dithering, ow.any(ow.number.inRange(0, 1), ow.boolean.false));

		if (typeof options.dithering === 'number') {
			args.push(`--floyd=${options.dithering}`);
		} else if (options.dithering === false) {
			args.push('--ordered');
		}
	}

	if (typeof options.posterize !== 'undefined') {
		ow(options.posterize, ow.number);
		args.push('--posterize', options.posterize);
	}

	if (typeof options.verbose !== 'undefined') {
		ow(options.verbose, ow.boolean);
		args.push('--verbose');
	}

	const subprocess = execa(pngquant, args, {
		encoding: null,
		maxBuffer: Infinity,
		input
	});

	const promise = subprocess
		.then(result => result.stdout) // eslint-disable-line promise/prefer-await-to-then
		.catch(error => {
			// We use `error.exitCode` to check for a special condition when running the pngquant binary.
			// See details on handling of "99" code at https://pngquant.org (search for "status code 99").
			if (error.exitCode === 99) {
				return input;
			}

			error.message = error.stderr || error.message;
			throw error;
		});

	subprocess.stdout.then = promise.then.bind(promise); // eslint-disable-line promise/prefer-await-to-then
	subprocess.stdout.catch = promise.catch.bind(promise);

	return subprocess.stdout;
};

module.exports = imageminPngquant;
module.exports.default = imageminPngquant;


/***/ }),

/***/ 3266:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ imagemin)
});

// EXTERNAL MODULE: external "util"
var external_util_ = __nccwpck_require__(1669);
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(5622);
// EXTERNAL MODULE: ./node_modules/graceful-fs/graceful-fs.js
var graceful_fs = __nccwpck_require__(7758);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(5747);
// EXTERNAL MODULE: ./node_modules/file-type/index.js
var file_type = __nccwpck_require__(4930);
// EXTERNAL MODULE: ./node_modules/globby/index.js
var globby = __nccwpck_require__(3398);
;// CONCATENATED MODULE: ./node_modules/p-pipe/index.js
function pPipe(...functions) {
	if (functions.length === 0) {
		throw new Error('Expected at least one argument');
	}

	return async input => {
		let currentValue = input;

		for (const function_ of functions) {
			currentValue = await function_(currentValue); // eslint-disable-line no-await-in-loop
		}

		return currentValue;
	};
}

// EXTERNAL MODULE: ./node_modules/replace-ext/index.js
var replace_ext = __nccwpck_require__(5198);
// EXTERNAL MODULE: ./node_modules/junk/index.js
var junk = __nccwpck_require__(4072);
;// CONCATENATED MODULE: ./node_modules/imagemin/index.js










const readFile = (0,external_util_.promisify)(graceful_fs.readFile);
const writeFile = (0,external_util_.promisify)(graceful_fs.writeFile);

const handleFile = async (sourcePath, {destination, plugins = []}) => {
	if (plugins && !Array.isArray(plugins)) {
		throw new TypeError('The `plugins` option should be an `Array`');
	}

	let data = await readFile(sourcePath);
	data = await (plugins.length > 0 ? pPipe(...plugins)(data) : data);

	const {ext} = await file_type.fromBuffer(data);
	let destinationPath = destination ? external_path_.join(destination, external_path_.basename(sourcePath)) : undefined;
	destinationPath = ext === 'webp' ? replace_ext(destinationPath, '.webp') : destinationPath;

	const returnValue = {
		data,
		sourcePath,
		destinationPath
	};

	if (!destinationPath) {
		return returnValue;
	}

	await external_fs_.promises.mkdir(external_path_.dirname(returnValue.destinationPath), {recursive: true});
	await writeFile(returnValue.destinationPath, returnValue.data);

	return returnValue;
};

async function imagemin(input, {glob = true, ...options} = {}) {
	if (!Array.isArray(input)) {
		throw new TypeError(`Expected an \`Array\`, got \`${typeof input}\``);
	}

	const filePaths = glob ? await globby(input, {onlyFiles: true}) : input;

	return Promise.all(
		filePaths
			.filter(filePath => junk.not(external_path_.basename(filePath)))
			.map(async filePath => {
				try {
					return await handleFile(filePath, options);
				} catch (error) {
					error.message = `Error occurred when handling file: ${input}\n\n${error.stack}`;
					throw error;
				}
			})
	);
}

imagemin.buffer = async (input, {plugins = []} = {}) => {
	if (!Buffer.isBuffer(input)) {
		throw new TypeError(`Expected a \`Buffer\`, got \`${typeof input}\``);
	}

	if (plugins.length === 0) {
		return input;
	}

	return pPipe(...plugins)(input);
};


/***/ }),

/***/ 1239:
/***/ ((module) => {

"use strict";

const lazy = (mod, fn, id) => mod === undefined ? fn(id) : mod;

module.exports = fn => {
	return id => {
		let mod;

		const handler = {
			get: (target, property) => {
				mod = lazy(mod, fn, id);
				return Reflect.get(mod, property);
			},
			apply: (target, thisArg, argumentsList) => {
				mod = lazy(mod, fn, id);
				return Reflect.apply(mod, thisArg, argumentsList);
			},
			construct: (target, argumentsList) => {
				mod = lazy(mod, fn, id);
				return Reflect.construct(mod, argumentsList);
			}
		};

		// eslint-disable-next-line prefer-arrow-callback
		return new Proxy(function () {}, handler);
	};
};


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(1669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 6435:
/***/ ((module) => {

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};


/***/ }),

/***/ 4466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = __nccwpck_require__(6435);
var chars = { '{': '}', '(': ')', '[': ']'};
var strictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
var relaxedRegex = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;

module.exports = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var regex = strictRegex;
  var match;

  // optionally relax regex
  if (options && options.strict === false) {
    regex = relaxedRegex;
  }

  while ((match = regex.exec(str))) {
    if (match[2]) return true;
    var idx = match.index + match[0].length;

    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    var open = match[1];
    var close = open ? chars[open] : null;
    if (open && close) {
      var n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }

    str = str.slice(idx);
  }
  return false;
};


/***/ }),

/***/ 7358:
/***/ ((module) => {

"use strict";

module.exports = buffer => {
	if (!buffer || buffer.length < 3) {
		return false;
	}

	return buffer[0] === 255 &&
		buffer[1] === 216 &&
		buffer[2] === 255;
};


/***/ }),

/***/ 786:
/***/ ((module) => {

"use strict";


module.exports = buffer => {
	if (!buffer || buffer.length < 8) {
		return false;
	}

	return (
		buffer[0] === 0x89 &&
		buffer[1] === 0x50 &&
		buffer[2] === 0x4E &&
		buffer[3] === 0x47 &&
		buffer[4] === 0x0D &&
		buffer[5] === 0x0A &&
		buffer[6] === 0x1A &&
		buffer[7] === 0x0A
	);
};


/***/ }),

/***/ 1554:
/***/ ((module) => {

"use strict";


const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

module.exports = isStream;


/***/ }),

/***/ 7126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(5747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(2001)
} else {
  core = __nccwpck_require__(9728)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 9728:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(5747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 2001:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(5747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 4072:
/***/ ((module, exports) => {

"use strict";


const blacklist = [
	// # All
	'^npm-debug\\.log$', // Error log for npm
	'^\\..*\\.swp$', // Swap file for vim state

	// # macOS
	'^\\.DS_Store$', // Stores custom folder attributes
	'^\\.AppleDouble$', // Stores additional file resources
	'^\\.LSOverride$', // Contains the absolute path to the app to be used
	'^Icon\\r$', // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
	'^\\._.*', // Thumbnail
	'^\\.Spotlight-V100(?:$|\\/)', // Directory that might appear on external disk
	'\\.Trashes', // File that might appear on external disk
	'^__MACOSX$', // Resource fork

	// # Linux
	'~$', // Backup file

	// # Windows
	'^Thumbs\\.db$', // Image file cache
	'^ehthumbs\\.db$', // Folder config file
	'^Desktop\\.ini$', // Stores custom folder attributes
	'@eaDir$' // Synology Diskstation "hidden" folder where the server stores thumbnails
];

exports.re = () => {
	throw new Error('`junk.re` was renamed to `junk.regex`');
};

exports.regex = new RegExp(blacklist.join('|'));

exports.is = filename => exports.regex.test(filename);

exports.not = filename => !exports.is(filename);

// TODO: Remove this for the next major release
exports.default = module.exports;


/***/ }),

/***/ 2621:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { PassThrough } = __nccwpck_require__(2413);

module.exports = function (/*streams...*/) {
  var sources = []
  var output  = new PassThrough({objectMode: true})

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  Array.prototype.slice.call(arguments).forEach(add)

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(output, {end: false})
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source })
    if (!sources.length && output.readable) { output.end() }
  }
}


/***/ }),

/***/ 2578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

/*
 * merge2
 * https://github.com/teambition/merge2
 *
 * Copyright (c) 2014-2020 Teambition
 * Licensed under the MIT license.
 */
const Stream = __nccwpck_require__(2413)
const PassThrough = Stream.PassThrough
const slice = Array.prototype.slice

module.exports = merge2

function merge2 () {
  const streamsQueue = []
  const args = slice.call(arguments)
  let merging = false
  let options = args[args.length - 1]

  if (options && !Array.isArray(options) && options.pipe == null) {
    args.pop()
  } else {
    options = {}
  }

  const doEnd = options.end !== false
  const doPipeError = options.pipeError === true
  if (options.objectMode == null) {
    options.objectMode = true
  }
  if (options.highWaterMark == null) {
    options.highWaterMark = 64 * 1024
  }
  const mergedStream = PassThrough(options)

  function addStream () {
    for (let i = 0, len = arguments.length; i < len; i++) {
      streamsQueue.push(pauseStreams(arguments[i], options))
    }
    mergeStream()
    return this
  }

  function mergeStream () {
    if (merging) {
      return
    }
    merging = true

    let streams = streamsQueue.shift()
    if (!streams) {
      process.nextTick(endStream)
      return
    }
    if (!Array.isArray(streams)) {
      streams = [streams]
    }

    let pipesCount = streams.length + 1

    function next () {
      if (--pipesCount > 0) {
        return
      }
      merging = false
      mergeStream()
    }

    function pipe (stream) {
      function onend () {
        stream.removeListener('merge2UnpipeEnd', onend)
        stream.removeListener('end', onend)
        if (doPipeError) {
          stream.removeListener('error', onerror)
        }
        next()
      }
      function onerror (err) {
        mergedStream.emit('error', err)
      }
      // skip ended stream
      if (stream._readableState.endEmitted) {
        return next()
      }

      stream.on('merge2UnpipeEnd', onend)
      stream.on('end', onend)

      if (doPipeError) {
        stream.on('error', onerror)
      }

      stream.pipe(mergedStream, { end: false })
      // compatible for old stream
      stream.resume()
    }

    for (let i = 0; i < streams.length; i++) {
      pipe(streams[i])
    }

    next()
  }

  function endStream () {
    merging = false
    // emit 'queueDrain' when all streams merged.
    mergedStream.emit('queueDrain')
    if (doEnd) {
      mergedStream.end()
    }
  }

  mergedStream.setMaxListeners(0)
  mergedStream.add = addStream
  mergedStream.on('unpipe', function (stream) {
    stream.emit('merge2UnpipeEnd')
  })

  if (args.length) {
    addStream.apply(null, args)
  }
  return mergedStream
}

// check and pause streams for pipe.
function pauseStreams (streams, options) {
  if (!Array.isArray(streams)) {
    // Backwards-compat with old-style streams
    if (!streams._readableState && streams.pipe) {
      streams = streams.pipe(PassThrough(options))
    }
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error('Only readable stream can be merged.')
    }
    streams.pause()
  } else {
    for (let i = 0, len = streams.length; i < len; i++) {
      streams[i] = pauseStreams(streams[i], options)
    }
  }
  return streams
}


/***/ }),

/***/ 6047:
/***/ ((module) => {

"use strict";


const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;


/***/ }),

/***/ 2893:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = __nccwpck_require__(287).path();


/***/ }),

/***/ 287:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const BinWrapper = __nccwpck_require__(2504);
const pkg = __nccwpck_require__(5976);

const url = `https://raw.githubusercontent.com/imagemin/mozjpeg-bin/v${pkg.version}/vendor/`;

module.exports = new BinWrapper()
	.src(`${url}macos/cjpeg`, 'darwin')
	.src(`${url}linux/cjpeg`, 'linux')
	.src(`${url}win/cjpeg.exe`, 'win32')
	.dest(__nccwpck_require__.ab + "vendor1")
	.use(process.platform === 'win32' ? 'cjpeg.exe' : 'cjpeg');


/***/ }),

/***/ 502:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const pathKey = __nccwpck_require__(539);

const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path.resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path.resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path.delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 9082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const mimicFn = __nccwpck_require__(6047);

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

module.exports = onetime;
// TODO: Remove this for the next major release
module.exports.default = onetime;

module.exports.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};


/***/ }),

/***/ 670:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports=function(e){var t={};function r(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=4)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(6),i=r(15),o=r(2);t.validatorSymbol=Symbol("validators");t.Predicate=class{constructor(e,t={}){this.type=e,this.options=t,this.context={validators:[]},this.context={...this.context,...this.options};const r=this.type[0].toLowerCase()+this.type.slice(1);this.addValidator({message:(e,t)=>`Expected ${(null==t?void 0:t.slice(this.type.length+1))||"argument"} to be of type \`${this.type}\` but received type \`${a.default(e)}\``,validator:e=>a.default[r](e)})}[o.testSymbol](e,t,r){for(const{validator:a,message:i}of this.context.validators){if(!0===this.options.optional&&void 0===e)continue;const o=a(e);if(!0===o)continue;let s=r;throw"function"==typeof r&&(s=r()),s=s?`${this.type} \`${s}\``:this.type,new n.ArgumentError(i(e,s,o),t)}}get[t.validatorSymbol](){return this.context.validators}get not(){return i.not(this)}validate(e){return this.addValidator({message:(e,t,r)=>"string"==typeof r?`(${t}) ${r}`:r(t),validator:t=>{const{message:r,validator:a}=e(t);return!!a||r}})}is(e){return this.addValidator({message:(e,t,r)=>r?`(${t}) ${r}`:`Expected ${t} \`${e}\` to pass custom validation function`,validator:e})}addValidator(e){return this.context.validators.push(e),this}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const{toString:a}=Object.prototype,n=e=>t=>typeof t===e,i=e=>{const t=a.call(e).slice(8,-1);if(t)return t},o=e=>t=>i(t)===e;function s(e){switch(e){case null:return"null";case!0:case!1:return"boolean"}switch(typeof e){case"undefined":return"undefined";case"string":return"string";case"number":return"number";case"bigint":return"bigint";case"symbol":return"symbol"}if(s.function_(e))return"Function";if(s.observable(e))return"Observable";if(s.array(e))return"Array";if(s.buffer(e))return"Buffer";const t=i(e);if(t)return t;if(e instanceof String||e instanceof Boolean||e instanceof Number)throw new TypeError("Please don't use object wrappers for primitive types");return"Object"}s.undefined=n("undefined"),s.string=n("string");const d=n("number");s.number=e=>d(e)&&!s.nan(e),s.bigint=n("bigint"),s.function_=n("function"),s.null_=e=>null===e,s.class_=e=>s.function_(e)&&e.toString().startsWith("class "),s.boolean=e=>!0===e||!1===e,s.symbol=n("symbol"),s.numericString=e=>s.string(e)&&e.length>0&&!Number.isNaN(Number(e)),s.array=Array.isArray,s.buffer=e=>!s.nullOrUndefined(e)&&!s.nullOrUndefined(e.constructor)&&s.function_(e.constructor.isBuffer)&&e.constructor.isBuffer(e),s.nullOrUndefined=e=>s.null_(e)||s.undefined(e),s.object=e=>!s.null_(e)&&("object"==typeof e||s.function_(e)),s.iterable=e=>!s.nullOrUndefined(e)&&s.function_(e[Symbol.iterator]),s.asyncIterable=e=>!s.nullOrUndefined(e)&&s.function_(e[Symbol.asyncIterator]),s.generator=e=>s.iterable(e)&&s.function_(e.next)&&s.function_(e.throw),s.asyncGenerator=e=>s.asyncIterable(e)&&s.function_(e.next)&&s.function_(e.throw),s.nativePromise=e=>o("Promise")(e);s.promise=e=>s.nativePromise(e)||(e=>s.object(e)&&s.function_(e.then)&&s.function_(e.catch))(e),s.generatorFunction=o("GeneratorFunction"),s.asyncGeneratorFunction=e=>"AsyncGeneratorFunction"===i(e),s.asyncFunction=e=>"AsyncFunction"===i(e),s.boundFunction=e=>s.function_(e)&&!e.hasOwnProperty("prototype"),s.regExp=o("RegExp"),s.date=o("Date"),s.error=o("Error"),s.map=e=>o("Map")(e),s.set=e=>o("Set")(e),s.weakMap=e=>o("WeakMap")(e),s.weakSet=e=>o("WeakSet")(e),s.int8Array=o("Int8Array"),s.uint8Array=o("Uint8Array"),s.uint8ClampedArray=o("Uint8ClampedArray"),s.int16Array=o("Int16Array"),s.uint16Array=o("Uint16Array"),s.int32Array=o("Int32Array"),s.uint32Array=o("Uint32Array"),s.float32Array=o("Float32Array"),s.float64Array=o("Float64Array"),s.bigInt64Array=o("BigInt64Array"),s.bigUint64Array=o("BigUint64Array"),s.arrayBuffer=o("ArrayBuffer"),s.sharedArrayBuffer=o("SharedArrayBuffer"),s.dataView=o("DataView"),s.directInstanceOf=(e,t)=>Object.getPrototypeOf(e)===t.prototype,s.urlInstance=e=>o("URL")(e),s.urlString=e=>{if(!s.string(e))return!1;try{return new URL(e),!0}catch(e){return!1}},s.truthy=e=>Boolean(e),s.falsy=e=>!e,s.nan=e=>Number.isNaN(e);const c=new Set(["undefined","string","number","bigint","boolean","symbol"]);s.primitive=e=>s.null_(e)||c.has(typeof e),s.integer=e=>Number.isInteger(e),s.safeInteger=e=>Number.isSafeInteger(e),s.plainObject=e=>{if("Object"!==i(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.getPrototypeOf({})};const u=new Set(["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array"]);s.typedArray=e=>{const t=i(e);return void 0!==t&&u.has(t)};s.arrayLike=e=>!s.nullOrUndefined(e)&&!s.function_(e)&&(e=>s.safeInteger(e)&&e>=0)(e.length),s.inRange=(e,t)=>{if(s.number(t))return e>=Math.min(0,t)&&e<=Math.max(t,0);if(s.array(t)&&2===t.length)return e>=Math.min(...t)&&e<=Math.max(...t);throw new TypeError(`Invalid range: ${JSON.stringify(t)}`)};const l=["innerHTML","ownerDocument","style","attributes","nodeValue"];s.domElement=e=>s.object(e)&&1===e.nodeType&&s.string(e.nodeName)&&!s.plainObject(e)&&l.every(t=>t in e),s.observable=e=>!!e&&(!(!e[Symbol.observable]||e!==e[Symbol.observable]())||!(!e["@@observable"]||e!==e["@@observable"]())),s.nodeStream=e=>s.object(e)&&s.function_(e.pipe)&&!s.observable(e),s.infinite=e=>e===1/0||e===-1/0;const g=e=>t=>s.integer(t)&&Math.abs(t%2)===e;s.evenInteger=g(0),s.oddInteger=g(1),s.emptyArray=e=>s.array(e)&&0===e.length,s.nonEmptyArray=e=>s.array(e)&&e.length>0,s.emptyString=e=>s.string(e)&&0===e.length,s.nonEmptyString=e=>s.string(e)&&e.length>0;s.emptyStringOrWhitespace=e=>s.emptyString(e)||(e=>s.string(e)&&!1===/\S/.test(e))(e),s.emptyObject=e=>s.object(e)&&!s.map(e)&&!s.set(e)&&0===Object.keys(e).length,s.nonEmptyObject=e=>s.object(e)&&!s.map(e)&&!s.set(e)&&Object.keys(e).length>0,s.emptySet=e=>s.set(e)&&0===e.size,s.nonEmptySet=e=>s.set(e)&&e.size>0,s.emptyMap=e=>s.map(e)&&0===e.size,s.nonEmptyMap=e=>s.map(e)&&e.size>0;const f=(e,t,r)=>{if(!1===s.function_(t))throw new TypeError(`Invalid predicate: ${JSON.stringify(t)}`);if(0===r.length)throw new TypeError("Invalid number of values");return e.call(r,t)};s.any=(e,...t)=>(s.array(e)?e:[e]).some(e=>f(Array.prototype.some,e,t)),s.all=(e,...t)=>f(Array.prototype.every,e,t);const y=(e,t,r)=>{if(!e)throw new TypeError(`Expected value which is \`${t}\`, received value of type \`${s(r)}\`.`)};t.assert={undefined:e=>y(s.undefined(e),"undefined",e),string:e=>y(s.string(e),"string",e),number:e=>y(s.number(e),"number",e),bigint:e=>y(s.bigint(e),"bigint",e),function_:e=>y(s.function_(e),"Function",e),null_:e=>y(s.null_(e),"null",e),class_:e=>y(s.class_(e),"Class",e),boolean:e=>y(s.boolean(e),"boolean",e),symbol:e=>y(s.symbol(e),"symbol",e),numericString:e=>y(s.numericString(e),"string with a number",e),array:e=>y(s.array(e),"Array",e),buffer:e=>y(s.buffer(e),"Buffer",e),nullOrUndefined:e=>y(s.nullOrUndefined(e),"null or undefined",e),object:e=>y(s.object(e),"Object",e),iterable:e=>y(s.iterable(e),"Iterable",e),asyncIterable:e=>y(s.asyncIterable(e),"AsyncIterable",e),generator:e=>y(s.generator(e),"Generator",e),asyncGenerator:e=>y(s.asyncGenerator(e),"AsyncGenerator",e),nativePromise:e=>y(s.nativePromise(e),"native Promise",e),promise:e=>y(s.promise(e),"Promise",e),generatorFunction:e=>y(s.generatorFunction(e),"GeneratorFunction",e),asyncGeneratorFunction:e=>y(s.asyncGeneratorFunction(e),"AsyncGeneratorFunction",e),asyncFunction:e=>y(s.asyncFunction(e),"AsyncFunction",e),boundFunction:e=>y(s.boundFunction(e),"Function",e),regExp:e=>y(s.regExp(e),"RegExp",e),date:e=>y(s.date(e),"Date",e),error:e=>y(s.error(e),"Error",e),map:e=>y(s.map(e),"Map",e),set:e=>y(s.set(e),"Set",e),weakMap:e=>y(s.weakMap(e),"WeakMap",e),weakSet:e=>y(s.weakSet(e),"WeakSet",e),int8Array:e=>y(s.int8Array(e),"Int8Array",e),uint8Array:e=>y(s.uint8Array(e),"Uint8Array",e),uint8ClampedArray:e=>y(s.uint8ClampedArray(e),"Uint8ClampedArray",e),int16Array:e=>y(s.int16Array(e),"Int16Array",e),uint16Array:e=>y(s.uint16Array(e),"Uint16Array",e),int32Array:e=>y(s.int32Array(e),"Int32Array",e),uint32Array:e=>y(s.uint32Array(e),"Uint32Array",e),float32Array:e=>y(s.float32Array(e),"Float32Array",e),float64Array:e=>y(s.float64Array(e),"Float64Array",e),bigInt64Array:e=>y(s.bigInt64Array(e),"BigInt64Array",e),bigUint64Array:e=>y(s.bigUint64Array(e),"BigUint64Array",e),arrayBuffer:e=>y(s.arrayBuffer(e),"ArrayBuffer",e),sharedArrayBuffer:e=>y(s.sharedArrayBuffer(e),"SharedArrayBuffer",e),dataView:e=>y(s.dataView(e),"DataView",e),urlInstance:e=>y(s.urlInstance(e),"URL",e),urlString:e=>y(s.urlString(e),"string with a URL",e),truthy:e=>y(s.truthy(e),"truthy",e),falsy:e=>y(s.falsy(e),"falsy",e),nan:e=>y(s.nan(e),"NaN",e),primitive:e=>y(s.primitive(e),"primitive",e),integer:e=>y(s.integer(e),"integer",e),safeInteger:e=>y(s.safeInteger(e),"integer",e),plainObject:e=>y(s.plainObject(e),"plain object",e),typedArray:e=>y(s.typedArray(e),"TypedArray",e),arrayLike:e=>y(s.arrayLike(e),"array-like",e),domElement:e=>y(s.domElement(e),"Element",e),observable:e=>y(s.observable(e),"Observable",e),nodeStream:e=>y(s.nodeStream(e),"Node.js Stream",e),infinite:e=>y(s.infinite(e),"infinite number",e),emptyArray:e=>y(s.emptyArray(e),"empty array",e),nonEmptyArray:e=>y(s.nonEmptyArray(e),"non-empty array",e),emptyString:e=>y(s.emptyString(e),"empty string",e),nonEmptyString:e=>y(s.nonEmptyString(e),"non-empty string",e),emptyStringOrWhitespace:e=>y(s.emptyStringOrWhitespace(e),"empty string or whitespace",e),emptyObject:e=>y(s.emptyObject(e),"empty object",e),nonEmptyObject:e=>y(s.nonEmptyObject(e),"non-empty object",e),emptySet:e=>y(s.emptySet(e),"empty set",e),nonEmptySet:e=>y(s.nonEmptySet(e),"non-empty set",e),emptyMap:e=>y(s.emptyMap(e),"empty map",e),nonEmptyMap:e=>y(s.nonEmptyMap(e),"non-empty map",e),evenInteger:e=>y(s.evenInteger(e),"even integer",e),oddInteger:e=>y(s.oddInteger(e),"odd integer",e),directInstanceOf:(e,t)=>y(s.directInstanceOf(e,t),"T",e),inRange:(e,t)=>y(s.inRange(e,t),"in range",e),any:(e,...t)=>y(s.any(e,...t),"predicate returns truthy for any value",t),all:(e,...t)=>y(s.all(e,...t),"predicate returns truthy for all values",t)},Object.defineProperties(s,{class:{value:s.class_},function:{value:s.function_},null:{value:s.null_}}),Object.defineProperties(t.assert,{class:{value:t.assert.class_},function:{value:t.assert.function_},null:{value:t.assert.null_}}),t.default=s,e.exports=s,e.exports.default=s,e.exports.assert=t.assert},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.testSymbol=Symbol("test"),t.isPredicate=e=>Boolean(e[t.testSymbol])},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=(e,t,r=5)=>{const a=[];for(const n of t)if(!e.has(n)&&(a.push(n),a.length===r))return a;return 0===a.length||a}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(10),n=r(11),i=r(0);t.Predicate=i.Predicate;const o=r(2),s=r(17),d=r(7),c=r(9),u=(e,t,r)=>{if(!o.isPredicate(t)&&"string"!=typeof t)throw new TypeError(`Expected second argument to be a predicate or a string, got \`${typeof t}\``);if(o.isPredicate(t)){const r=a.default();c.default(e,()=>n.inferLabel(r),t)}else c.default(e,t,r)};Object.defineProperties(u,{isValid:{value:(e,t)=>{try{return u(e,t),!0}catch(e){return!1}}},create:{value:(e,t)=>(r,i)=>{if(o.isPredicate(e)){const t=a.default();c.default(r,null!=i?i:()=>n.inferLabel(t),e)}else c.default(r,null!=i?i:e,t)}}}),t.default=d.default(s.default(u));var l=r(7);t.StringPredicate=l.StringPredicate,t.NumberPredicate=l.NumberPredicate,t.BooleanPredicate=l.BooleanPredicate,t.ArrayPredicate=l.ArrayPredicate,t.ObjectPredicate=l.ObjectPredicate,t.DatePredicate=l.DatePredicate,t.ErrorPredicate=l.ErrorPredicate,t.MapPredicate=l.MapPredicate,t.WeakMapPredicate=l.WeakMapPredicate,t.SetPredicate=l.SetPredicate,t.WeakSetPredicate=l.WeakSetPredicate,t.TypedArrayPredicate=l.TypedArrayPredicate,t.ArrayBufferPredicate=l.ArrayBufferPredicate,t.DataViewPredicate=l.DataViewPredicate,t.AnyPredicate=l.AnyPredicate;var g=r(6);t.ArgumentError=g.ArgumentError},function(e,t,r){(function(e){var r="[object Arguments]",a="[object Map]",n="[object Object]",i="[object Set]",o=/^\[object .+?Constructor\]$/,s=/^(?:0|[1-9]\d*)$/,d={};d["[object Float32Array]"]=d["[object Float64Array]"]=d["[object Int8Array]"]=d["[object Int16Array]"]=d["[object Int32Array]"]=d["[object Uint8Array]"]=d["[object Uint8ClampedArray]"]=d["[object Uint16Array]"]=d["[object Uint32Array]"]=!0,d[r]=d["[object Array]"]=d["[object ArrayBuffer]"]=d["[object Boolean]"]=d["[object DataView]"]=d["[object Date]"]=d["[object Error]"]=d["[object Function]"]=d[a]=d["[object Number]"]=d[n]=d["[object RegExp]"]=d[i]=d["[object String]"]=d["[object WeakMap]"]=!1;var c="object"==typeof global&&global&&global.Object===Object&&global,u="object"==typeof self&&self&&self.Object===Object&&self,l=c||u||Function("return this")(),g=t&&!t.nodeType&&t,f=g&&"object"==typeof e&&e&&!e.nodeType&&e,y=f&&f.exports===g,p=y&&c.process,h=function(){try{return p&&p.binding&&p.binding("util")}catch(e){}}(),m=h&&h.isTypedArray;function b(e,t){for(var r=-1,a=null==e?0:e.length;++r<a;)if(t(e[r],r,e))return!0;return!1}function v(e){var t=-1,r=Array(e.size);return e.forEach((function(e,a){r[++t]=[a,e]})),r}function $(e){var t=-1,r=Array(e.size);return e.forEach((function(e){r[++t]=e})),r}var _,x,E,P=Array.prototype,A=Function.prototype,O=Object.prototype,j=l["__core-js_shared__"],S=A.toString,w=O.hasOwnProperty,V=(_=/[^.]+$/.exec(j&&j.keys&&j.keys.IE_PROTO||""))?"Symbol(src)_1."+_:"",M=O.toString,k=RegExp("^"+S.call(w).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),z=y?l.Buffer:void 0,N=l.Symbol,I=l.Uint8Array,L=O.propertyIsEnumerable,B=P.splice,T=N?N.toStringTag:void 0,U=Object.getOwnPropertySymbols,F=z?z.isBuffer:void 0,J=(x=Object.keys,E=Object,function(e){return x(E(e))}),W=he(l,"DataView"),D=he(l,"Map"),R=he(l,"Promise"),q=he(l,"Set"),C=he(l,"WeakMap"),G=he(Object,"create"),K=$e(W),H=$e(D),Q=$e(R),X=$e(q),Y=$e(C),Z=N?N.prototype:void 0,ee=Z?Z.valueOf:void 0;function te(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}function re(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}function ae(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}function ne(e){var t=-1,r=null==e?0:e.length;for(this.__data__=new ae;++t<r;)this.add(e[t])}function ie(e){var t=this.__data__=new re(e);this.size=t.size}function oe(e,t){var r=Ee(e),a=!r&&xe(e),n=!r&&!a&&Pe(e),i=!r&&!a&&!n&&we(e),o=r||a||n||i,s=o?function(e,t){for(var r=-1,a=Array(e);++r<e;)a[r]=t(r);return a}(e.length,String):[],d=s.length;for(var c in e)!t&&!w.call(e,c)||o&&("length"==c||n&&("offset"==c||"parent"==c)||i&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||ve(c,d))||s.push(c);return s}function se(e,t){for(var r=e.length;r--;)if(_e(e[r][0],t))return r;return-1}function de(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":T&&T in Object(e)?function(e){var t=w.call(e,T),r=e[T];try{e[T]=void 0;var a=!0}catch(e){}var n=M.call(e);a&&(t?e[T]=r:delete e[T]);return n}(e):function(e){return M.call(e)}(e)}function ce(e){return Se(e)&&de(e)==r}function ue(e,t,o,s,d){return e===t||(null==e||null==t||!Se(e)&&!Se(t)?e!=e&&t!=t:function(e,t,o,s,d,c){var u=Ee(e),l=Ee(t),g=u?"[object Array]":be(e),f=l?"[object Array]":be(t),y=(g=g==r?n:g)==n,p=(f=f==r?n:f)==n,h=g==f;if(h&&Pe(e)){if(!Pe(t))return!1;u=!0,y=!1}if(h&&!y)return c||(c=new ie),u||we(e)?fe(e,t,o,s,d,c):function(e,t,r,n,o,s,d){switch(r){case"[object DataView]":if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case"[object ArrayBuffer]":return!(e.byteLength!=t.byteLength||!s(new I(e),new I(t)));case"[object Boolean]":case"[object Date]":case"[object Number]":return _e(+e,+t);case"[object Error]":return e.name==t.name&&e.message==t.message;case"[object RegExp]":case"[object String]":return e==t+"";case a:var c=v;case i:var u=1&n;if(c||(c=$),e.size!=t.size&&!u)return!1;var l=d.get(e);if(l)return l==t;n|=2,d.set(e,t);var g=fe(c(e),c(t),n,o,s,d);return d.delete(e),g;case"[object Symbol]":if(ee)return ee.call(e)==ee.call(t)}return!1}(e,t,g,o,s,d,c);if(!(1&o)){var m=y&&w.call(e,"__wrapped__"),b=p&&w.call(t,"__wrapped__");if(m||b){var _=m?e.value():e,x=b?t.value():t;return c||(c=new ie),d(_,x,o,s,c)}}if(!h)return!1;return c||(c=new ie),function(e,t,r,a,n,i){var o=1&r,s=ye(e),d=s.length,c=ye(t).length;if(d!=c&&!o)return!1;var u=d;for(;u--;){var l=s[u];if(!(o?l in t:w.call(t,l)))return!1}var g=i.get(e);if(g&&i.get(t))return g==t;var f=!0;i.set(e,t),i.set(t,e);var y=o;for(;++u<d;){l=s[u];var p=e[l],h=t[l];if(a)var m=o?a(h,p,l,t,e,i):a(p,h,l,e,t,i);if(!(void 0===m?p===h||n(p,h,r,a,i):m)){f=!1;break}y||(y="constructor"==l)}if(f&&!y){var b=e.constructor,v=t.constructor;b!=v&&"constructor"in e&&"constructor"in t&&!("function"==typeof b&&b instanceof b&&"function"==typeof v&&v instanceof v)&&(f=!1)}return i.delete(e),i.delete(t),f}(e,t,o,s,d,c)}(e,t,o,s,ue,d))}function le(e){return!(!je(e)||function(e){return!!V&&V in e}(e))&&(Ae(e)?k:o).test($e(e))}function ge(e){if(r=(t=e)&&t.constructor,a="function"==typeof r&&r.prototype||O,t!==a)return J(e);var t,r,a,n=[];for(var i in Object(e))w.call(e,i)&&"constructor"!=i&&n.push(i);return n}function fe(e,t,r,a,n,i){var o=1&r,s=e.length,d=t.length;if(s!=d&&!(o&&d>s))return!1;var c=i.get(e);if(c&&i.get(t))return c==t;var u=-1,l=!0,g=2&r?new ne:void 0;for(i.set(e,t),i.set(t,e);++u<s;){var f=e[u],y=t[u];if(a)var p=o?a(y,f,u,t,e,i):a(f,y,u,e,t,i);if(void 0!==p){if(p)continue;l=!1;break}if(g){if(!b(t,(function(e,t){if(o=t,!g.has(o)&&(f===e||n(f,e,r,a,i)))return g.push(t);var o}))){l=!1;break}}else if(f!==y&&!n(f,y,r,a,i)){l=!1;break}}return i.delete(e),i.delete(t),l}function ye(e){return function(e,t,r){var a=t(e);return Ee(e)?a:function(e,t){for(var r=-1,a=t.length,n=e.length;++r<a;)e[n+r]=t[r];return e}(a,r(e))}(e,Ve,me)}function pe(e,t){var r,a,n=e.__data__;return("string"==(a=typeof(r=t))||"number"==a||"symbol"==a||"boolean"==a?"__proto__"!==r:null===r)?n["string"==typeof t?"string":"hash"]:n.map}function he(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return le(r)?r:void 0}te.prototype.clear=function(){this.__data__=G?G(null):{},this.size=0},te.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},te.prototype.get=function(e){var t=this.__data__;if(G){var r=t[e];return"__lodash_hash_undefined__"===r?void 0:r}return w.call(t,e)?t[e]:void 0},te.prototype.has=function(e){var t=this.__data__;return G?void 0!==t[e]:w.call(t,e)},te.prototype.set=function(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=G&&void 0===t?"__lodash_hash_undefined__":t,this},re.prototype.clear=function(){this.__data__=[],this.size=0},re.prototype.delete=function(e){var t=this.__data__,r=se(t,e);return!(r<0)&&(r==t.length-1?t.pop():B.call(t,r,1),--this.size,!0)},re.prototype.get=function(e){var t=this.__data__,r=se(t,e);return r<0?void 0:t[r][1]},re.prototype.has=function(e){return se(this.__data__,e)>-1},re.prototype.set=function(e,t){var r=this.__data__,a=se(r,e);return a<0?(++this.size,r.push([e,t])):r[a][1]=t,this},ae.prototype.clear=function(){this.size=0,this.__data__={hash:new te,map:new(D||re),string:new te}},ae.prototype.delete=function(e){var t=pe(this,e).delete(e);return this.size-=t?1:0,t},ae.prototype.get=function(e){return pe(this,e).get(e)},ae.prototype.has=function(e){return pe(this,e).has(e)},ae.prototype.set=function(e,t){var r=pe(this,e),a=r.size;return r.set(e,t),this.size+=r.size==a?0:1,this},ne.prototype.add=ne.prototype.push=function(e){return this.__data__.set(e,"__lodash_hash_undefined__"),this},ne.prototype.has=function(e){return this.__data__.has(e)},ie.prototype.clear=function(){this.__data__=new re,this.size=0},ie.prototype.delete=function(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r},ie.prototype.get=function(e){return this.__data__.get(e)},ie.prototype.has=function(e){return this.__data__.has(e)},ie.prototype.set=function(e,t){var r=this.__data__;if(r instanceof re){var a=r.__data__;if(!D||a.length<199)return a.push([e,t]),this.size=++r.size,this;r=this.__data__=new ae(a)}return r.set(e,t),this.size=r.size,this};var me=U?function(e){return null==e?[]:(e=Object(e),function(e,t){for(var r=-1,a=null==e?0:e.length,n=0,i=[];++r<a;){var o=e[r];t(o,r,e)&&(i[n++]=o)}return i}(U(e),(function(t){return L.call(e,t)})))}:function(){return[]},be=de;function ve(e,t){return!!(t=null==t?9007199254740991:t)&&("number"==typeof e||s.test(e))&&e>-1&&e%1==0&&e<t}function $e(e){if(null!=e){try{return S.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function _e(e,t){return e===t||e!=e&&t!=t}(W&&"[object DataView]"!=be(new W(new ArrayBuffer(1)))||D&&be(new D)!=a||R&&"[object Promise]"!=be(R.resolve())||q&&be(new q)!=i||C&&"[object WeakMap]"!=be(new C))&&(be=function(e){var t=de(e),r=t==n?e.constructor:void 0,o=r?$e(r):"";if(o)switch(o){case K:return"[object DataView]";case H:return a;case Q:return"[object Promise]";case X:return i;case Y:return"[object WeakMap]"}return t});var xe=ce(function(){return arguments}())?ce:function(e){return Se(e)&&w.call(e,"callee")&&!L.call(e,"callee")},Ee=Array.isArray;var Pe=F||function(){return!1};function Ae(e){if(!je(e))return!1;var t=de(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t}function Oe(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991}function je(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Se(e){return null!=e&&"object"==typeof e}var we=m?function(e){return function(t){return e(t)}}(m):function(e){return Se(e)&&Oe(e.length)&&!!d[de(e)]};function Ve(e){return null!=(t=e)&&Oe(t.length)&&!Ae(t)?oe(e):ge(e);var t}e.exports=function(e,t){return ue(e,t)}}).call(this,r(23)(e))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class a extends Error{constructor(e,t){super(e),Error.captureStackTrace?Error.captureStackTrace(this,t):this.stack=(new Error).stack,this.name="ArgumentError"}}t.ArgumentError=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(18);t.StringPredicate=a.StringPredicate;const n=r(20);t.NumberPredicate=n.NumberPredicate;const i=r(21);t.BooleanPredicate=i.BooleanPredicate;const o=r(0),s=r(22);t.ArrayPredicate=s.ArrayPredicate;const d=r(24);t.ObjectPredicate=d.ObjectPredicate;const c=r(29);t.DatePredicate=c.DatePredicate;const u=r(30);t.ErrorPredicate=u.ErrorPredicate;const l=r(31);t.MapPredicate=l.MapPredicate;const g=r(32);t.WeakMapPredicate=g.WeakMapPredicate;const f=r(33);t.SetPredicate=f.SetPredicate;const y=r(34);t.WeakSetPredicate=y.WeakSetPredicate;const p=r(35);t.TypedArrayPredicate=p.TypedArrayPredicate;const h=r(36);t.ArrayBufferPredicate=h.ArrayBufferPredicate;const m=r(37);t.DataViewPredicate=m.DataViewPredicate;const b=r(38);t.AnyPredicate=b.AnyPredicate,t.default=(e,t)=>(Object.defineProperties(e,{string:{get:()=>new a.StringPredicate(t)},number:{get:()=>new n.NumberPredicate(t)},boolean:{get:()=>new i.BooleanPredicate(t)},undefined:{get:()=>new o.Predicate("undefined",t)},null:{get:()=>new o.Predicate("null",t)},nullOrUndefined:{get:()=>new o.Predicate("nullOrUndefined",t)},nan:{get:()=>new o.Predicate("nan",t)},symbol:{get:()=>new o.Predicate("symbol",t)},array:{get:()=>new s.ArrayPredicate(t)},object:{get:()=>new d.ObjectPredicate(t)},date:{get:()=>new c.DatePredicate(t)},error:{get:()=>new u.ErrorPredicate(t)},map:{get:()=>new l.MapPredicate(t)},weakMap:{get:()=>new g.WeakMapPredicate(t)},set:{get:()=>new f.SetPredicate(t)},weakSet:{get:()=>new y.WeakSetPredicate(t)},function:{get:()=>new o.Predicate("Function",t)},buffer:{get:()=>new o.Predicate("Buffer",t)},regExp:{get:()=>new o.Predicate("RegExp",t)},promise:{get:()=>new o.Predicate("Promise",t)},typedArray:{get:()=>new p.TypedArrayPredicate("TypedArray",t)},int8Array:{get:()=>new p.TypedArrayPredicate("Int8Array",t)},uint8Array:{get:()=>new p.TypedArrayPredicate("Uint8Array",t)},uint8ClampedArray:{get:()=>new p.TypedArrayPredicate("Uint8ClampedArray",t)},int16Array:{get:()=>new p.TypedArrayPredicate("Int16Array",t)},uint16Array:{get:()=>new p.TypedArrayPredicate("Uint16Array",t)},int32Array:{get:()=>new p.TypedArrayPredicate("Int32Array",t)},uint32Array:{get:()=>new p.TypedArrayPredicate("Uint32Array",t)},float32Array:{get:()=>new p.TypedArrayPredicate("Float32Array",t)},float64Array:{get:()=>new p.TypedArrayPredicate("Float64Array",t)},arrayBuffer:{get:()=>new h.ArrayBufferPredicate("ArrayBuffer",t)},sharedArrayBuffer:{get:()=>new h.ArrayBufferPredicate("SharedArrayBuffer",t)},dataView:{get:()=>new m.DataViewPredicate(t)},iterable:{get:()=>new o.Predicate("Iterable",t)},any:{value:(...e)=>new b.AnyPredicate(e,t)}}),e)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(4);t.default=(e,t)=>{try{for(const r of e)a.default(r,t);return!0}catch(e){return e.message}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(2);t.default=function e(t,r,n){n[a.testSymbol](t,e,r)}},function(e,t,r){"use strict";const a=()=>{const e=Error.prepareStackTrace;Error.prepareStackTrace=(e,t)=>t;const t=(new Error).stack.slice(1);return Error.prepareStackTrace=e,t};e.exports=a,e.exports.default=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(12),n=r(13),i=r(14),o=/^.*?\((?<label>.*?)[,)]/;t.inferLabel=e=>{var t;if(!i.default)return;const r=e[1],s=r.getFileName(),d=r.getLineNumber(),c=r.getColumnNumber();if(null===s||null===d||null===c)return;let u=[];try{u=a.readFileSync(s,"utf8").split("\n")}catch(e){return}let l=u[d-1];if(!l)return;l=l.slice(c-1);const g=o.exec(l);if(!(null===(t=null==g?void 0:g.groups)||void 0===t?void 0:t.label))return;const f=g.groups.label;return n.default(f)||n.default(f.split(".").pop())?f:void 0}},function(e,t){e.exports=__nccwpck_require__(5747)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=/^[a-z$_][a-z$_\d]*$/i,n=new Set(["undefined","null","true","false","super","this","Infinity","NaN"]);t.default=e=>e&&!n.has(e)&&a.test(e)},function(e,t,r){"use strict";var a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=Boolean(null===(a=null===process||void 0===process?void 0:process.versions)||void 0===a?void 0:a.node)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(16),n=r(0);t.not=e=>{const t=e.addValidator;return e.addValidator=r=>{const{validator:i,message:o,negatedMessage:s}=r,d=a.default();return r.message=(e,t)=>s?s(e,t):o(e,d).replace(/ to /,"$&not ").replace(d,t),r.validator=e=>!i(e),e[n.validatorSymbol].push(r),e.addValidator=t,e},e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=()=>Math.random().toString(16).slice(2)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(7);t.default=e=>(Object.defineProperties(e,{optional:{get:()=>a.default({},{optional:!0})}}),e)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(19),i=r(0);class o extends i.Predicate{constructor(e){super("string",e)}length(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have length \`${e}\`, got \`${t}\``,validator:t=>t.length===e})}minLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum length of \`${e}\`, got \`${t}\``,validator:t=>t.length>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum length of \`${e-1}\`, got \`${t}\``})}maxLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum length of \`${e}\`, got \`${t}\``,validator:t=>t.length<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum length of \`${e+1}\`, got \`${t}\``})}matches(e){return this.addValidator({message:(t,r)=>`Expected ${r} to match \`${e}\`, got \`${t}\``,validator:t=>e.test(t)})}startsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to start with \`${e}\`, got \`${t}\``,validator:t=>t.startsWith(e)})}endsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to end with \`${e}\`, got \`${t}\``,validator:t=>t.endsWith(e)})}includes(e){return this.addValidator({message:(t,r)=>`Expected ${r} to include \`${e}\`, got \`${t}\``,validator:t=>t.includes(e)})}oneOf(e){return this.addValidator({message:(t,r)=>{let a=JSON.stringify(e);if(e.length>10){const t=e.length-10;a=JSON.stringify(e.slice(0,10)).replace(/]$/,`,…+${t} more]`)}return`Expected ${r} to be one of \`${a}\`, got \`${t}\``},validator:t=>e.includes(t)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${e}\``,validator:e=>""===e})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>""!==e})}equals(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be equal to \`${e}\`, got \`${t}\``,validator:t=>t===e})}get alphanumeric(){return this.addValidator({message:(e,t)=>`Expected ${t} to be alphanumeric, got \`${e}\``,validator:e=>/^[a-z\d]+$/i.test(e)})}get alphabetical(){return this.addValidator({message:(e,t)=>`Expected ${t} to be alphabetical, got \`${e}\``,validator:e=>/^[a-z]+$/gi.test(e)})}get numeric(){return this.addValidator({message:(e,t)=>`Expected ${t} to be numeric, got \`${e}\``,validator:e=>/^(?:\+|-)?\d+$/i.test(e)})}get date(){return this.addValidator({message:(e,t)=>`Expected ${t} to be a date, got \`${e}\``,validator:n})}get lowercase(){return this.addValidator({message:(e,t)=>`Expected ${t} to be lowercase, got \`${e}\``,validator:e=>""!==e.trim()&&e===e.toLowerCase()})}get uppercase(){return this.addValidator({message:(e,t)=>`Expected ${t} to be uppercase, got \`${e}\``,validator:e=>""!==e.trim()&&e===e.toUpperCase()})}get url(){return this.addValidator({message:(e,t)=>`Expected ${t} to be a URL, got \`${e}\``,validator:a.default.urlString})}}t.StringPredicate=o},function(e,t,r){"use strict";e.exports=function(e){return!isNaN(Date.parse(e))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(0);class i extends n.Predicate{constructor(e){super("number",e)}inRange(e,t){return this.addValidator({message:(r,a)=>`Expected ${a} to be in range [${e}..${t}], got ${r}`,validator:r=>a.default.inRange(r,[e,t])})}greaterThan(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be greater than ${e}, got ${t}`,validator:t=>t>e})}greaterThanOrEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be greater than or equal to ${e}, got ${t}`,validator:t=>t>=e})}lessThan(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be less than ${e}, got ${t}`,validator:t=>t<e})}lessThanOrEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be less than or equal to ${e}, got ${t}`,validator:t=>t<=e})}equal(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be equal to ${e}, got ${t}`,validator:t=>t===e})}oneOf(e){return this.addValidator({message:(t,r)=>{let a=JSON.stringify(e);if(e.length>10){const t=e.length-10;a=JSON.stringify(e.slice(0,10)).replace(/]$/,`,…+${t} more]`)}return`Expected ${r} to be one of \`${a}\`, got ${t}`},validator:t=>e.includes(t)})}get integer(){return this.addValidator({message:(e,t)=>`Expected ${t} to be an integer, got ${e}`,validator:e=>a.default.integer(e)})}get finite(){return this.addValidator({message:(e,t)=>`Expected ${t} to be finite, got ${e}`,validator:e=>!a.default.infinite(e)})}get infinite(){return this.addValidator({message:(e,t)=>`Expected ${t} to be infinite, got ${e}`,validator:e=>a.default.infinite(e)})}get positive(){return this.addValidator({message:(e,t)=>`Expected ${t} to be positive, got ${e}`,validator:e=>e>0})}get negative(){return this.addValidator({message:(e,t)=>`Expected ${t} to be negative, got ${e}`,validator:e=>e<0})}get integerOrInfinite(){return this.addValidator({message:(e,t)=>`Expected ${t} to be an integer or infinite, got ${e}`,validator:e=>a.default.integer(e)||a.default.infinite(e)})}get uint8(){return this.integer.inRange(0,255)}get uint16(){return this.integer.inRange(0,65535)}get uint32(){return this.integer.inRange(0,4294967295)}get int8(){return this.integer.inRange(-128,127)}get int16(){return this.integer.inRange(-32768,32767)}get int32(){return this.integer.inRange(-2147483648,2147483647)}}t.NumberPredicate=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("boolean",e)}get true(){return this.addValidator({message:(e,t)=>`Expected ${t} to be true, got ${e}`,validator:e=>e})}get false(){return this.addValidator({message:(e,t)=>`Expected ${t} to be false, got ${e}`,validator:e=>!e})}}t.BooleanPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(5),n=r(0),i=r(4);class o extends n.Predicate{constructor(e){super("array",e)}length(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have length \`${e}\`, got \`${t.length}\``,validator:t=>t.length===e})}minLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum length of \`${e}\`, got \`${t.length}\``,validator:t=>t.length>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum length of \`${e-1}\`, got \`${t.length}\``})}maxLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum length of \`${e}\`, got \`${t.length}\``,validator:t=>t.length<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum length of \`${e+1}\`, got \`${t.length}\``})}startsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to start with \`${e}\`, got \`${t[0]}\``,validator:t=>t[0]===e})}endsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to end with \`${e}\`, got \`${t[t.length-1]}\``,validator:t=>t[t.length-1]===e})}includes(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to include all elements of \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>e.every(e=>t.includes(e))})}includesAny(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to include any element of \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>e.some(e=>t.includes(e))})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify(e)}\``,validator:e=>0===e.length})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>e.length>0})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>a(t,e)})}ofType(e){let t;return this.addValidator({message:(e,r)=>`(${r}) ${t}`,validator:r=>{try{for(const t of r)i.default(t,e);return!0}catch(e){return t=e.message,!1}}})}}t.ArrayPredicate=o},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(25),i=r(5),o=r(3),s=r(8),d=r(27),c=r(28),u=r(0);class l extends u.Predicate{constructor(e){super("object",e)}get plain(){return this.addValidator({message:(e,t)=>`Expected ${t} to be a plain object`,validator:e=>a.default.plainObject(e)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify(e)}\``,validator:e=>0===Object.keys(e).length})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>Object.keys(e).length>0})}valuesOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>s.default(Object.values(t),e)})}deepValuesOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>d.default(t,e)})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>i(t,e)})}instanceOf(e){return this.addValidator({message:(t,r)=>{let{name:a}=t.constructor;return a&&"Object"!==a||(a=JSON.stringify(t)),`Expected ${r} \`${a}\` to be of type \`${e.name}\``},validator:t=>t instanceof e})}hasKeys(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have keys \`${JSON.stringify(r)}\``,validator:t=>o.default({has:e=>n.has(t,e)},e)})}hasAnyKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any key of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>n.has(t,e))})}partialShape(e){return this.addValidator({message:(e,t,r)=>`${r.replace("Expected","Expected property")} in ${t}`,validator:t=>c.partial(t,e)})}exactShape(e){return this.addValidator({message:(e,t,r)=>`${r.replace("Expected","Expected property")} in ${t}`,validator:t=>c.exact(t,e)})}}t.ObjectPredicate=l},function(e,t,r){"use strict";const a=r(26),n=["__proto__","prototype","constructor"];function i(e){const t=e.split("."),r=[];for(let e=0;e<t.length;e++){let a=t[e];for(;"\\"===a[a.length-1]&&void 0!==t[e+1];)a=a.slice(0,-1)+".",a+=t[++e];r.push(a)}return r.some(e=>n.includes(e))?[]:r}e.exports={get(e,t,r){if(!a(e)||"string"!=typeof t)return void 0===r?e:r;const n=i(t);if(0!==n.length){for(let t=0;t<n.length;t++){if(!Object.prototype.propertyIsEnumerable.call(e,n[t]))return r;if(null==(e=e[n[t]])){if(t!==n.length-1)return r;break}}return e}},set(e,t,r){if(!a(e)||"string"!=typeof t)return e;const n=e,o=i(t);for(let t=0;t<o.length;t++){const n=o[t];a(e[n])||(e[n]={}),t===o.length-1&&(e[n]=r),e=e[n]}return n},delete(e,t){if(!a(e)||"string"!=typeof t)return;const r=i(t);for(let t=0;t<r.length;t++){const n=r[t];if(t===r.length-1)return void delete e[n];if(e=e[n],!a(e))return}},has(e,t){if(!a(e)||"string"!=typeof t)return!1;const r=i(t);if(0===r.length)return!1;for(let t=0;t<r.length;t++){if(!a(e))return!1;if(!(r[t]in e))return!1;e=e[r[t]]}return!0}}},function(e,t,r){"use strict";e.exports=e=>{const t=typeof e;return null!==e&&("object"===t||"function"===t)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(4),i=(e,t)=>a.default.plainObject(e)?Object.values(e).every(e=>i(e,t)):(n.default(e,t),!0);t.default=(e,t)=>{try{return i(e,t)}catch(e){return e.message}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(9),i=r(2);t.partial=function e(t,r,o){try{for(const s of Object.keys(r)){const d=o?`${o}.${s}`:s;if(i.isPredicate(r[s]))n.default(t[s],d,r[s]);else if(a.default.plainObject(r[s])){const a=e(t[s],r[s],d);if(!0!==a)return a}}return!0}catch(e){return e.message}},t.exact=function e(t,r,o){try{const s=new Set(Object.keys(t));for(const d of Object.keys(r)){s.delete(d);const c=o?`${o}.${d}`:d;if(i.isPredicate(r[d]))n.default(t[d],c,r[d]);else if(a.default.plainObject(r[d])){if(!Object.prototype.hasOwnProperty.call(t,d))return`Expected \`${c}\` to exist`;const a=e(t[d],r[d],c);if(!0!==a)return a}}if(s.size>0){const e=[...s.keys()][0];return`Did not expect property \`${o?`${o}.${e}`:e}\` to exist, got \`${t[e]}\``}return!0}catch(e){return e.message}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("date",e)}before(e){return this.addValidator({message:(t,r)=>`Expected ${r} ${t.toISOString()} to be before ${e.toISOString()}`,validator:t=>t.getTime()<e.getTime()})}after(e){return this.addValidator({message:(t,r)=>`Expected ${r} ${t.toISOString()} to be after ${e.toISOString()}`,validator:t=>t.getTime()>e.getTime()})}}t.DatePredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("error",e)}name(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have name \`${e}\`, got \`${t.name}\``,validator:t=>t.name===e})}message(e){return this.addValidator({message:(t,r)=>`Expected ${r} message to be \`${e}\`, got \`${t.message}\``,validator:t=>t.message===e})}messageIncludes(e){return this.addValidator({message:(t,r)=>`Expected ${r} message to include \`${e}\`, got \`${t.message}\``,validator:t=>t.message.includes(e)})}hasKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} message to have keys \`${e.join("`, `")}\``,validator:t=>e.every(e=>Object.prototype.hasOwnProperty.call(t,e))})}instanceOf(e){return this.addValidator({message:(t,r)=>`Expected ${r} \`${t.name}\` to be of type \`${e.name}\``,validator:t=>t instanceof e})}get typeError(){return this.instanceOf(TypeError)}get evalError(){return this.instanceOf(EvalError)}get rangeError(){return this.instanceOf(RangeError)}get referenceError(){return this.instanceOf(ReferenceError)}get syntaxError(){return this.instanceOf(SyntaxError)}get uriError(){return this.instanceOf(URIError)}}t.ErrorPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(5),n=r(3),i=r(8),o=r(0);class s extends o.Predicate{constructor(e){super("Map",e)}size(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have size \`${e}\`, got \`${t.size}\``,validator:t=>t.size===e})}minSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum size of \`${e-1}\`, got \`${t.size}\``})}maxSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum size of \`${e+1}\`, got \`${t.size}\``})}hasKeys(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have keys \`${JSON.stringify(r)}\``,validator:t=>n.default(t,e)})}hasAnyKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any key of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}hasValues(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have values \`${JSON.stringify(r)}\``,validator:t=>n.default(new Set(t.values()),e)})}hasAnyValues(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any value of \`${JSON.stringify(e)}\``,validator:t=>{const r=new Set(t.values());return e.some(e=>r.has(e))}})}keysOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>i.default(t.keys(),e)})}valuesOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>i.default(t.values(),e)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify([...e])}\``,validator:e=>0===e.size})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>e.size>0})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify([...e])}\`, got \`${JSON.stringify([...t])}\``,validator:t=>a(t,e)})}}t.MapPredicate=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(3),n=r(0);class i extends n.Predicate{constructor(e){super("WeakMap",e)}hasKeys(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have keys \`${JSON.stringify(r)}\``,validator:t=>a.default(t,e)})}hasAnyKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any key of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}}t.WeakMapPredicate=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(5),n=r(3),i=r(8),o=r(0);class s extends o.Predicate{constructor(e){super("Set",e)}size(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have size \`${e}\`, got \`${t.size}\``,validator:t=>t.size===e})}minSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum size of \`${e-1}\`, got \`${t.size}\``})}maxSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum size of \`${e+1}\`, got \`${t.size}\``})}has(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have items \`${JSON.stringify(r)}\``,validator:t=>n.default(t,e)})}hasAny(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any item of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}ofType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>i.default(t,e)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify([...e])}\``,validator:e=>0===e.size})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>e.size>0})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify([...e])}\`, got \`${JSON.stringify([...t])}\``,validator:t=>a(t,e)})}}t.SetPredicate=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(3),n=r(0);class i extends n.Predicate{constructor(e){super("WeakSet",e)}has(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have items \`${JSON.stringify(r)}\``,validator:t=>a.default(t,e)})}hasAny(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any item of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}}t.WeakSetPredicate=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{byteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength===e})}minByteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum byte length of \`${e-1}\`, got \`${t.byteLength}\``})}maxByteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum byte length of \`${e+1}\`, got \`${t.byteLength}\``})}length(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have length \`${e}\`, got \`${t.length}\``,validator:t=>t.length===e})}minLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum length of \`${e}\`, got \`${t.length}\``,validator:t=>t.length>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum length of \`${e-1}\`, got \`${t.length}\``})}maxLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum length of \`${e}\`, got \`${t.length}\``,validator:t=>t.length<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum length of \`${e+1}\`, got \`${t.length}\``})}}t.TypedArrayPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{byteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength===e})}minByteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum byte length of \`${e-1}\`, got \`${t.byteLength}\``})}maxByteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum byte length of \`${e+1}\`, got \`${t.byteLength}\``})}}t.ArrayBufferPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("DataView",e)}byteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength===e})}minByteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum byte length of \`${e-1}\`, got \`${t.byteLength}\``})}maxByteLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum byte length of \`${e}\`, got \`${t.byteLength}\``,validator:t=>t.byteLength<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum byte length of \`${e+1}\`, got \`${t.byteLength}\``})}}t.DataViewPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(6),n=r(2);t.AnyPredicate=class{constructor(e,t={}){this.predicates=e,this.options=t}[n.testSymbol](e,t,r){const n=["Any predicate failed with the following errors:"];for(const a of this.predicates)try{return void t(e,r,a)}catch(t){if(void 0===e&&!0===this.options.optional)return;n.push(`- ${t.message}`)}throw new a.ArgumentError(n.join("\n"),t)}}}]);const __export__=module.exports;module.exports=__export__.default,Object.assign(module.exports,__export__);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 539:
/***/ ((module) => {

"use strict";


const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports.default = pathKey;


/***/ }),

/***/ 7770:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndOfStreamError = exports.defaultMessages = void 0;
exports.defaultMessages = 'End-Of-Stream';
/**
 * Thrown on read operation of the end of file or stream has been reached
 */
class EndOfStreamError extends Error {
    constructor() {
        super(exports.defaultMessages);
    }
}
exports.EndOfStreamError = EndOfStreamError;


/***/ }),

/***/ 3752:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StreamReader = exports.EndOfStreamError = void 0;
const EndOfFileStream_1 = __nccwpck_require__(7770);
var EndOfFileStream_2 = __nccwpck_require__(7770);
Object.defineProperty(exports, "EndOfStreamError", ({ enumerable: true, get: function () { return EndOfFileStream_2.EndOfStreamError; } }));
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
const maxStreamReadSize = 1 * 1024 * 1024; // Maximum request length on read-stream operation
class StreamReader {
    constructor(s) {
        this.s = s;
        this.endOfStream = false;
        /**
         * Store peeked data
         * @type {Array}
         */
        this.peekQueue = [];
        if (!s.read || !s.once) {
            throw new Error('Expected an instance of stream.Readable');
        }
        this.s.once('end', () => this.reject(new EndOfFileStream_1.EndOfStreamError()));
        this.s.once('error', err => this.reject(err));
        this.s.once('close', () => this.reject(new Error('Stream closed')));
    }
    /**
     * Read ahead (peek) from stream. Subsequent read or peeks will return the same data
     * @param buffer - Buffer to store data read from stream in
     * @param offset - Offset buffer
     * @param length - Number of bytes to read
     * @returns Number of bytes peeked
     */
    async peek(buffer, offset, length) {
        const bytesRead = await this.read(buffer, offset, length);
        this.peekQueue.push(buffer.slice(offset, offset + bytesRead)); // Put read data back to peek buffer
        return bytesRead;
    }
    /**
     * Read chunk from stream
     * @param buffer - Target buffer to store data read from stream in
     * @param offset - Offset of target buffer
     * @param length - Number of bytes to read
     * @returns Number of bytes read
     */
    async read(buffer, offset, length) {
        if (length === 0) {
            return 0;
        }
        if (this.peekQueue.length === 0 && this.endOfStream) {
            throw new EndOfFileStream_1.EndOfStreamError();
        }
        let remaining = length;
        let bytesRead = 0;
        // consume peeked data first
        while (this.peekQueue.length > 0 && remaining > 0) {
            const peekData = this.peekQueue.pop(); // Front of queue
            const lenCopy = Math.min(peekData.length, remaining);
            peekData.copy(buffer, offset + bytesRead, 0, lenCopy);
            bytesRead += lenCopy;
            remaining -= lenCopy;
            if (lenCopy < peekData.length) {
                // remainder back to queue
                this.peekQueue.push(peekData.slice(lenCopy));
            }
        }
        // continue reading from stream if required
        while (remaining > 0 && !this.endOfStream) {
            const reqLen = Math.min(remaining, maxStreamReadSize);
            const chunkLen = await this._read(buffer, offset + bytesRead, reqLen);
            bytesRead += chunkLen;
            if (chunkLen < reqLen)
                break;
            remaining -= chunkLen;
        }
        return bytesRead;
    }
    /**
     * Read chunk from stream
     * @param buffer Buffer to store data read from stream in
     * @param offset Offset buffer
     * @param length Number of bytes to read
     * @returns Number of bytes read
     */
    async _read(buffer, offset, length) {
        if (this.request)
            throw new Error('Concurrent read operation?');
        const readBuffer = this.s.read(length);
        if (readBuffer) {
            readBuffer.copy(buffer, offset);
            return readBuffer.length;
        }
        else {
            this.request = {
                buffer,
                offset,
                length,
                deferred: new Deferred()
            };
            this.s.once('readable', () => {
                this.tryRead();
            });
            return this.request.deferred.promise.then(n => {
                this.request = null;
                return n;
            }, err => {
                this.request = null;
                throw err;
            });
        }
    }
    tryRead() {
        const readBuffer = this.s.read(this.request.length);
        if (readBuffer) {
            readBuffer.copy(this.request.buffer, this.request.offset);
            this.request.deferred.resolve(readBuffer.length);
        }
        else {
            this.s.once('readable', () => {
                this.tryRead();
            });
        }
    }
    reject(err) {
        this.endOfStream = true;
        if (this.request) {
            this.request.deferred.reject(err);
            this.request = null;
        }
    }
}
exports.StreamReader = StreamReader;


/***/ }),

/***/ 8569:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(3322);


/***/ }),

/***/ 6099:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 2139:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const constants = __nccwpck_require__(6099);
const utils = __nccwpck_require__(479);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 3322:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const scan = __nccwpck_require__(2429);
const parse = __nccwpck_require__(2139);
const utils = __nccwpck_require__(479);
const constants = __nccwpck_require__(6099);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 2429:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const utils = __nccwpck_require__(479);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __nccwpck_require__(6099);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 479:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __nccwpck_require__(6099);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ 5335:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = __nccwpck_require__(8515).path();


/***/ }),

/***/ 8515:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const BinWrapper = __nccwpck_require__(2504);
const pkg = __nccwpck_require__(2749);

const url = `https://raw.githubusercontent.com/imagemin/pngquant-bin/v${pkg.version}/vendor/`;

module.exports = new BinWrapper()
	.src(`${url}macos/pngquant`, 'darwin')
	.src(`${url}linux/x86/pngquant`, 'linux', 'x86')
	.src(`${url}linux/x64/pngquant`, 'linux', 'x64')
	.src(`${url}freebsd/x64/pngquant`, 'freebsd', 'x64')
	.src(`${url}win/pngquant.exe`, 'win32')
	.dest(__nccwpck_require__.ab + "vendor2")
	.use(process.platform === 'win32' ? 'pngquant.exe' : 'pngquant');


/***/ }),

/***/ 8341:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var once = __nccwpck_require__(1223)
var eos = __nccwpck_require__(1205)
var fs = __nccwpck_require__(5747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 3795:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var inherits = __nccwpck_require__(4124)
var EventEmitter = __nccwpck_require__(8614).EventEmitter

module.exports = Queue
module.exports.default = Queue

function Queue (options) {
  if (!(this instanceof Queue)) {
    return new Queue(options)
  }

  EventEmitter.call(this)
  options = options || {}
  this.concurrency = options.concurrency || Infinity
  this.timeout = options.timeout || 0
  this.autostart = options.autostart || false
  this.results = options.results || null
  this.pending = 0
  this.session = 0
  this.running = false
  this.jobs = []
  this.timers = {}
}
inherits(Queue, EventEmitter)

var arrayMethods = [
  'pop',
  'shift',
  'indexOf',
  'lastIndexOf'
]

arrayMethods.forEach(function (method) {
  Queue.prototype[method] = function () {
    return Array.prototype[method].apply(this.jobs, arguments)
  }
})

Queue.prototype.slice = function (begin, end) {
  this.jobs = this.jobs.slice(begin, end)
  return this
}

Queue.prototype.reverse = function () {
  this.jobs.reverse()
  return this
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
]

arrayAddMethods.forEach(function (method) {
  Queue.prototype[method] = function () {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments)
    if (this.autostart) {
      this.start()
    }
    return methodResult
  }
})

Object.defineProperty(Queue.prototype, 'length', {
  get: function () {
    return this.pending + this.jobs.length
  }
})

Queue.prototype.start = function (cb) {
  if (cb) {
    callOnErrorOrEnd.call(this, cb)
  }

  this.running = true

  if (this.pending >= this.concurrency) {
    return
  }

  if (this.jobs.length === 0) {
    if (this.pending === 0) {
      done.call(this)
    }
    return
  }

  var self = this
  var job = this.jobs.shift()
  var once = true
  var session = this.session
  var timeoutId = null
  var didTimeout = false
  var resultIndex = null
  var timeout = job.hasOwnProperty('timeout') ? job.timeout : this.timeout

  function next (err, result) {
    if (once && self.session === session) {
      once = false
      self.pending--
      if (timeoutId !== null) {
        delete self.timers[timeoutId]
        clearTimeout(timeoutId)
      }

      if (err) {
        self.emit('error', err, job)
      } else if (didTimeout === false) {
        if (resultIndex !== null) {
          self.results[resultIndex] = Array.prototype.slice.call(arguments, 1)
        }
        self.emit('success', result, job)
      }

      if (self.session === session) {
        if (self.pending === 0 && self.jobs.length === 0) {
          done.call(self)
        } else if (self.running) {
          self.start()
        }
      }
    }
  }

  if (timeout) {
    timeoutId = setTimeout(function () {
      didTimeout = true
      if (self.listeners('timeout').length > 0) {
        self.emit('timeout', next, job)
      } else {
        next()
      }
    }, timeout)
    this.timers[timeoutId] = timeoutId
  }

  if (this.results) {
    resultIndex = this.results.length
    this.results[resultIndex] = null
  }

  this.pending++
  self.emit('start', job)
  var promise = job(next)
  if (promise && promise.then && typeof promise.then === 'function') {
    promise.then(function (result) {
      return next(null, result)
    }).catch(function (err) {
      return next(err || true)
    })
  }

  if (this.running && this.jobs.length > 0) {
    this.start()
  }
}

Queue.prototype.stop = function () {
  this.running = false
}

Queue.prototype.end = function (err) {
  clearTimers.call(this)
  this.jobs.length = 0
  this.pending = 0
  done.call(this, err)
}

function clearTimers () {
  for (var key in this.timers) {
    var timeoutId = this.timers[key]
    delete this.timers[key]
    clearTimeout(timeoutId)
  }
}

function callOnErrorOrEnd (cb) {
  var self = this
  this.on('error', onerror)
  this.on('end', onend)

  function onerror (err) { self.end(err) }
  function onend (err) {
    self.removeListener('error', onerror)
    self.removeListener('end', onend)
    cb(err, this.results)
  }
}

function done (err) {
  this.session++
  this.running = false
  this.emit('end', err)
}


/***/ }),

/***/ 5198:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var path = __nccwpck_require__(5622);

function replaceExt(npath, ext) {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  var nFileName = path.basename(npath, path.extname(npath)) + ext;
  var nFilepath = path.join(path.dirname(npath), nFileName);

  // Because `path.join` removes the head './' from the given path.
  // This removal can cause a problem when passing the result to `require` or
  // `import`.
  if (startsWithSingleDot(npath)) {
    return '.' + path.sep + nFilepath;
  }

  return nFilepath;
}

function startsWithSingleDot(fpath) {
  var first2chars = fpath.slice(0, 2);
  return first2chars === '.' + path.sep || first2chars === './';
}

module.exports = replaceExt;


/***/ }),

/***/ 2113:
/***/ ((module) => {

"use strict";


function reusify (Constructor) {
  var head = new Constructor()
  var tail = head

  function get () {
    var current = head

    if (current.next) {
      head = current.next
    } else {
      head = new Constructor()
      tail = head
    }

    current.next = null

    return current
  }

  function release (obj) {
    tail.next = obj
    tail = obj
  }

  return {
    get: get,
    release: release
  }
}

module.exports = reusify


/***/ }),

/***/ 5288:
/***/ ((module) => {

/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = runParallel

function runParallel (tasks, cb) {
  var results, pending, keys
  var isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err)
    }
  }

  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result) })
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result) })
    })
  }

  isSync = false
}


/***/ }),

/***/ 6193:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const is = __nccwpck_require__(768);

/**
 * Boolean operations for bandbool.
 * @private
 */
const bool = {
  and: 'and',
  or: 'or',
  eor: 'eor'
};

/**
 * Remove alpha channel, if any. This is a no-op if the image does not have an alpha channel.
 *
 * See also {@link /api-operation#flatten|flatten}.
 *
 * @example
 * sharp('rgba.png')
 *   .removeAlpha()
 *   .toFile('rgb.png', function(err, info) {
 *     // rgb.png is a 3 channel image without an alpha channel
 *   });
 *
 * @returns {Sharp}
 */
function removeAlpha () {
  this.options.removeAlpha = true;
  return this;
}

/**
 * Ensure the output image has an alpha transparency channel.
 * If missing, the added alpha channel will have the specified
 * transparency level, defaulting to fully-opaque (1).
 * This is a no-op if the image already has an alpha channel.
 *
 * @since 0.21.2
 *
 * @example
 * // rgba.png will be a 4 channel image with a fully-opaque alpha channel
 * await sharp('rgb.jpg')
 *   .ensureAlpha()
 *   .toFile('rgba.png')
 *
 * @example
 * // rgba is a 4 channel image with a fully-transparent alpha channel
 * const rgba = await sharp(rgb)
 *   .ensureAlpha(0)
 *   .toBuffer();
 *
 * @param {number} [alpha=1] - alpha transparency level (0=fully-transparent, 1=fully-opaque)
 * @returns {Sharp}
 * @throws {Error} Invalid alpha transparency level
 */
function ensureAlpha (alpha) {
  if (is.defined(alpha)) {
    if (is.number(alpha) && is.inRange(alpha, 0, 1)) {
      this.options.ensureAlpha = alpha;
    } else {
      throw is.invalidParameterError('alpha', 'number between 0 and 1', alpha);
    }
  } else {
    this.options.ensureAlpha = 1;
  }
  return this;
}

/**
 * Extract a single channel from a multi-channel image.
 *
 * @example
 * sharp(input)
 *   .extractChannel('green')
 *   .toColourspace('b-w')
 *   .toFile('green.jpg', function(err, info) {
 *     // info.channels === 1
 *     // green.jpg is a greyscale image containing the green channel of the input
 *    });
 *
 * @param {number|string} channel - zero-indexed channel/band number to extract, or `red`, `green`, `blue` or `alpha`.
 * @returns {Sharp}
 * @throws {Error} Invalid channel
 */
function extractChannel (channel) {
  const channelMap = { red: 0, green: 1, blue: 2, alpha: 3 };
  if (Object.keys(channelMap).includes(channel)) {
    channel = channelMap[channel];
  }
  if (is.integer(channel) && is.inRange(channel, 0, 4)) {
    this.options.extractChannel = channel;
  } else {
    throw is.invalidParameterError('channel', 'integer or one of: red, green, blue, alpha', channel);
  }
  return this;
}

/**
 * Join one or more channels to the image.
 * The meaning of the added channels depends on the output colourspace, set with `toColourspace()`.
 * By default the output image will be web-friendly sRGB, with additional channels interpreted as alpha channels.
 * Channel ordering follows vips convention:
 * - sRGB: 0: Red, 1: Green, 2: Blue, 3: Alpha.
 * - CMYK: 0: Magenta, 1: Cyan, 2: Yellow, 3: Black, 4: Alpha.
 *
 * Buffers may be any of the image formats supported by sharp.
 * For raw pixel input, the `options` object should contain a `raw` attribute, which follows the format of the attribute of the same name in the `sharp()` constructor.
 *
 * @param {Array<string|Buffer>|string|Buffer} images - one or more images (file paths, Buffers).
 * @param {Object} options - image options, see `sharp()` constructor.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function joinChannel (images, options) {
  if (Array.isArray(images)) {
    images.forEach(function (image) {
      this.options.joinChannelIn.push(this._createInputDescriptor(image, options));
    }, this);
  } else {
    this.options.joinChannelIn.push(this._createInputDescriptor(images, options));
  }
  return this;
}

/**
 * Perform a bitwise boolean operation on all input image channels (bands) to produce a single channel output image.
 *
 * @example
 * sharp('3-channel-rgb-input.png')
 *   .bandbool(sharp.bool.and)
 *   .toFile('1-channel-output.png', function (err, info) {
 *     // The output will be a single channel image where each pixel `P = R & G & B`.
 *     // If `I(1,1) = [247, 170, 14] = [0b11110111, 0b10101010, 0b00001111]`
 *     // then `O(1,1) = 0b11110111 & 0b10101010 & 0b00001111 = 0b00000010 = 2`.
 *   });
 *
 * @param {string} boolOp - one of `and`, `or` or `eor` to perform that bitwise operation, like the C logic operators `&`, `|` and `^` respectively.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function bandbool (boolOp) {
  if (is.string(boolOp) && is.inArray(boolOp, ['and', 'or', 'eor'])) {
    this.options.bandBoolOp = boolOp;
  } else {
    throw is.invalidParameterError('boolOp', 'one of: and, or, eor', boolOp);
  }
  return this;
}

/**
 * Decorate the Sharp prototype with channel-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Object.assign(Sharp.prototype, {
    // Public instance functions
    removeAlpha,
    ensureAlpha,
    extractChannel,
    joinChannel,
    bandbool
  });
  // Class attributes
  Sharp.bool = bool;
};


/***/ }),

/***/ 4144:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(7177);
const is = __nccwpck_require__(768);

/**
 * Colourspaces.
 * @private
 */
const colourspace = {
  multiband: 'multiband',
  'b-w': 'b-w',
  bw: 'b-w',
  cmyk: 'cmyk',
  srgb: 'srgb'
};

/**
 * Tint the image using the provided chroma while preserving the image luminance.
 * An alpha channel may be present and will be unchanged by the operation.
 *
 * @param {string|Object} rgb - parsed by the [color](https://www.npmjs.org/package/color) module to extract chroma values.
 * @returns {Sharp}
 * @throws {Error} Invalid parameter
 */
function tint (rgb) {
  const colour = color(rgb);
  this.options.tintA = colour.a();
  this.options.tintB = colour.b();
  return this;
}

/**
 * Convert to 8-bit greyscale; 256 shades of grey.
 * This is a linear operation. If the input image is in a non-linear colour space such as sRGB, use `gamma()` with `greyscale()` for the best results.
 * By default the output image will be web-friendly sRGB and contain three (identical) color channels.
 * This may be overridden by other sharp operations such as `toColourspace('b-w')`,
 * which will produce an output image containing one color channel.
 * An alpha channel may be present, and will be unchanged by the operation.
 * @param {Boolean} [greyscale=true]
 * @returns {Sharp}
 */
function greyscale (greyscale) {
  this.options.greyscale = is.bool(greyscale) ? greyscale : true;
  return this;
}

/**
 * Alternative spelling of `greyscale`.
 * @param {Boolean} [grayscale=true]
 * @returns {Sharp}
 */
function grayscale (grayscale) {
  return this.greyscale(grayscale);
}

/**
 * Set the output colourspace.
 * By default output image will be web-friendly sRGB, with additional channels interpreted as alpha channels.
 *
 * @example
 * // Output 16 bits per pixel RGB
 * await sharp(input)
 *  .toColourspace('rgb16')
 *  .toFile('16-bpp.png')
 *
 * @param {string} [colourspace] - output colourspace e.g. `srgb`, `rgb`, `cmyk`, `lab`, `b-w` [...](https://github.com/libvips/libvips/blob/master/libvips/iofuncs/enumtypes.c#L568)
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function toColourspace (colourspace) {
  if (!is.string(colourspace)) {
    throw is.invalidParameterError('colourspace', 'string', colourspace);
  }
  this.options.colourspace = colourspace;
  return this;
}

/**
 * Alternative spelling of `toColourspace`.
 * @param {string} [colorspace] - output colorspace.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function toColorspace (colorspace) {
  return this.toColourspace(colorspace);
}

/**
 * Update a colour attribute of the this.options Object.
 * @private
 * @param {string} key
 * @param {string|Object} value
 * @throws {Error} Invalid value
 */
function _setBackgroundColourOption (key, value) {
  if (is.defined(value)) {
    if (is.object(value) || is.string(value)) {
      const colour = color(value);
      this.options[key] = [
        colour.red(),
        colour.green(),
        colour.blue(),
        Math.round(colour.alpha() * 255)
      ];
    } else {
      throw is.invalidParameterError('background', 'object or string', value);
    }
  }
}

/**
 * Decorate the Sharp prototype with colour-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Object.assign(Sharp.prototype, {
    // Public
    tint,
    greyscale,
    grayscale,
    toColourspace,
    toColorspace,
    // Private
    _setBackgroundColourOption
  });
  // Class attributes
  Sharp.colourspace = colourspace;
  Sharp.colorspace = colourspace;
};


/***/ }),

/***/ 7005:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const is = __nccwpck_require__(768);

/**
 * Blend modes.
 * @member
 * @private
 */
const blend = {
  clear: 'clear',
  source: 'source',
  over: 'over',
  in: 'in',
  out: 'out',
  atop: 'atop',
  dest: 'dest',
  'dest-over': 'dest-over',
  'dest-in': 'dest-in',
  'dest-out': 'dest-out',
  'dest-atop': 'dest-atop',
  xor: 'xor',
  add: 'add',
  saturate: 'saturate',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  darken: 'darken',
  lighten: 'lighten',
  'colour-dodge': 'colour-dodge',
  'color-dodge': 'colour-dodge',
  'colour-burn': 'colour-burn',
  'color-burn': 'colour-burn',
  'hard-light': 'hard-light',
  'soft-light': 'soft-light',
  difference: 'difference',
  exclusion: 'exclusion'
};

/**
 * Composite image(s) over the processed (resized, extracted etc.) image.
 *
 * The images to composite must be the same size or smaller than the processed image.
 * If both `top` and `left` options are provided, they take precedence over `gravity`.
 *
 * The `blend` option can be one of `clear`, `source`, `over`, `in`, `out`, `atop`,
 * `dest`, `dest-over`, `dest-in`, `dest-out`, `dest-atop`,
 * `xor`, `add`, `saturate`, `multiply`, `screen`, `overlay`, `darken`, `lighten`,
 * `colour-dodge`, `color-dodge`, `colour-burn`,`color-burn`,
 * `hard-light`, `soft-light`, `difference`, `exclusion`.
 *
 * More information about blend modes can be found at
 * https://libvips.github.io/libvips/API/current/libvips-conversion.html#VipsBlendMode
 * and https://www.cairographics.org/operators/
 *
 * @since 0.22.0
 *
 * @example
 * sharp('input.png')
 *   .rotate(180)
 *   .resize(300)
 *   .flatten( { background: '#ff6600' } )
 *   .composite([{ input: 'overlay.png', gravity: 'southeast' }])
 *   .sharpen()
 *   .withMetadata()
 *   .webp( { quality: 90 } )
 *   .toBuffer()
 *   .then(function(outputBuffer) {
 *     // outputBuffer contains upside down, 300px wide, alpha channel flattened
 *     // onto orange background, composited with overlay.png with SE gravity,
 *     // sharpened, with metadata, 90% quality WebP image data. Phew!
 *   });
 *
 * @param {Object[]} images - Ordered list of images to composite
 * @param {Buffer|String} [images[].input] - Buffer containing image data, String containing the path to an image file, or Create object (see below)
 * @param {Object} [images[].input.create] - describes a blank overlay to be created.
 * @param {Number} [images[].input.create.width]
 * @param {Number} [images[].input.create.height]
 * @param {Number} [images[].input.create.channels] - 3-4
 * @param {String|Object} [images[].input.create.background] - parsed by the [color](https://www.npmjs.org/package/color) module to extract values for red, green, blue and alpha.
 * @param {String} [images[].blend='over'] - how to blend this image with the image below.
 * @param {String} [images[].gravity='centre'] - gravity at which to place the overlay.
 * @param {Number} [images[].top] - the pixel offset from the top edge.
 * @param {Number} [images[].left] - the pixel offset from the left edge.
 * @param {Boolean} [images[].tile=false] - set to true to repeat the overlay image across the entire image with the given `gravity`.
 * @param {Boolean} [images[].premultiplied=false] - set to true to avoid premultipling the image below. Equivalent to the `--premultiplied` vips option.
 * @param {Number} [images[].density=72] - number representing the DPI for vector overlay image.
 * @param {Object} [images[].raw] - describes overlay when using raw pixel data.
 * @param {Number} [images[].raw.width]
 * @param {Number} [images[].raw.height]
 * @param {Number} [images[].raw.channels]
 * @param {boolean} [images[].failOnError=true] - @see {@link /api-constructor#parameters|constructor parameters}
 * @param {number|boolean} [images[].limitInputPixels=268402689] - @see {@link /api-constructor#parameters|constructor parameters}
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function composite (images) {
  if (!Array.isArray(images)) {
    throw is.invalidParameterError('images to composite', 'array', images);
  }
  this.options.composite = images.map(image => {
    if (!is.object(image)) {
      throw is.invalidParameterError('image to composite', 'object', image);
    }
    const inputOptions = this._inputOptionsFromObject(image);
    const composite = {
      input: this._createInputDescriptor(image.input, inputOptions, { allowStream: false }),
      blend: 'over',
      tile: false,
      left: 0,
      top: 0,
      hasOffset: false,
      gravity: 0,
      premultiplied: false
    };
    if (is.defined(image.blend)) {
      if (is.string(blend[image.blend])) {
        composite.blend = blend[image.blend];
      } else {
        throw is.invalidParameterError('blend', 'valid blend name', image.blend);
      }
    }
    if (is.defined(image.tile)) {
      if (is.bool(image.tile)) {
        composite.tile = image.tile;
      } else {
        throw is.invalidParameterError('tile', 'boolean', image.tile);
      }
    }
    if (is.defined(image.left)) {
      if (is.integer(image.left)) {
        composite.left = image.left;
      } else {
        throw is.invalidParameterError('left', 'integer', image.left);
      }
    }
    if (is.defined(image.top)) {
      if (is.integer(image.top)) {
        composite.top = image.top;
      } else {
        throw is.invalidParameterError('top', 'integer', image.top);
      }
    }
    if (is.defined(image.top) !== is.defined(image.left)) {
      throw new Error('Expected both left and top to be set');
    } else {
      composite.hasOffset = is.integer(image.top) && is.integer(image.left);
    }
    if (is.defined(image.gravity)) {
      if (is.integer(image.gravity) && is.inRange(image.gravity, 0, 8)) {
        composite.gravity = image.gravity;
      } else if (is.string(image.gravity) && is.integer(this.constructor.gravity[image.gravity])) {
        composite.gravity = this.constructor.gravity[image.gravity];
      } else {
        throw is.invalidParameterError('gravity', 'valid gravity', image.gravity);
      }
    }
    if (is.defined(image.premultiplied)) {
      if (is.bool(image.premultiplied)) {
        composite.premultiplied = image.premultiplied;
      } else {
        throw is.invalidParameterError('premultiplied', 'boolean', image.premultiplied);
      }
    }

    return composite;
  });
  return this;
}

/**
 * Decorate the Sharp prototype with composite-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Sharp.prototype.composite = composite;
  Sharp.blend = blend;
};


/***/ }),

/***/ 9156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const util = __nccwpck_require__(1669);
const stream = __nccwpck_require__(2413);
const is = __nccwpck_require__(768);

__nccwpck_require__(701).hasVendoredLibvips();

/* istanbul ignore next */
try {
  __nccwpck_require__(2626);
} catch (err) {
  // Bail early if bindings aren't available
  const help = ['', 'Something went wrong installing the "sharp" module', '', err.message, ''];
  if (/NODE_MODULE_VERSION/.test(err.message)) {
    help.push('- Ensure the version of Node.js used at install time matches that used at runtime');
  } else if (/invalid ELF header/.test(err.message)) {
    help.push(`- Ensure "${process.platform}" is used at install time as well as runtime`);
  } else if (/dylib/.test(err.message) && /Incompatible library version/.test(err.message)) {
    help.push('- Run "brew update && brew upgrade vips"');
  } else {
    help.push(
      '- Remove the "node_modules/sharp" directory then run',
      '  "npm install --ignore-scripts=false --verbose sharp" and look for errors'
    );
  }
  help.push(
    '- Consult the installation documentation at https://sharp.pixelplumbing.com/install',
    '- Search for this error at https://github.com/lovell/sharp/issues', ''
  );
  const error = help.join('\n');
  throw new Error(error);
}

// Use NODE_DEBUG=sharp to enable libvips warnings
const debuglog = util.debuglog('sharp');

/**
 * Constructor factory to create an instance of `sharp`, to which further methods are chained.
 *
 * JPEG, PNG, WebP, AVIF or TIFF format image data can be streamed out from this object.
 * When using Stream based output, derived attributes are available from the `info` event.
 *
 * Non-critical problems encountered during processing are emitted as `warning` events.
 *
 * Implements the [stream.Duplex](http://nodejs.org/api/stream.html#stream_class_stream_duplex) class.
 *
 * @constructs Sharp
 *
 * @emits Sharp#info
 * @emits Sharp#warning
 *
 * @example
 * sharp('input.jpg')
 *   .resize(300, 200)
 *   .toFile('output.jpg', function(err) {
 *     // output.jpg is a 300 pixels wide and 200 pixels high image
 *     // containing a scaled and cropped version of input.jpg
 *   });
 *
 * @example
 * // Read image data from readableStream,
 * // resize to 300 pixels wide,
 * // emit an 'info' event with calculated dimensions
 * // and finally write image data to writableStream
 * var transformer = sharp()
 *   .resize(300)
 *   .on('info', function(info) {
 *     console.log('Image height is ' + info.height);
 *   });
 * readableStream.pipe(transformer).pipe(writableStream);
 *
 * @example
 * // Create a blank 300x200 PNG image of semi-transluent red pixels
 * sharp({
 *   create: {
 *     width: 300,
 *     height: 200,
 *     channels: 4,
 *     background: { r: 255, g: 0, b: 0, alpha: 0.5 }
 *   }
 * })
 * .png()
 * .toBuffer()
 * .then( ... );
 *
 * @example
 * // Convert an animated GIF to an animated WebP
 * await sharp('in.gif', { animated: true }).toFile('out.webp');
 *
 * @example
 * // Read a raw array of pixels and save it to a png
 * const input = Uint8Array.from([255, 255, 255, 0, 0, 0]); // or Uint8ClampedArray
 * const image = sharp(input, {
 *   // because the input does not contain its dimensions or how many channels it has
 *   // we need to specify it in the constructor options
 *   raw: {
 *     width: 2,
 *     height: 1,
 *     channels: 3
 *   }
 * });
 * await image.toFile('my-two-pixels.png');
 *
 * @example
 * // Generate RGB Gaussian noise
 * await sharp({
 *   create: {
 *     width: 300,
 *     height: 200,
 *     channels: 3,
 *     noise: {
 *       type: 'gaussian',
 *       mean: 128,
 *       sigma: 30
 *     }
 *  }
 * }).toFile('noise.png');
 *
 * @param {(Buffer|Uint8Array|Uint8ClampedArray|string)} [input] - if present, can be
 *  a Buffer / Uint8Array / Uint8ClampedArray containing JPEG, PNG, WebP, AVIF, GIF, SVG, TIFF or raw pixel image data, or
 *  a String containing the filesystem path to an JPEG, PNG, WebP, AVIF, GIF, SVG or TIFF image file.
 *  JPEG, PNG, WebP, AVIF, GIF, SVG, TIFF or raw pixel image data can be streamed into the object when not present.
 * @param {Object} [options] - if present, is an Object with optional attributes.
 * @param {boolean} [options.failOnError=true] - by default halt processing and raise an error when loading invalid images.
 *  Set this flag to `false` if you'd rather apply a "best effort" to decode images, even if the data is corrupt or invalid.
 * @param {number|boolean} [options.limitInputPixels=268402689] - Do not process input images where the number of pixels
 *  (width x height) exceeds this limit. Assumes image dimensions contained in the input metadata can be trusted.
 *  An integral Number of pixels, zero or false to remove limit, true to use default limit of 268402689 (0x3FFF x 0x3FFF).
 * @param {boolean} [options.sequentialRead=false] - Set this to `true` to use sequential rather than random access where possible.
 *  This can reduce memory usage and might improve performance on some systems.
 * @param {number} [options.density=72] - number representing the DPI for vector images in the range 1 to 100000.
 * @param {number} [options.pages=1] - number of pages to extract for multi-page input (GIF, WebP, AVIF, TIFF, PDF), use -1 for all pages.
 * @param {number} [options.page=0] - page number to start extracting from for multi-page input (GIF, WebP, AVIF, TIFF, PDF), zero based.
 * @param {number} [options.subifd=-1] - subIFD (Sub Image File Directory) to extract for OME-TIFF, defaults to main image.
 * @param {number} [options.level=0] - level to extract from a multi-level input (OpenSlide), zero based.
 * @param {boolean} [options.animated=false] - Set to `true` to read all frames/pages of an animated image (equivalent of setting `pages` to `-1`).
 * @param {Object} [options.raw] - describes raw pixel input image data. See `raw()` for pixel ordering.
 * @param {number} [options.raw.width] - integral number of pixels wide.
 * @param {number} [options.raw.height] - integral number of pixels high.
 * @param {number} [options.raw.channels] - integral number of channels, between 1 and 4.
 * @param {boolean} [options.raw.premultiplied] - specifies that the raw input has already been premultiplied, set to `true`
 *  to avoid sharp premultiplying the image. (optional, default `false`)
 * @param {Object} [options.create] - describes a new image to be created.
 * @param {number} [options.create.width] - integral number of pixels wide.
 * @param {number} [options.create.height] - integral number of pixels high.
 * @param {number} [options.create.channels] - integral number of channels, either 3 (RGB) or 4 (RGBA).
 * @param {string|Object} [options.create.background] - parsed by the [color](https://www.npmjs.org/package/color) module to extract values for red, green, blue and alpha.
 * @param {Object} [options.create.noise] - describes a noise to be created.
 * @param {string} [options.create.noise.type] - type of generated noise, currently only `gaussian` is supported.
 * @param {number} [options.create.noise.mean] - mean of pixels in generated noise.
 * @param {number} [options.create.noise.sigma] - standard deviation of pixels in generated noise.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
const Sharp = function (input, options) {
  if (arguments.length === 1 && !is.defined(input)) {
    throw new Error('Invalid input');
  }
  if (!(this instanceof Sharp)) {
    return new Sharp(input, options);
  }
  stream.Duplex.call(this);
  this.options = {
    // resize options
    topOffsetPre: -1,
    leftOffsetPre: -1,
    widthPre: -1,
    heightPre: -1,
    topOffsetPost: -1,
    leftOffsetPost: -1,
    widthPost: -1,
    heightPost: -1,
    width: -1,
    height: -1,
    canvas: 'crop',
    position: 0,
    resizeBackground: [0, 0, 0, 255],
    useExifOrientation: false,
    angle: 0,
    rotationAngle: 0,
    rotationBackground: [0, 0, 0, 255],
    rotateBeforePreExtract: false,
    flip: false,
    flop: false,
    extendTop: 0,
    extendBottom: 0,
    extendLeft: 0,
    extendRight: 0,
    extendBackground: [0, 0, 0, 255],
    withoutEnlargement: false,
    affineMatrix: [],
    affineBackground: [0, 0, 0, 255],
    affineIdx: 0,
    affineIdy: 0,
    affineOdx: 0,
    affineOdy: 0,
    affineInterpolator: this.constructor.interpolators.bilinear,
    kernel: 'lanczos3',
    fastShrinkOnLoad: true,
    // operations
    tintA: 128,
    tintB: 128,
    flatten: false,
    flattenBackground: [0, 0, 0],
    negate: false,
    medianSize: 0,
    blurSigma: 0,
    sharpenSigma: 0,
    sharpenFlat: 1,
    sharpenJagged: 2,
    threshold: 0,
    thresholdGrayscale: true,
    trimThreshold: 0,
    gamma: 0,
    gammaOut: 0,
    greyscale: false,
    normalise: false,
    claheWidth: 0,
    claheHeight: 0,
    claheMaxSlope: 3,
    brightness: 1,
    saturation: 1,
    hue: 0,
    booleanBufferIn: null,
    booleanFileIn: '',
    joinChannelIn: [],
    extractChannel: -1,
    removeAlpha: false,
    ensureAlpha: -1,
    colourspace: 'srgb',
    composite: [],
    // output
    fileOut: '',
    formatOut: 'input',
    streamOut: false,
    withMetadata: false,
    withMetadataOrientation: -1,
    withMetadataDensity: 0,
    withMetadataIcc: '',
    withMetadataStrs: {},
    resolveWithObject: false,
    // output format
    jpegQuality: 80,
    jpegProgressive: false,
    jpegChromaSubsampling: '4:2:0',
    jpegTrellisQuantisation: false,
    jpegOvershootDeringing: false,
    jpegOptimiseScans: false,
    jpegOptimiseCoding: true,
    jpegQuantisationTable: 0,
    pngProgressive: false,
    pngCompressionLevel: 6,
    pngAdaptiveFiltering: false,
    pngPalette: false,
    pngQuality: 100,
    pngColours: 256,
    pngDither: 1,
    webpQuality: 80,
    webpAlphaQuality: 100,
    webpLossless: false,
    webpNearLossless: false,
    webpSmartSubsample: false,
    webpReductionEffort: 4,
    tiffQuality: 80,
    tiffCompression: 'jpeg',
    tiffPredictor: 'horizontal',
    tiffPyramid: false,
    tiffBitdepth: 8,
    tiffTile: false,
    tiffTileHeight: 256,
    tiffTileWidth: 256,
    tiffXres: 1.0,
    tiffYres: 1.0,
    heifQuality: 50,
    heifLossless: false,
    heifCompression: 'av1',
    heifSpeed: 5,
    heifChromaSubsampling: '4:2:0',
    tileSize: 256,
    tileOverlap: 0,
    tileContainer: 'fs',
    tileLayout: 'dz',
    tileFormat: 'last',
    tileDepth: 'last',
    tileAngle: 0,
    tileSkipBlanks: -1,
    tileBackground: [255, 255, 255, 255],
    tileCentre: false,
    tileId: 'https://example.com/iiif',
    linearA: 1,
    linearB: 0,
    // Function to notify of libvips warnings
    debuglog: warning => {
      this.emit('warning', warning);
      debuglog(warning);
    },
    // Function to notify of queue length changes
    queueListener: function (queueLength) {
      Sharp.queue.emit('change', queueLength);
    }
  };
  this.options.input = this._createInputDescriptor(input, options, { allowStream: true });
  return this;
};
util.inherits(Sharp, stream.Duplex);

/**
 * Take a "snapshot" of the Sharp instance, returning a new instance.
 * Cloned instances inherit the input of their parent instance.
 * This allows multiple output Streams and therefore multiple processing pipelines to share a single input Stream.
 *
 * @example
 * const pipeline = sharp().rotate();
 * pipeline.clone().resize(800, 600).pipe(firstWritableStream);
 * pipeline.clone().extract({ left: 20, top: 20, width: 100, height: 100 }).pipe(secondWritableStream);
 * readableStream.pipe(pipeline);
 * // firstWritableStream receives auto-rotated, resized readableStream
 * // secondWritableStream receives auto-rotated, extracted region of readableStream
 *
 * @example
 * // Create a pipeline that will download an image, resize it and format it to different files
 * // Using Promises to know when the pipeline is complete
 * const fs = require("fs");
 * const got = require("got");
 * const sharpStream = sharp({
 *   failOnError: false
 * });
 *
 * const promises = [];
 *
 * promises.push(
 *   sharpStream
 *     .clone()
 *     .jpeg({ quality: 100 })
 *     .toFile("originalFile.jpg")
 * );
 *
 * promises.push(
 *   sharpStream
 *     .clone()
 *     .resize({ width: 500 })
 *     .jpeg({ quality: 80 })
 *     .toFile("optimized-500.jpg")
 * );
 *
 * promises.push(
 *   sharpStream
 *     .clone()
 *     .resize({ width: 500 })
 *     .webp({ quality: 80 })
 *     .toFile("optimized-500.webp")
 * );
 *
 * // https://github.com/sindresorhus/got#gotstreamurl-options
 * got.stream("https://www.example.com/some-file.jpg").pipe(sharpStream);
 *
 * Promise.all(promises)
 *   .then(res => { console.log("Done!", res); })
 *   .catch(err => {
 *     console.error("Error processing files, let's clean it up", err);
 *     try {
 *       fs.unlinkSync("originalFile.jpg");
 *       fs.unlinkSync("optimized-500.jpg");
 *       fs.unlinkSync("optimized-500.webp");
 *     } catch (e) {}
 *   });
 *
 * @returns {Sharp}
 */
function clone () {
  // Clone existing options
  const clone = this.constructor.call();
  clone.options = Object.assign({}, this.options);
  // Pass 'finish' event to clone for Stream-based input
  if (this._isStreamInput()) {
    this.on('finish', () => {
      // Clone inherits input data
      this._flattenBufferIn();
      clone.options.bufferIn = this.options.bufferIn;
      clone.emit('finish');
    });
  }
  return clone;
}
Object.assign(Sharp.prototype, { clone });

/**
 * Export constructor.
 * @private
 */
module.exports = Sharp;


/***/ }),

/***/ 4185:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Sharp = __nccwpck_require__(9156);
__nccwpck_require__(2869)(Sharp);
__nccwpck_require__(2932)(Sharp);
__nccwpck_require__(7005)(Sharp);
__nccwpck_require__(1946)(Sharp);
__nccwpck_require__(4144)(Sharp);
__nccwpck_require__(6193)(Sharp);
__nccwpck_require__(7280)(Sharp);
__nccwpck_require__(9927)(Sharp);

module.exports = Sharp;


/***/ }),

/***/ 2869:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(7177);
const is = __nccwpck_require__(768);
const sharp = __nccwpck_require__(2626);

/**
 * Extract input options, if any, from an object.
 * @private
 */
function _inputOptionsFromObject (obj) {
  const { raw, density, limitInputPixels, sequentialRead, failOnError, animated, page, pages, subifd } = obj;
  return [raw, density, limitInputPixels, sequentialRead, failOnError, animated, page, pages, subifd].some(is.defined)
    ? { raw, density, limitInputPixels, sequentialRead, failOnError, animated, page, pages, subifd }
    : undefined;
}

/**
 * Create Object containing input and input-related options.
 * @private
 */
function _createInputDescriptor (input, inputOptions, containerOptions) {
  const inputDescriptor = {
    failOnError: true,
    limitInputPixels: Math.pow(0x3FFF, 2),
    sequentialRead: false
  };
  if (is.string(input)) {
    // filesystem
    inputDescriptor.file = input;
  } else if (is.buffer(input)) {
    // Buffer
    if (input.length === 0) {
      throw Error('Input Buffer is empty');
    }
    inputDescriptor.buffer = input;
  } else if (is.uint8Array(input)) {
    // Uint8Array or Uint8ClampedArray
    if (input.length === 0) {
      throw Error('Input Bit Array is empty');
    }
    inputDescriptor.buffer = Buffer.from(input.buffer);
  } else if (is.plainObject(input) && !is.defined(inputOptions)) {
    // Plain Object descriptor, e.g. create
    inputOptions = input;
    if (_inputOptionsFromObject(inputOptions)) {
      // Stream with options
      inputDescriptor.buffer = [];
    }
  } else if (!is.defined(input) && !is.defined(inputOptions) && is.object(containerOptions) && containerOptions.allowStream) {
    // Stream without options
    inputDescriptor.buffer = [];
  } else {
    throw new Error(`Unsupported input '${input}' of type ${typeof input}${
      is.defined(inputOptions) ? ` when also providing options of type ${typeof inputOptions}` : ''
    }`);
  }
  if (is.object(inputOptions)) {
    // Fail on error
    if (is.defined(inputOptions.failOnError)) {
      if (is.bool(inputOptions.failOnError)) {
        inputDescriptor.failOnError = inputOptions.failOnError;
      } else {
        throw is.invalidParameterError('failOnError', 'boolean', inputOptions.failOnError);
      }
    }
    // Density
    if (is.defined(inputOptions.density)) {
      if (is.inRange(inputOptions.density, 1, 100000)) {
        inputDescriptor.density = inputOptions.density;
      } else {
        throw is.invalidParameterError('density', 'number between 1 and 100000', inputOptions.density);
      }
    }
    // limitInputPixels
    if (is.defined(inputOptions.limitInputPixels)) {
      if (is.bool(inputOptions.limitInputPixels)) {
        inputDescriptor.limitInputPixels = inputOptions.limitInputPixels
          ? Math.pow(0x3FFF, 2)
          : 0;
      } else if (is.integer(inputOptions.limitInputPixels) && inputOptions.limitInputPixels >= 0) {
        inputDescriptor.limitInputPixels = inputOptions.limitInputPixels;
      } else {
        throw is.invalidParameterError('limitInputPixels', 'integer >= 0', inputOptions.limitInputPixels);
      }
    }
    // sequentialRead
    if (is.defined(inputOptions.sequentialRead)) {
      if (is.bool(inputOptions.sequentialRead)) {
        inputDescriptor.sequentialRead = inputOptions.sequentialRead;
      } else {
        throw is.invalidParameterError('sequentialRead', 'boolean', inputOptions.sequentialRead);
      }
    }
    // Raw pixel input
    if (is.defined(inputOptions.raw)) {
      if (
        is.object(inputOptions.raw) &&
        is.integer(inputOptions.raw.width) && inputOptions.raw.width > 0 &&
        is.integer(inputOptions.raw.height) && inputOptions.raw.height > 0 &&
        is.integer(inputOptions.raw.channels) && is.inRange(inputOptions.raw.channels, 1, 4)
      ) {
        inputDescriptor.rawWidth = inputOptions.raw.width;
        inputDescriptor.rawHeight = inputOptions.raw.height;
        inputDescriptor.rawChannels = inputOptions.raw.channels;
        inputDescriptor.rawPremultiplied = !!inputOptions.raw.premultiplied;
      } else {
        throw new Error('Expected width, height and channels for raw pixel input');
      }
    }
    // Multi-page input (GIF, TIFF, PDF)
    if (is.defined(inputOptions.animated)) {
      if (is.bool(inputOptions.animated)) {
        inputDescriptor.pages = inputOptions.animated ? -1 : 1;
      } else {
        throw is.invalidParameterError('animated', 'boolean', inputOptions.animated);
      }
    }
    if (is.defined(inputOptions.pages)) {
      if (is.integer(inputOptions.pages) && is.inRange(inputOptions.pages, -1, 100000)) {
        inputDescriptor.pages = inputOptions.pages;
      } else {
        throw is.invalidParameterError('pages', 'integer between -1 and 100000', inputOptions.pages);
      }
    }
    if (is.defined(inputOptions.page)) {
      if (is.integer(inputOptions.page) && is.inRange(inputOptions.page, 0, 100000)) {
        inputDescriptor.page = inputOptions.page;
      } else {
        throw is.invalidParameterError('page', 'integer between 0 and 100000', inputOptions.page);
      }
    }
    // Multi-level input (OpenSlide)
    if (is.defined(inputOptions.level)) {
      if (is.integer(inputOptions.level) && is.inRange(inputOptions.level, 0, 256)) {
        inputDescriptor.level = inputOptions.level;
      } else {
        throw is.invalidParameterError('level', 'integer between 0 and 256', inputOptions.level);
      }
    }
    // Sub Image File Directory (TIFF)
    if (is.defined(inputOptions.subifd)) {
      if (is.integer(inputOptions.subifd) && is.inRange(inputOptions.subifd, -1, 100000)) {
        inputDescriptor.subifd = inputOptions.subifd;
      } else {
        throw is.invalidParameterError('subifd', 'integer between -1 and 100000', inputOptions.subifd);
      }
    }
    // Create new image
    if (is.defined(inputOptions.create)) {
      if (
        is.object(inputOptions.create) &&
        is.integer(inputOptions.create.width) && inputOptions.create.width > 0 &&
        is.integer(inputOptions.create.height) && inputOptions.create.height > 0 &&
        is.integer(inputOptions.create.channels)
      ) {
        inputDescriptor.createWidth = inputOptions.create.width;
        inputDescriptor.createHeight = inputOptions.create.height;
        inputDescriptor.createChannels = inputOptions.create.channels;
        // Noise
        if (is.defined(inputOptions.create.noise)) {
          if (!is.object(inputOptions.create.noise)) {
            throw new Error('Expected noise to be an object');
          }
          if (!is.inArray(inputOptions.create.noise.type, ['gaussian'])) {
            throw new Error('Only gaussian noise is supported at the moment');
          }
          if (!is.inRange(inputOptions.create.channels, 1, 4)) {
            throw is.invalidParameterError('create.channels', 'number between 1 and 4', inputOptions.create.channels);
          }
          inputDescriptor.createNoiseType = inputOptions.create.noise.type;
          if (is.number(inputOptions.create.noise.mean) && is.inRange(inputOptions.create.noise.mean, 0, 10000)) {
            inputDescriptor.createNoiseMean = inputOptions.create.noise.mean;
          } else {
            throw is.invalidParameterError('create.noise.mean', 'number between 0 and 10000', inputOptions.create.noise.mean);
          }
          if (is.number(inputOptions.create.noise.sigma) && is.inRange(inputOptions.create.noise.sigma, 0, 10000)) {
            inputDescriptor.createNoiseSigma = inputOptions.create.noise.sigma;
          } else {
            throw is.invalidParameterError('create.noise.sigma', 'number between 0 and 10000', inputOptions.create.noise.sigma);
          }
        } else if (is.defined(inputOptions.create.background)) {
          if (!is.inRange(inputOptions.create.channels, 3, 4)) {
            throw is.invalidParameterError('create.channels', 'number between 3 and 4', inputOptions.create.channels);
          }
          const background = color(inputOptions.create.background);
          inputDescriptor.createBackground = [
            background.red(),
            background.green(),
            background.blue(),
            Math.round(background.alpha() * 255)
          ];
        } else {
          throw new Error('Expected valid noise or background to create a new input image');
        }
        delete inputDescriptor.buffer;
      } else {
        throw new Error('Expected valid width, height and channels to create a new input image');
      }
    }
  } else if (is.defined(inputOptions)) {
    throw new Error('Invalid input options ' + inputOptions);
  }
  return inputDescriptor;
}

/**
 * Handle incoming Buffer chunk on Writable Stream.
 * @private
 * @param {Buffer} chunk
 * @param {string} encoding - unused
 * @param {Function} callback
 */
function _write (chunk, encoding, callback) {
  /* istanbul ignore else */
  if (Array.isArray(this.options.input.buffer)) {
    /* istanbul ignore else */
    if (is.buffer(chunk)) {
      if (this.options.input.buffer.length === 0) {
        this.on('finish', () => {
          this.streamInFinished = true;
        });
      }
      this.options.input.buffer.push(chunk);
      callback();
    } else {
      callback(new Error('Non-Buffer data on Writable Stream'));
    }
  } else {
    callback(new Error('Unexpected data on Writable Stream'));
  }
}

/**
 * Flattens the array of chunks accumulated in input.buffer.
 * @private
 */
function _flattenBufferIn () {
  if (this._isStreamInput()) {
    this.options.input.buffer = Buffer.concat(this.options.input.buffer);
  }
}

/**
 * Are we expecting Stream-based input?
 * @private
 * @returns {boolean}
 */
function _isStreamInput () {
  return Array.isArray(this.options.input.buffer);
}

/**
 * Fast access to (uncached) image metadata without decoding any compressed image data.
 * A `Promise` is returned when `callback` is not provided.
 *
 * - `format`: Name of decoder used to decompress image data e.g. `jpeg`, `png`, `webp`, `gif`, `svg`
 * - `size`: Total size of image in bytes, for Stream and Buffer input only
 * - `width`: Number of pixels wide (EXIF orientation is not taken into consideration)
 * - `height`: Number of pixels high (EXIF orientation is not taken into consideration)
 * - `space`: Name of colour space interpretation e.g. `srgb`, `rgb`, `cmyk`, `lab`, `b-w` [...](https://libvips.github.io/libvips/API/current/VipsImage.html#VipsInterpretation)
 * - `channels`: Number of bands e.g. `3` for sRGB, `4` for CMYK
 * - `depth`: Name of pixel depth format e.g. `uchar`, `char`, `ushort`, `float` [...](https://libvips.github.io/libvips/API/current/VipsImage.html#VipsBandFormat)
 * - `density`: Number of pixels per inch (DPI), if present
 * - `chromaSubsampling`: String containing JPEG chroma subsampling, `4:2:0` or `4:4:4` for RGB, `4:2:0:4` or `4:4:4:4` for CMYK
 * - `isProgressive`: Boolean indicating whether the image is interlaced using a progressive scan
 * - `pages`: Number of pages/frames contained within the image, with support for TIFF, HEIF, PDF, animated GIF and animated WebP
 * - `pageHeight`: Number of pixels high each page in a multi-page image will be.
 * - `loop`: Number of times to loop an animated image, zero refers to a continuous loop.
 * - `delay`: Delay in ms between each page in an animated image, provided as an array of integers.
 * - `pagePrimary`: Number of the primary page in a HEIF image
 * - `levels`: Details of each level in a multi-level image provided as an array of objects, requires libvips compiled with support for OpenSlide
 * - `subifds`: Number of Sub Image File Directories in an OME-TIFF image
 * - `hasProfile`: Boolean indicating the presence of an embedded ICC profile
 * - `hasAlpha`: Boolean indicating the presence of an alpha transparency channel
 * - `orientation`: Number value of the EXIF Orientation header, if present
 * - `exif`: Buffer containing raw EXIF data, if present
 * - `icc`: Buffer containing raw [ICC](https://www.npmjs.com/package/icc) profile data, if present
 * - `iptc`: Buffer containing raw IPTC data, if present
 * - `xmp`: Buffer containing raw XMP data, if present
 * - `tifftagPhotoshop`: Buffer containing raw TIFFTAG_PHOTOSHOP data, if present
 *
 * @example
 * const image = sharp(inputJpg);
 * image
 *   .metadata()
 *   .then(function(metadata) {
 *     return image
 *       .resize(Math.round(metadata.width / 2))
 *       .webp()
 *       .toBuffer();
 *   })
 *   .then(function(data) {
 *     // data contains a WebP image half the width and height of the original JPEG
 *   });
 *
 * @param {Function} [callback] - called with the arguments `(err, metadata)`
 * @returns {Promise<Object>|Sharp}
 */
function metadata (callback) {
  if (is.fn(callback)) {
    if (this._isStreamInput()) {
      this.on('finish', () => {
        this._flattenBufferIn();
        sharp.metadata(this.options, callback);
      });
    } else {
      sharp.metadata(this.options, callback);
    }
    return this;
  } else {
    if (this._isStreamInput()) {
      return new Promise((resolve, reject) => {
        this.on('finish', () => {
          this._flattenBufferIn();
          sharp.metadata(this.options, (err, metadata) => {
            if (err) {
              reject(err);
            } else {
              resolve(metadata);
            }
          });
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        sharp.metadata(this.options, (err, metadata) => {
          if (err) {
            reject(err);
          } else {
            resolve(metadata);
          }
        });
      });
    }
  }
}

/**
 * Access to pixel-derived image statistics for every channel in the image.
 * A `Promise` is returned when `callback` is not provided.
 *
 * - `channels`: Array of channel statistics for each channel in the image. Each channel statistic contains
 *     - `min` (minimum value in the channel)
 *     - `max` (maximum value in the channel)
 *     - `sum` (sum of all values in a channel)
 *     - `squaresSum` (sum of squared values in a channel)
 *     - `mean` (mean of the values in a channel)
 *     - `stdev` (standard deviation for the values in a channel)
 *     - `minX` (x-coordinate of one of the pixel where the minimum lies)
 *     - `minY` (y-coordinate of one of the pixel where the minimum lies)
 *     - `maxX` (x-coordinate of one of the pixel where the maximum lies)
 *     - `maxY` (y-coordinate of one of the pixel where the maximum lies)
 * - `isOpaque`: Is the image fully opaque? Will be `true` if the image has no alpha channel or if every pixel is fully opaque.
 * - `entropy`: Histogram-based estimation of greyscale entropy, discarding alpha channel if any (experimental)
 * - `sharpness`: Estimation of greyscale sharpness based on the standard deviation of a Laplacian convolution, discarding alpha channel if any (experimental)
 * - `dominant`: Object containing most dominant sRGB colour based on a 4096-bin 3D histogram (experimental)
 *
 * @example
 * const image = sharp(inputJpg);
 * image
 *   .stats()
 *   .then(function(stats) {
 *      // stats contains the channel-wise statistics array and the isOpaque value
 *   });
 *
 * @example
 * const { entropy, sharpness, dominant } = await sharp(input).stats();
 * const { r, g, b } = dominant;
 *
 * @param {Function} [callback] - called with the arguments `(err, stats)`
 * @returns {Promise<Object>}
 */
function stats (callback) {
  if (is.fn(callback)) {
    if (this._isStreamInput()) {
      this.on('finish', () => {
        this._flattenBufferIn();
        sharp.stats(this.options, callback);
      });
    } else {
      sharp.stats(this.options, callback);
    }
    return this;
  } else {
    if (this._isStreamInput()) {
      return new Promise((resolve, reject) => {
        this.on('finish', function () {
          this._flattenBufferIn();
          sharp.stats(this.options, (err, stats) => {
            if (err) {
              reject(err);
            } else {
              resolve(stats);
            }
          });
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        sharp.stats(this.options, (err, stats) => {
          if (err) {
            reject(err);
          } else {
            resolve(stats);
          }
        });
      });
    }
  }
}

/**
 * Decorate the Sharp prototype with input-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Object.assign(Sharp.prototype, {
    // Private
    _inputOptionsFromObject,
    _createInputDescriptor,
    _write,
    _flattenBufferIn,
    _isStreamInput,
    // Public
    metadata,
    stats
  });
};


/***/ }),

/***/ 768:
/***/ ((module) => {

"use strict";


/**
 * Is this value defined and not null?
 * @private
 */
const defined = function (val) {
  return typeof val !== 'undefined' && val !== null;
};

/**
 * Is this value an object?
 * @private
 */
const object = function (val) {
  return typeof val === 'object';
};

/**
 * Is this value a plain object?
 * @private
 */
const plainObject = function (val) {
  return Object.prototype.toString.call(val) === '[object Object]';
};

/**
 * Is this value a function?
 * @private
 */
const fn = function (val) {
  return typeof val === 'function';
};

/**
 * Is this value a boolean?
 * @private
 */
const bool = function (val) {
  return typeof val === 'boolean';
};

/**
 * Is this value a Buffer object?
 * @private
 */
const buffer = function (val) {
  return val instanceof Buffer;
};

/**
 * Is this value a Uint8Array or Uint8ClampedArray object?
 * @private
 */
const uint8Array = function (val) {
  // allow both since Uint8ClampedArray simply clamps the values between 0-255
  return val instanceof Uint8Array || val instanceof Uint8ClampedArray;
};

/**
 * Is this value a non-empty string?
 * @private
 */
const string = function (val) {
  return typeof val === 'string' && val.length > 0;
};

/**
 * Is this value a real number?
 * @private
 */
const number = function (val) {
  return typeof val === 'number' && !Number.isNaN(val);
};

/**
 * Is this value an integer?
 * @private
 */
const integer = function (val) {
  return Number.isInteger(val);
};

/**
 * Is this value within an inclusive given range?
 * @private
 */
const inRange = function (val, min, max) {
  return val >= min && val <= max;
};

/**
 * Is this value within the elements of an array?
 * @private
 */
const inArray = function (val, list) {
  return list.includes(val);
};

/**
 * Create an Error with a message relating to an invalid parameter.
 *
 * @param {string} name - parameter name.
 * @param {string} expected - description of the type/value/range expected.
 * @param {*} actual - the value received.
 * @returns {Error} Containing the formatted message.
 * @private
 */
const invalidParameterError = function (name, expected, actual) {
  return new Error(
    `Expected ${expected} for ${name} but received ${actual} of type ${typeof actual}`
  );
};

module.exports = {
  defined: defined,
  object: object,
  plainObject: plainObject,
  fn: fn,
  bool: bool,
  buffer: buffer,
  uint8Array: uint8Array,
  string: string,
  number: number,
  integer: integer,
  inRange: inRange,
  inArray: inArray,
  invalidParameterError: invalidParameterError
};


/***/ }),

/***/ 701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(5747);
const os = __nccwpck_require__(2087);
const path = __nccwpck_require__(5622);
const spawnSync = __nccwpck_require__(3129).spawnSync;
const semverCoerce = __nccwpck_require__(6073);
const semverGreaterThanOrEqualTo = __nccwpck_require__(9343);

const platform = __nccwpck_require__(1998);

const env = process.env;
const minimumLibvipsVersionLabelled = env.npm_package_config_libvips || /* istanbul ignore next */
  __nccwpck_require__(1062)/* .config.libvips */ .vc.W0;
const minimumLibvipsVersion = semverCoerce(minimumLibvipsVersionLabelled).version;

const spawnSyncOptions = {
  encoding: 'utf8',
  shell: true
};

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath);
  } catch (err) {
    /* istanbul ignore if */
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
};

const cachePath = function () {
  const npmCachePath = env.npm_config_cache || /* istanbul ignore next */
    (env.APPDATA ? path.join(env.APPDATA, 'npm-cache') : path.join(os.homedir(), '.npm'));
  mkdirSync(npmCachePath);
  const libvipsCachePath = path.join(npmCachePath, '_libvips');
  mkdirSync(libvipsCachePath);
  return libvipsCachePath;
};

const log = function (item) {
  if (item instanceof Error) {
    console.error(`sharp: Installation error: ${item.message}`);
  } else {
    console.log(`sharp: ${item}`);
  }
};

const isRosetta = function () {
  /* istanbul ignore next */
  if (process.platform === 'darwin' && process.arch === 'x64') {
    const translated = spawnSync('sysctl sysctl.proc_translated', spawnSyncOptions).stdout;
    return (translated || '').trim() === 'sysctl.proc_translated: 1';
  }
  return false;
};

const globalLibvipsVersion = function () {
  if (process.platform !== 'win32') {
    const globalLibvipsVersion = spawnSync(`PKG_CONFIG_PATH="${pkgConfigPath()}" pkg-config --modversion vips-cpp`, spawnSyncOptions).stdout;
    /* istanbul ignore next */
    return (globalLibvipsVersion || '').trim();
  } else {
    return '';
  }
};

const hasVendoredLibvips = function () {
  const currentPlatformId = platform();
  const vendorPath = __nccwpck_require__.ab + "vendor/" + minimumLibvipsVersion;
  let vendorPlatformId;
  try {
    vendorPlatformId = require(path.join(vendorPath, 'platform.json'));
  } catch (err) {}
  /* istanbul ignore else */
  if (vendorPlatformId) {
    /* istanbul ignore else */
    if (currentPlatformId === vendorPlatformId) {
      return true;
    } else {
      throw new Error(`'${vendorPlatformId}' binaries cannot be used on the '${currentPlatformId}' platform. Please remove the 'node_modules/sharp' directory and run 'npm install' on the '${currentPlatformId}' platform.`);
    }
  } else {
    return false;
  }
};

const pkgConfigPath = function () {
  if (process.platform !== 'win32') {
    const brewPkgConfigPath = spawnSync('which brew >/dev/null 2>&1 && eval $(brew --env) && echo $PKG_CONFIG_LIBDIR', spawnSyncOptions).stdout || '';
    return [brewPkgConfigPath.trim(), env.PKG_CONFIG_PATH, '/usr/local/lib/pkgconfig', '/usr/lib/pkgconfig']
      .filter(function (p) { return !!p; })
      .join(':');
  } else {
    return '';
  }
};

const useGlobalLibvips = function () {
  if (Boolean(env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
    return false;
  }
  /* istanbul ignore next */
  if (isRosetta()) {
    return false;
  }
  const globalVipsVersion = globalLibvipsVersion();
  return !!globalVipsVersion && /* istanbul ignore next */
    semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion);
};

module.exports = {
  minimumLibvipsVersion,
  minimumLibvipsVersionLabelled,
  cachePath,
  log,
  globalLibvipsVersion,
  hasVendoredLibvips,
  pkgConfigPath,
  useGlobalLibvips,
  mkdirSync
};


/***/ }),

/***/ 1946:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(7177);
const is = __nccwpck_require__(768);

/**
 * Rotate the output image by either an explicit angle
 * or auto-orient based on the EXIF `Orientation` tag.
 *
 * If an angle is provided, it is converted to a valid positive degree rotation.
 * For example, `-450` will produce a 270deg rotation.
 *
 * When rotating by an angle other than a multiple of 90,
 * the background colour can be provided with the `background` option.
 *
 * If no angle is provided, it is determined from the EXIF data.
 * Mirroring is supported and may infer the use of a flip operation.
 *
 * The use of `rotate` implies the removal of the EXIF `Orientation` tag, if any.
 *
 * Method order is important when both rotating and extracting regions,
 * for example `rotate(x).extract(y)` will produce a different result to `extract(y).rotate(x)`.
 *
 * @example
 * const pipeline = sharp()
 *   .rotate()
 *   .resize(null, 200)
 *   .toBuffer(function (err, outputBuffer, info) {
 *     // outputBuffer contains 200px high JPEG image data,
 *     // auto-rotated using EXIF Orientation tag
 *     // info.width and info.height contain the dimensions of the resized image
 *   });
 * readableStream.pipe(pipeline);
 *
 * @param {number} [angle=auto] angle of rotation.
 * @param {Object} [options] - if present, is an Object with optional attributes.
 * @param {string|Object} [options.background="#000000"] parsed by the [color](https://www.npmjs.org/package/color) module to extract values for red, green, blue and alpha.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function rotate (angle, options) {
  if (!is.defined(angle)) {
    this.options.useExifOrientation = true;
  } else if (is.integer(angle) && !(angle % 90)) {
    this.options.angle = angle;
  } else if (is.number(angle)) {
    this.options.rotationAngle = angle;
    if (is.object(options) && options.background) {
      const backgroundColour = color(options.background);
      this.options.rotationBackground = [
        backgroundColour.red(),
        backgroundColour.green(),
        backgroundColour.blue(),
        Math.round(backgroundColour.alpha() * 255)
      ];
    }
  } else {
    throw is.invalidParameterError('angle', 'numeric', angle);
  }
  return this;
}

/**
 * Flip the image about the vertical Y axis. This always occurs after rotation, if any.
 * The use of `flip` implies the removal of the EXIF `Orientation` tag, if any.
 * @param {Boolean} [flip=true]
 * @returns {Sharp}
 */
function flip (flip) {
  this.options.flip = is.bool(flip) ? flip : true;
  return this;
}

/**
 * Flop the image about the horizontal X axis. This always occurs after rotation, if any.
 * The use of `flop` implies the removal of the EXIF `Orientation` tag, if any.
 * @param {Boolean} [flop=true]
 * @returns {Sharp}
 */
function flop (flop) {
  this.options.flop = is.bool(flop) ? flop : true;
  return this;
}

/**
 * Perform an affine transform on an image. This operation will always occur after resizing, extraction and rotation, if any.
 *
 * You must provide an array of length 4 or a 2x2 affine transformation matrix.
 * By default, new pixels are filled with a black background. You can provide a background color with the `background` option.
 * A particular interpolator may also be specified. Set the `interpolator` option to an attribute of the `sharp.interpolator` Object e.g. `sharp.interpolator.nohalo`.
 *
 * In the case of a 2x2 matrix, the transform is:
 * - X = `matrix[0, 0]` \* (x + `idx`) + `matrix[0, 1]` \* (y + `idy`) + `odx`
 * - Y = `matrix[1, 0]` \* (x + `idx`) + `matrix[1, 1]` \* (y + `idy`) + `ody`
 *
 * where:
 * - x and y are the coordinates in input image.
 * - X and Y are the coordinates in output image.
 * - (0,0) is the upper left corner.
 *
 * @since 0.27.0
 *
 * @example
 * const pipeline = sharp()
 *   .affine([[1, 0.3], [0.1, 0.7]], {
 *      background: 'white',
 *      interpolate: sharp.interpolators.nohalo
 *   })
 *   .toBuffer((err, outputBuffer, info) => {
 *      // outputBuffer contains the transformed image
 *      // info.width and info.height contain the new dimensions
 *   });
 *
 * inputStream
 *   .pipe(pipeline);
 *
 * @param {Array<Array<number>>|Array<number>} matrix - affine transformation matrix
 * @param {Object} [options] - if present, is an Object with optional attributes.
 * @param {String|Object} [options.background="#000000"] - parsed by the [color](https://www.npmjs.org/package/color) module to extract values for red, green, blue and alpha.
 * @param {Number} [options.idx=0] - input horizontal offset
 * @param {Number} [options.idy=0] - input vertical offset
 * @param {Number} [options.odx=0] - output horizontal offset
 * @param {Number} [options.ody=0] - output vertical offset
 * @param {String} [options.interpolator=sharp.interpolators.bicubic] - interpolator
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function affine (matrix, options) {
  const flatMatrix = [].concat(...matrix);
  if (flatMatrix.length === 4 && flatMatrix.every(is.number)) {
    this.options.affineMatrix = flatMatrix;
  } else {
    throw is.invalidParameterError('matrix', '1x4 or 2x2 array', matrix);
  }

  if (is.defined(options)) {
    if (is.object(options)) {
      this._setBackgroundColourOption('affineBackground', options.background);
      if (is.defined(options.idx)) {
        if (is.number(options.idx)) {
          this.options.affineIdx = options.idx;
        } else {
          throw is.invalidParameterError('options.idx', 'number', options.idx);
        }
      }
      if (is.defined(options.idy)) {
        if (is.number(options.idy)) {
          this.options.affineIdy = options.idy;
        } else {
          throw is.invalidParameterError('options.idy', 'number', options.idy);
        }
      }
      if (is.defined(options.odx)) {
        if (is.number(options.odx)) {
          this.options.affineOdx = options.odx;
        } else {
          throw is.invalidParameterError('options.odx', 'number', options.odx);
        }
      }
      if (is.defined(options.ody)) {
        if (is.number(options.ody)) {
          this.options.affineOdy = options.ody;
        } else {
          throw is.invalidParameterError('options.ody', 'number', options.ody);
        }
      }
      if (is.defined(options.interpolator)) {
        if (is.inArray(options.interpolator, Object.values(this.constructor.interpolators))) {
          this.options.affineInterpolator = options.interpolator;
        } else {
          throw is.invalidParameterError('options.interpolator', 'valid interpolator name', options.interpolator);
        }
      }
    } else {
      throw is.invalidParameterError('options', 'object', options);
    }
  }

  return this;
}

/**
 * Sharpen the image.
 * When used without parameters, performs a fast, mild sharpen of the output image.
 * When a `sigma` is provided, performs a slower, more accurate sharpen of the L channel in the LAB colour space.
 * Separate control over the level of sharpening in "flat" and "jagged" areas is available.
 *
 * @param {number} [sigma] - the sigma of the Gaussian mask, where `sigma = 1 + radius / 2`.
 * @param {number} [flat=1.0] - the level of sharpening to apply to "flat" areas.
 * @param {number} [jagged=2.0] - the level of sharpening to apply to "jagged" areas.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function sharpen (sigma, flat, jagged) {
  if (!is.defined(sigma)) {
    // No arguments: default to mild sharpen
    this.options.sharpenSigma = -1;
  } else if (is.bool(sigma)) {
    // Boolean argument: apply mild sharpen?
    this.options.sharpenSigma = sigma ? -1 : 0;
  } else if (is.number(sigma) && is.inRange(sigma, 0.01, 10000)) {
    // Numeric argument: specific sigma
    this.options.sharpenSigma = sigma;
    // Control over flat areas
    if (is.defined(flat)) {
      if (is.number(flat) && is.inRange(flat, 0, 10000)) {
        this.options.sharpenFlat = flat;
      } else {
        throw is.invalidParameterError('flat', 'number between 0 and 10000', flat);
      }
    }
    // Control over jagged areas
    if (is.defined(jagged)) {
      if (is.number(jagged) && is.inRange(jagged, 0, 10000)) {
        this.options.sharpenJagged = jagged;
      } else {
        throw is.invalidParameterError('jagged', 'number between 0 and 10000', jagged);
      }
    }
  } else {
    throw is.invalidParameterError('sigma', 'number between 0.01 and 10000', sigma);
  }
  return this;
}

/**
 * Apply median filter.
 * When used without parameters the default window is 3x3.
 * @param {number} [size=3] square mask size: size x size
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function median (size) {
  if (!is.defined(size)) {
    // No arguments: default to 3x3
    this.options.medianSize = 3;
  } else if (is.integer(size) && is.inRange(size, 1, 1000)) {
    // Numeric argument: specific sigma
    this.options.medianSize = size;
  } else {
    throw is.invalidParameterError('size', 'integer between 1 and 1000', size);
  }
  return this;
}

/**
 * Blur the image.
 * When used without parameters, performs a fast, mild blur of the output image.
 * When a `sigma` is provided, performs a slower, more accurate Gaussian blur.
 * @param {number} [sigma] a value between 0.3 and 1000 representing the sigma of the Gaussian mask, where `sigma = 1 + radius / 2`.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function blur (sigma) {
  if (!is.defined(sigma)) {
    // No arguments: default to mild blur
    this.options.blurSigma = -1;
  } else if (is.bool(sigma)) {
    // Boolean argument: apply mild blur?
    this.options.blurSigma = sigma ? -1 : 0;
  } else if (is.number(sigma) && is.inRange(sigma, 0.3, 1000)) {
    // Numeric argument: specific sigma
    this.options.blurSigma = sigma;
  } else {
    throw is.invalidParameterError('sigma', 'number between 0.3 and 1000', sigma);
  }
  return this;
}

/**
 * Merge alpha transparency channel, if any, with a background, then remove the alpha channel.
 *
 * See also {@link /api-channel#removealpha|removeAlpha}.
 *
 * @example
 * await sharp(rgbaInput)
 *   .flatten({ background: '#F0A703' })
 *   .toBuffer();
 *
 * @param {Object} [options]
 * @param {string|Object} [options.background={r: 0, g: 0, b: 0}] - background colour, parsed by the [color](https://www.npmjs.org/package/color) module, defaults to black.
 * @returns {Sharp}
 */
function flatten (options) {
  this.options.flatten = is.bool(options) ? options : true;
  if (is.object(options)) {
    this._setBackgroundColourOption('flattenBackground', options.background);
  }
  return this;
}

/**
 * Apply a gamma correction by reducing the encoding (darken) pre-resize at a factor of `1/gamma`
 * then increasing the encoding (brighten) post-resize at a factor of `gamma`.
 * This can improve the perceived brightness of a resized image in non-linear colour spaces.
 * JPEG and WebP input images will not take advantage of the shrink-on-load performance optimisation
 * when applying a gamma correction.
 *
 * Supply a second argument to use a different output gamma value, otherwise the first value is used in both cases.
 *
 * @param {number} [gamma=2.2] value between 1.0 and 3.0.
 * @param {number} [gammaOut] value between 1.0 and 3.0. (optional, defaults to same as `gamma`)
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function gamma (gamma, gammaOut) {
  if (!is.defined(gamma)) {
    // Default gamma correction of 2.2 (sRGB)
    this.options.gamma = 2.2;
  } else if (is.number(gamma) && is.inRange(gamma, 1, 3)) {
    this.options.gamma = gamma;
  } else {
    throw is.invalidParameterError('gamma', 'number between 1.0 and 3.0', gamma);
  }
  if (!is.defined(gammaOut)) {
    // Default gamma correction for output is same as input
    this.options.gammaOut = this.options.gamma;
  } else if (is.number(gammaOut) && is.inRange(gammaOut, 1, 3)) {
    this.options.gammaOut = gammaOut;
  } else {
    throw is.invalidParameterError('gammaOut', 'number between 1.0 and 3.0', gammaOut);
  }
  return this;
}

/**
 * Produce the "negative" of the image.
 * @param {Boolean} [negate=true]
 * @returns {Sharp}
 */
function negate (negate) {
  this.options.negate = is.bool(negate) ? negate : true;
  return this;
}

/**
 * Enhance output image contrast by stretching its luminance to cover the full dynamic range.
 * @param {Boolean} [normalise=true]
 * @returns {Sharp}
 */
function normalise (normalise) {
  this.options.normalise = is.bool(normalise) ? normalise : true;
  return this;
}

/**
 * Alternative spelling of normalise.
 * @param {Boolean} [normalize=true]
 * @returns {Sharp}
 */
function normalize (normalize) {
  return this.normalise(normalize);
}

/**
 * Perform contrast limiting adaptive histogram equalization
 * {@link https://en.wikipedia.org/wiki/Adaptive_histogram_equalization#Contrast_Limited_AHE|CLAHE}.
 *
 * This will, in general, enhance the clarity of the image by bringing out darker details.
 *
 * @since 0.28.3
 *
 * @param {Object} options
 * @param {number} options.width - integer width of the region in pixels.
 * @param {number} options.height - integer height of the region in pixels.
 * @param {number} [options.maxSlope=3] - maximum value for the slope of the
 *  cumulative histogram. A value of 0 disables contrast limiting. Valid values
 *  are integers in the range 0-100 (inclusive)
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function clahe (options) {
  if (!is.plainObject(options)) {
    throw is.invalidParameterError('options', 'plain object', options);
  }
  if (!('width' in options) || !is.integer(options.width) || options.width <= 0) {
    throw is.invalidParameterError('width', 'integer above zero', options.width);
  } else {
    this.options.claheWidth = options.width;
  }
  if (!('height' in options) || !is.integer(options.height) || options.height <= 0) {
    throw is.invalidParameterError('height', 'integer above zero', options.height);
  } else {
    this.options.claheHeight = options.height;
  }
  if (!is.defined(options.maxSlope)) {
    this.options.claheMaxSlope = 3;
  } else if (!is.integer(options.maxSlope) || options.maxSlope < 0 || options.maxSlope > 100) {
    throw is.invalidParameterError('maxSlope', 'integer 0-100', options.maxSlope);
  } else {
    this.options.claheMaxSlope = options.maxSlope;
  }
  return this;
}

/**
 * Convolve the image with the specified kernel.
 *
 * @example
 * sharp(input)
 *   .convolve({
 *     width: 3,
 *     height: 3,
 *     kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1]
 *   })
 *   .raw()
 *   .toBuffer(function(err, data, info) {
 *     // data contains the raw pixel data representing the convolution
 *     // of the input image with the horizontal Sobel operator
 *   });
 *
 * @param {Object} kernel
 * @param {number} kernel.width - width of the kernel in pixels.
 * @param {number} kernel.height - height of the kernel in pixels.
 * @param {Array<number>} kernel.kernel - Array of length `width*height` containing the kernel values.
 * @param {number} [kernel.scale=sum] - the scale of the kernel in pixels.
 * @param {number} [kernel.offset=0] - the offset of the kernel in pixels.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function convolve (kernel) {
  if (!is.object(kernel) || !Array.isArray(kernel.kernel) ||
      !is.integer(kernel.width) || !is.integer(kernel.height) ||
      !is.inRange(kernel.width, 3, 1001) || !is.inRange(kernel.height, 3, 1001) ||
      kernel.height * kernel.width !== kernel.kernel.length
  ) {
    // must pass in a kernel
    throw new Error('Invalid convolution kernel');
  }
  // Default scale is sum of kernel values
  if (!is.integer(kernel.scale)) {
    kernel.scale = kernel.kernel.reduce(function (a, b) {
      return a + b;
    }, 0);
  }
  // Clip scale to a minimum value of 1
  if (kernel.scale < 1) {
    kernel.scale = 1;
  }
  if (!is.integer(kernel.offset)) {
    kernel.offset = 0;
  }
  this.options.convKernel = kernel;
  return this;
}

/**
 * Any pixel value greater than or equal to the threshold value will be set to 255, otherwise it will be set to 0.
 * @param {number} [threshold=128] - a value in the range 0-255 representing the level at which the threshold will be applied.
 * @param {Object} [options]
 * @param {Boolean} [options.greyscale=true] - convert to single channel greyscale.
 * @param {Boolean} [options.grayscale=true] - alternative spelling for greyscale.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function threshold (threshold, options) {
  if (!is.defined(threshold)) {
    this.options.threshold = 128;
  } else if (is.bool(threshold)) {
    this.options.threshold = threshold ? 128 : 0;
  } else if (is.integer(threshold) && is.inRange(threshold, 0, 255)) {
    this.options.threshold = threshold;
  } else {
    throw is.invalidParameterError('threshold', 'integer between 0 and 255', threshold);
  }
  if (!is.object(options) || options.greyscale === true || options.grayscale === true) {
    this.options.thresholdGrayscale = true;
  } else {
    this.options.thresholdGrayscale = false;
  }
  return this;
}

/**
 * Perform a bitwise boolean operation with operand image.
 *
 * This operation creates an output image where each pixel is the result of
 * the selected bitwise boolean `operation` between the corresponding pixels of the input images.
 *
 * @param {Buffer|string} operand - Buffer containing image data or string containing the path to an image file.
 * @param {string} operator - one of `and`, `or` or `eor` to perform that bitwise operation, like the C logic operators `&`, `|` and `^` respectively.
 * @param {Object} [options]
 * @param {Object} [options.raw] - describes operand when using raw pixel data.
 * @param {number} [options.raw.width]
 * @param {number} [options.raw.height]
 * @param {number} [options.raw.channels]
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function boolean (operand, operator, options) {
  this.options.boolean = this._createInputDescriptor(operand, options);
  if (is.string(operator) && is.inArray(operator, ['and', 'or', 'eor'])) {
    this.options.booleanOp = operator;
  } else {
    throw is.invalidParameterError('operator', 'one of: and, or, eor', operator);
  }
  return this;
}

/**
 * Apply the linear formula a * input + b to the image (levels adjustment)
 * @param {number} [a=1.0] multiplier
 * @param {number} [b=0.0] offset
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function linear (a, b) {
  if (!is.defined(a)) {
    this.options.linearA = 1.0;
  } else if (is.number(a)) {
    this.options.linearA = a;
  } else {
    throw is.invalidParameterError('a', 'numeric', a);
  }
  if (!is.defined(b)) {
    this.options.linearB = 0.0;
  } else if (is.number(b)) {
    this.options.linearB = b;
  } else {
    throw is.invalidParameterError('b', 'numeric', b);
  }
  return this;
}

/**
 * Recomb the image with the specified matrix.
 *
 * @since 0.21.1
 *
 * @example
 * sharp(input)
 *   .recomb([
 *    [0.3588, 0.7044, 0.1368],
 *    [0.2990, 0.5870, 0.1140],
 *    [0.2392, 0.4696, 0.0912],
 *   ])
 *   .raw()
 *   .toBuffer(function(err, data, info) {
 *     // data contains the raw pixel data after applying the recomb
 *     // With this example input, a sepia filter has been applied
 *   });
 *
 * @param {Array<Array<number>>} inputMatrix - 3x3 Recombination matrix
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function recomb (inputMatrix) {
  if (!Array.isArray(inputMatrix) || inputMatrix.length !== 3 ||
      inputMatrix[0].length !== 3 ||
      inputMatrix[1].length !== 3 ||
      inputMatrix[2].length !== 3
  ) {
    // must pass in a kernel
    throw new Error('Invalid recombination matrix');
  }
  this.options.recombMatrix = [
    inputMatrix[0][0], inputMatrix[0][1], inputMatrix[0][2],
    inputMatrix[1][0], inputMatrix[1][1], inputMatrix[1][2],
    inputMatrix[2][0], inputMatrix[2][1], inputMatrix[2][2]
  ].map(Number);
  return this;
}

/**
 * Transforms the image using brightness, saturation and hue rotation.
 *
 * @since 0.22.1
 *
 * @example
 * sharp(input)
 *   .modulate({
 *     brightness: 2 // increase lightness by a factor of 2
 *   });
 *
 * sharp(input)
 *   .modulate({
 *     hue: 180 // hue-rotate by 180 degrees
 *   });
 *
 * // decreate brightness and saturation while also hue-rotating by 90 degrees
 * sharp(input)
 *   .modulate({
 *     brightness: 0.5,
 *     saturation: 0.5,
 *     hue: 90
 *   });
 *
 * @param {Object} [options]
 * @param {number} [options.brightness] Brightness multiplier
 * @param {number} [options.saturation] Saturation multiplier
 * @param {number} [options.hue] Degrees for hue rotation
 * @returns {Sharp}
 */
function modulate (options) {
  if (!is.plainObject(options)) {
    throw is.invalidParameterError('options', 'plain object', options);
  }
  if ('brightness' in options) {
    if (is.number(options.brightness) && options.brightness >= 0) {
      this.options.brightness = options.brightness;
    } else {
      throw is.invalidParameterError('brightness', 'number above zero', options.brightness);
    }
  }
  if ('saturation' in options) {
    if (is.number(options.saturation) && options.saturation >= 0) {
      this.options.saturation = options.saturation;
    } else {
      throw is.invalidParameterError('saturation', 'number above zero', options.saturation);
    }
  }
  if ('hue' in options) {
    if (is.integer(options.hue)) {
      this.options.hue = options.hue % 360;
    } else {
      throw is.invalidParameterError('hue', 'number', options.hue);
    }
  }
  return this;
}

/**
 * Decorate the Sharp prototype with operation-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Object.assign(Sharp.prototype, {
    rotate,
    flip,
    flop,
    affine,
    sharpen,
    median,
    blur,
    flatten,
    gamma,
    negate,
    normalise,
    normalize,
    clahe,
    convolve,
    threshold,
    boolean,
    linear,
    recomb,
    modulate
  });
};


/***/ }),

/***/ 7280:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const is = __nccwpck_require__(768);
const sharp = __nccwpck_require__(2626);

const formats = new Map([
  ['heic', 'heif'],
  ['heif', 'heif'],
  ['avif', 'avif'],
  ['jpeg', 'jpeg'],
  ['jpg', 'jpeg'],
  ['png', 'png'],
  ['raw', 'raw'],
  ['tiff', 'tiff'],
  ['webp', 'webp'],
  ['gif', 'gif']
]);

const errMagickSave = new Error('GIF output requires libvips with support for ImageMagick');

/**
 * Write output image data to a file.
 *
 * If an explicit output format is not selected, it will be inferred from the extension,
 * with JPEG, PNG, WebP, AVIF, TIFF, DZI, and libvips' V format supported.
 * Note that raw pixel data is only supported for buffer output.
 *
 * By default all metadata will be removed, which includes EXIF-based orientation.
 * See {@link withMetadata} for control over this.
 *
 * A `Promise` is returned when `callback` is not provided.
 *
 * @example
 * sharp(input)
 *   .toFile('output.png', (err, info) => { ... });
 *
 * @example
 * sharp(input)
 *   .toFile('output.png')
 *   .then(info => { ... })
 *   .catch(err => { ... });
 *
 * @param {string} fileOut - the path to write the image data to.
 * @param {Function} [callback] - called on completion with two arguments `(err, info)`.
 * `info` contains the output image `format`, `size` (bytes), `width`, `height`,
 * `channels` and `premultiplied` (indicating if premultiplication was used).
 * When using a crop strategy also contains `cropOffsetLeft` and `cropOffsetTop`.
 * @returns {Promise<Object>} - when no callback is provided
 * @throws {Error} Invalid parameters
 */
function toFile (fileOut, callback) {
  let err;
  if (!is.string(fileOut)) {
    err = new Error('Missing output file path');
  } else if (this.options.input.file === fileOut) {
    err = new Error('Cannot use same file for input and output');
  } else if (this.options.formatOut === 'input' && fileOut.toLowerCase().endsWith('.gif') && !this.constructor.format.magick.output.file) {
    err = errMagickSave;
  }
  if (err) {
    if (is.fn(callback)) {
      callback(err);
    } else {
      return Promise.reject(err);
    }
  } else {
    this.options.fileOut = fileOut;
    return this._pipeline(callback);
  }
  return this;
}

/**
 * Write output to a Buffer.
 * JPEG, PNG, WebP, AVIF, TIFF and raw pixel data output are supported.
 *
 * If no explicit format is set, the output format will match the input image, except GIF and SVG input which become PNG output.
 *
 * By default all metadata will be removed, which includes EXIF-based orientation.
 * See {@link withMetadata} for control over this.
 *
 * `callback`, if present, gets three arguments `(err, data, info)` where:
 * - `err` is an error, if any.
 * - `data` is the output image data.
 * - `info` contains the output image `format`, `size` (bytes), `width`, `height`,
 * `channels` and `premultiplied` (indicating if premultiplication was used).
 * When using a crop strategy also contains `cropOffsetLeft` and `cropOffsetTop`.
 *
 * A `Promise` is returned when `callback` is not provided.
 *
 * @example
 * sharp(input)
 *   .toBuffer((err, data, info) => { ... });
 *
 * @example
 * sharp(input)
 *   .toBuffer()
 *   .then(data => { ... })
 *   .catch(err => { ... });
 *
 * @example
 * sharp(input)
 *   .toBuffer({ resolveWithObject: true })
 *   .then(({ data, info }) => { ... })
 *   .catch(err => { ... });
 *
 * @example
 * const { data, info } = await sharp('my-image.jpg')
 *   // output the raw pixels
 *   .raw()
 *   .toBuffer({ resolveWithObject: true });
 *
 * // create a more type safe way to work with the raw pixel data
 * // this will not copy the data, instead it will change `data`s underlying ArrayBuffer
 * // so `data` and `pixelArray` point to the same memory location
 * const pixelArray = new Uint8ClampedArray(data.buffer);
 *
 * // When you are done changing the pixelArray, sharp takes the `pixelArray` as an input
 * const { width, height, channels } = info;
 * await sharp(pixelArray, { raw: { width, height, channels } })
 *   .toFile('my-changed-image.jpg');
 *
 * @param {Object} [options]
 * @param {boolean} [options.resolveWithObject] Resolve the Promise with an Object containing `data` and `info` properties instead of resolving only with `data`.
 * @param {Function} [callback]
 * @returns {Promise<Buffer>} - when no callback is provided
 */
function toBuffer (options, callback) {
  if (is.object(options)) {
    this._setBooleanOption('resolveWithObject', options.resolveWithObject);
  } else if (this.options.resolveWithObject) {
    this.options.resolveWithObject = false;
  }
  return this._pipeline(is.fn(options) ? options : callback);
}

/**
 * Include all metadata (EXIF, XMP, IPTC) from the input image in the output image.
 * This will also convert to and add a web-friendly sRGB ICC profile unless a custom
 * output profile is provided.
 *
 * The default behaviour, when `withMetadata` is not used, is to convert to the device-independent
 * sRGB colour space and strip all metadata, including the removal of any ICC profile.
 *
 * @example
 * sharp('input.jpg')
 *   .withMetadata()
 *   .toFile('output-with-metadata.jpg')
 *   .then(info => { ... });
 *
 * @example
 * // Set "IFD0-Copyright" in output EXIF metadata
 * const data = await sharp(input)
 *   .withMetadata({
 *     exif: {
 *       IFD0: {
 *         Copyright: 'Wernham Hogg'
 *       }
 *     }
 *   })
 *   .toBuffer();
 *
 *  * @example
 * // Set output metadata to 96 DPI
 * const data = await sharp(input)
 *   .withMetadata({ density: 96 })
 *   .toBuffer();
 *
 * @param {Object} [options]
 * @param {number} [options.orientation] value between 1 and 8, used to update the EXIF `Orientation` tag.
 * @param {string} [options.icc] filesystem path to output ICC profile, defaults to sRGB.
 * @param {Object<Object>} [options.exif={}] Object keyed by IFD0, IFD1 etc. of key/value string pairs to write as EXIF data.
 * @param {number} [options.density] Number of pixels per inch (DPI).
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function withMetadata (options) {
  this.options.withMetadata = is.bool(options) ? options : true;
  if (is.object(options)) {
    if (is.defined(options.orientation)) {
      if (is.integer(options.orientation) && is.inRange(options.orientation, 1, 8)) {
        this.options.withMetadataOrientation = options.orientation;
      } else {
        throw is.invalidParameterError('orientation', 'integer between 1 and 8', options.orientation);
      }
    }
    if (is.defined(options.density)) {
      if (is.number(options.density) && options.density > 0) {
        this.options.withMetadataDensity = options.density;
      } else {
        throw is.invalidParameterError('density', 'positive number', options.density);
      }
    }
    if (is.defined(options.icc)) {
      if (is.string(options.icc)) {
        this.options.withMetadataIcc = options.icc;
      } else {
        throw is.invalidParameterError('icc', 'string filesystem path to ICC profile', options.icc);
      }
    }
    if (is.defined(options.exif)) {
      if (is.object(options.exif)) {
        for (const [ifd, entries] of Object.entries(options.exif)) {
          if (is.object(entries)) {
            for (const [k, v] of Object.entries(entries)) {
              if (is.string(v)) {
                this.options.withMetadataStrs[`exif-${ifd.toLowerCase()}-${k}`] = v;
              } else {
                throw is.invalidParameterError(`exif.${ifd}.${k}`, 'string', v);
              }
            }
          } else {
            throw is.invalidParameterError(`exif.${ifd}`, 'object', entries);
          }
        }
      } else {
        throw is.invalidParameterError('exif', 'object', options.exif);
      }
    }
  }
  return this;
}

/**
 * Force output to a given format.
 *
 * @example
 * // Convert any input to PNG output
 * const data = await sharp(input)
 *   .toFormat('png')
 *   .toBuffer();
 *
 * @param {(string|Object)} format - as a string or an Object with an 'id' attribute
 * @param {Object} options - output options
 * @returns {Sharp}
 * @throws {Error} unsupported format or options
 */
function toFormat (format, options) {
  const actualFormat = formats.get((is.object(format) && is.string(format.id) ? format.id : format).toLowerCase());
  if (!actualFormat) {
    throw is.invalidParameterError('format', `one of: ${[...formats.keys()].join(', ')}`, format);
  }
  return this[actualFormat](options);
}

/**
 * Use these JPEG options for output image.
 *
 * @example
 * // Convert any input to very high quality JPEG output
 * const data = await sharp(input)
 *   .jpeg({
 *     quality: 100,
 *     chromaSubsampling: '4:4:4'
 *   })
 *   .toBuffer();
 *
 * @example
 * // Use mozjpeg to reduce output JPEG file size (slower)
 * const data = await sharp(input)
 *   .jpeg({ mozjpeg: true })
 *   .toBuffer();
 *
 * @param {Object} [options] - output options
 * @param {number} [options.quality=80] - quality, integer 1-100
 * @param {boolean} [options.progressive=false] - use progressive (interlace) scan
 * @param {string} [options.chromaSubsampling='4:2:0'] - set to '4:4:4' to prevent chroma subsampling otherwise defaults to '4:2:0' chroma subsampling
 * @param {boolean} [options.optimiseCoding=true] - optimise Huffman coding tables
 * @param {boolean} [options.optimizeCoding=true] - alternative spelling of optimiseCoding
 * @param {boolean} [options.mozjpeg=false] - use mozjpeg defaults, equivalent to `{ trellisQuantisation: true, overshootDeringing: true, optimiseScans: true, quantisationTable: 3 }`
 * @param {boolean} [options.trellisQuantisation=false] - apply trellis quantisation
 * @param {boolean} [options.overshootDeringing=false] - apply overshoot deringing
 * @param {boolean} [options.optimiseScans=false] - optimise progressive scans, forces progressive
 * @param {boolean} [options.optimizeScans=false] - alternative spelling of optimiseScans
 * @param {number} [options.quantisationTable=0] - quantization table to use, integer 0-8
 * @param {number} [options.quantizationTable=0] - alternative spelling of quantisationTable
 * @param {boolean} [options.force=true] - force JPEG output, otherwise attempt to use input format
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
function jpeg (options) {
  if (is.object(options)) {
    if (is.defined(options.quality)) {
      if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
        this.options.jpegQuality = options.quality;
      } else {
        throw is.invalidParameterError('quality', 'integer between 1 and 100', options.quality);
      }
    }
    if (is.defined(options.progressive)) {
      this._setBooleanOption('jpegProgressive', options.progressive);
    }
    if (is.defined(options.chromaSubsampling)) {
      if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ['4:2:0', '4:4:4'])) {
        this.options.jpegChromaSubsampling = options.chromaSubsampling;
      } else {
        throw is.invalidParameterError('chromaSubsampling', 'one of: 4:2:0, 4:4:4', options.chromaSubsampling);
      }
    }
    const optimiseCoding = is.bool(options.optimizeCoding) ? options.optimizeCoding : options.optimiseCoding;
    if (is.defined(optimiseCoding)) {
      this._setBooleanOption('jpegOptimiseCoding', optimiseCoding);
    }
    if (is.defined(options.mozjpeg)) {
      if (is.bool(options.mozjpeg)) {
        if (options.mozjpeg) {
          this.options.jpegTrellisQuantisation = true;
          this.options.jpegOvershootDeringing = true;
          this.options.jpegOptimiseScans = true;
          this.options.jpegProgressive = true;
          this.options.jpegQuantisationTable = 3;
        }
      } else {
        throw is.invalidParameterError('mozjpeg', 'boolean', options.mozjpeg);
      }
    }
    const trellisQuantisation = is.bool(options.trellisQuantization) ? options.trellisQuantization : options.trellisQuantisation;
    if (is.defined(trellisQuantisation)) {
      this._setBooleanOption('jpegTrellisQuantisation', trellisQuantisation);
    }
    if (is.defined(options.overshootDeringing)) {
      this._setBooleanOption('jpegOvershootDeringing', options.overshootDeringing);
    }
    const optimiseScans = is.bool(options.optimizeScans) ? options.optimizeScans : options.optimiseScans;
    if (is.defined(optimiseScans)) {
      this._setBooleanOption('jpegOptimiseScans', optimiseScans);
      if (optimiseScans) {
        this.options.jpegProgressive = true;
      }
    }
    const quantisationTable = is.number(options.quantizationTable) ? options.quantizationTable : options.quantisationTable;
    if (is.defined(quantisationTable)) {
      if (is.integer(quantisationTable) && is.inRange(quantisationTable, 0, 8)) {
        this.options.jpegQuantisationTable = quantisationTable;
      } else {
        throw is.invalidParameterError('quantisationTable', 'integer between 0 and 8', quantisationTable);
      }
    }
  }
  return this._updateFormatOut('jpeg', options);
}

/**
 * Use these PNG options for output image.
 *
 * By default, PNG output is full colour at 8 or 16 bits per pixel.
 * Indexed PNG input at 1, 2 or 4 bits per pixel is converted to 8 bits per pixel.
 * Set `palette` to `true` for slower, indexed PNG output.
 *
 * @example
 * // Convert any input to full colour PNG output
 * const data = await sharp(input)
 *   .png()
 *   .toBuffer();
 *
 * @example
 * // Convert any input to indexed PNG output (slower)
 * const data = await sharp(input)
 *   .png({ palette: true })
 *   .toBuffer();
 *
 * @param {Object} [options]
 * @param {boolean} [options.progressive=false] - use progressive (interlace) scan
 * @param {number} [options.compressionLevel=6] - zlib compression level, 0 (fastest, largest) to 9 (slowest, smallest)
 * @param {boolean} [options.adaptiveFiltering=false] - use adaptive row filtering
 * @param {boolean} [options.palette=false] - quantise to a palette-based image with alpha transparency support
 * @param {number} [options.quality=100] - use the lowest number of colours needed to achieve given quality, sets `palette` to `true`
 * @param {number} [options.colours=256] - maximum number of palette entries, sets `palette` to `true`
 * @param {number} [options.colors=256] - alternative spelling of `options.colours`, sets `palette` to `true`
 * @param {number} [options.dither=1.0] - level of Floyd-Steinberg error diffusion, sets `palette` to `true`
 * @param {boolean} [options.force=true] - force PNG output, otherwise attempt to use input format
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
function png (options) {
  if (is.object(options)) {
    if (is.defined(options.progressive)) {
      this._setBooleanOption('pngProgressive', options.progressive);
    }
    if (is.defined(options.compressionLevel)) {
      if (is.integer(options.compressionLevel) && is.inRange(options.compressionLevel, 0, 9)) {
        this.options.pngCompressionLevel = options.compressionLevel;
      } else {
        throw is.invalidParameterError('compressionLevel', 'integer between 0 and 9', options.compressionLevel);
      }
    }
    if (is.defined(options.adaptiveFiltering)) {
      this._setBooleanOption('pngAdaptiveFiltering', options.adaptiveFiltering);
    }
    if (is.defined(options.palette)) {
      this._setBooleanOption('pngPalette', options.palette);
    } else if (is.defined(options.quality) || is.defined(options.colours || options.colors) || is.defined(options.dither)) {
      this._setBooleanOption('pngPalette', true);
    }
    if (this.options.pngPalette) {
      if (is.defined(options.quality)) {
        if (is.integer(options.quality) && is.inRange(options.quality, 0, 100)) {
          this.options.pngQuality = options.quality;
        } else {
          throw is.invalidParameterError('quality', 'integer between 0 and 100', options.quality);
        }
      }
      const colours = options.colours || options.colors;
      if (is.defined(colours)) {
        if (is.integer(colours) && is.inRange(colours, 2, 256)) {
          this.options.pngColours = colours;
        } else {
          throw is.invalidParameterError('colours', 'integer between 2 and 256', colours);
        }
      }
      if (is.defined(options.dither)) {
        if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
          this.options.pngDither = options.dither;
        } else {
          throw is.invalidParameterError('dither', 'number between 0.0 and 1.0', options.dither);
        }
      }
    }
  }
  return this._updateFormatOut('png', options);
}

/**
 * Use these WebP options for output image.
 *
 * @example
 * // Convert any input to lossless WebP output
 * const data = await sharp(input)
 *   .webp({ lossless: true })
 *   .toBuffer();
 *
 * @example
 * // Optimise the file size of an animated WebP
 * const outputWebp = await sharp(inputWebp, { animated: true })
 *   .webp({ reductionEffort: 6 })
 *   .toBuffer();
 *
 * @param {Object} [options] - output options
 * @param {number} [options.quality=80] - quality, integer 1-100
 * @param {number} [options.alphaQuality=100] - quality of alpha layer, integer 0-100
 * @param {boolean} [options.lossless=false] - use lossless compression mode
 * @param {boolean} [options.nearLossless=false] - use near_lossless compression mode
 * @param {boolean} [options.smartSubsample=false] - use high quality chroma subsampling
 * @param {number} [options.reductionEffort=4] - level of CPU effort to reduce file size, integer 0-6
 * @param {number} [options.pageHeight] - page height for animated output
 * @param {number} [options.loop=0] - number of animation iterations, use 0 for infinite animation
 * @param {number[]} [options.delay] - list of delays between animation frames (in milliseconds)
 * @param {boolean} [options.force=true] - force WebP output, otherwise attempt to use input format
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
function webp (options) {
  if (is.object(options) && is.defined(options.quality)) {
    if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
      this.options.webpQuality = options.quality;
    } else {
      throw is.invalidParameterError('quality', 'integer between 1 and 100', options.quality);
    }
  }
  if (is.object(options) && is.defined(options.alphaQuality)) {
    if (is.integer(options.alphaQuality) && is.inRange(options.alphaQuality, 0, 100)) {
      this.options.webpAlphaQuality = options.alphaQuality;
    } else {
      throw is.invalidParameterError('alphaQuality', 'integer between 0 and 100', options.alphaQuality);
    }
  }
  if (is.object(options) && is.defined(options.lossless)) {
    this._setBooleanOption('webpLossless', options.lossless);
  }
  if (is.object(options) && is.defined(options.nearLossless)) {
    this._setBooleanOption('webpNearLossless', options.nearLossless);
  }
  if (is.object(options) && is.defined(options.smartSubsample)) {
    this._setBooleanOption('webpSmartSubsample', options.smartSubsample);
  }
  if (is.object(options) && is.defined(options.reductionEffort)) {
    if (is.integer(options.reductionEffort) && is.inRange(options.reductionEffort, 0, 6)) {
      this.options.webpReductionEffort = options.reductionEffort;
    } else {
      throw is.invalidParameterError('reductionEffort', 'integer between 0 and 6', options.reductionEffort);
    }
  }

  trySetAnimationOptions(options, this.options);
  return this._updateFormatOut('webp', options);
}

/**
 * Use these GIF options for output image.
 *
 * Requires libvips compiled with support for ImageMagick or GraphicsMagick.
 * The prebuilt binaries do not include this - see
 * {@link https://sharp.pixelplumbing.com/install#custom-libvips installing a custom libvips}.
 *
 * @param {Object} [options] - output options
 * @param {number} [options.pageHeight] - page height for animated output
 * @param {number} [options.loop=0] - number of animation iterations, use 0 for infinite animation
 * @param {number[]} [options.delay] - list of delays between animation frames (in milliseconds)
 * @param {boolean} [options.force=true] - force GIF output, otherwise attempt to use input format
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
/* istanbul ignore next */
function gif (options) {
  if (!this.constructor.format.magick.output.buffer) {
    throw errMagickSave;
  }
  trySetAnimationOptions(options, this.options);
  return this._updateFormatOut('gif', options);
}

/**
 * Set animation options if available.
 * @private
 *
 * @param {Object} [source] - output options
 * @param {number} [source.pageHeight] - page height for animated output
 * @param {number} [source.loop=0] - number of animation iterations, use 0 for infinite animation
 * @param {number[]} [source.delay] - list of delays between animation frames (in milliseconds)
 * @param {Object} [target] - target object for valid options
 * @throws {Error} Invalid options
 */
function trySetAnimationOptions (source, target) {
  if (is.object(source) && is.defined(source.pageHeight)) {
    if (is.integer(source.pageHeight) && source.pageHeight > 0) {
      target.pageHeight = source.pageHeight;
    } else {
      throw is.invalidParameterError('pageHeight', 'integer larger than 0', source.pageHeight);
    }
  }
  if (is.object(source) && is.defined(source.loop)) {
    if (is.integer(source.loop) && is.inRange(source.loop, 0, 65535)) {
      target.loop = source.loop;
    } else {
      throw is.invalidParameterError('loop', 'integer between 0 and 65535', source.loop);
    }
  }
  if (is.object(source) && is.defined(source.delay)) {
    if (
      Array.isArray(source.delay) &&
      source.delay.every(is.integer) &&
      source.delay.every(v => is.inRange(v, 0, 65535))) {
      target.delay = source.delay;
    } else {
      throw is.invalidParameterError('delay', 'array of integers between 0 and 65535', source.delay);
    }
  }
}

/**
 * Use these TIFF options for output image.
 *
 * @example
 * // Convert SVG input to LZW-compressed, 1 bit per pixel TIFF output
 * sharp('input.svg')
 *   .tiff({
 *     compression: 'lzw',
 *     bitdepth: 1
 *   })
 *   .toFile('1-bpp-output.tiff')
 *   .then(info => { ... });
 *
 * @param {Object} [options] - output options
 * @param {number} [options.quality=80] - quality, integer 1-100
 * @param {boolean} [options.force=true] - force TIFF output, otherwise attempt to use input format
 * @param {string} [options.compression='jpeg'] - compression options: lzw, deflate, jpeg, ccittfax4
 * @param {string} [options.predictor='horizontal'] - compression predictor options: none, horizontal, float
 * @param {boolean} [options.pyramid=false] - write an image pyramid
 * @param {boolean} [options.tile=false] - write a tiled tiff
 * @param {number} [options.tileWidth=256] - horizontal tile size
 * @param {number} [options.tileHeight=256] - vertical tile size
 * @param {number} [options.xres=1.0] - horizontal resolution in pixels/mm
 * @param {number} [options.yres=1.0] - vertical resolution in pixels/mm
 * @param {number} [options.bitdepth=8] - reduce bitdepth to 1, 2 or 4 bit
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
function tiff (options) {
  if (is.object(options)) {
    if (is.defined(options.quality)) {
      if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
        this.options.tiffQuality = options.quality;
      } else {
        throw is.invalidParameterError('quality', 'integer between 1 and 100', options.quality);
      }
    }
    if (is.defined(options.bitdepth)) {
      if (is.integer(options.bitdepth) && is.inArray(options.bitdepth, [1, 2, 4, 8])) {
        this.options.tiffBitdepth = options.bitdepth;
      } else {
        throw is.invalidParameterError('bitdepth', '1, 2, 4 or 8', options.bitdepth);
      }
    }
    // tiling
    if (is.defined(options.tile)) {
      this._setBooleanOption('tiffTile', options.tile);
    }
    if (is.defined(options.tileWidth)) {
      if (is.integer(options.tileWidth) && options.tileWidth > 0) {
        this.options.tiffTileWidth = options.tileWidth;
      } else {
        throw is.invalidParameterError('tileWidth', 'integer greater than zero', options.tileWidth);
      }
    }
    if (is.defined(options.tileHeight)) {
      if (is.integer(options.tileHeight) && options.tileHeight > 0) {
        this.options.tiffTileHeight = options.tileHeight;
      } else {
        throw is.invalidParameterError('tileHeight', 'integer greater than zero', options.tileHeight);
      }
    }
    // pyramid
    if (is.defined(options.pyramid)) {
      this._setBooleanOption('tiffPyramid', options.pyramid);
    }
    // resolution
    if (is.defined(options.xres)) {
      if (is.number(options.xres) && options.xres > 0) {
        this.options.tiffXres = options.xres;
      } else {
        throw is.invalidParameterError('xres', 'number greater than zero', options.xres);
      }
    }
    if (is.defined(options.yres)) {
      if (is.number(options.yres) && options.yres > 0) {
        this.options.tiffYres = options.yres;
      } else {
        throw is.invalidParameterError('yres', 'number greater than zero', options.yres);
      }
    }
    // compression
    if (is.defined(options.compression)) {
      if (is.string(options.compression) && is.inArray(options.compression, ['lzw', 'deflate', 'jpeg', 'ccittfax4', 'none'])) {
        this.options.tiffCompression = options.compression;
      } else {
        throw is.invalidParameterError('compression', 'one of: lzw, deflate, jpeg, ccittfax4, none', options.compression);
      }
    }
    // predictor
    if (is.defined(options.predictor)) {
      if (is.string(options.predictor) && is.inArray(options.predictor, ['none', 'horizontal', 'float'])) {
        this.options.tiffPredictor = options.predictor;
      } else {
        throw is.invalidParameterError('predictor', 'one of: none, horizontal, float', options.predictor);
      }
    }
  }
  return this._updateFormatOut('tiff', options);
}

/**
 * Use these AVIF options for output image.
 *
 * Whilst it is possible to create AVIF images smaller than 16x16 pixels,
 * most web browsers do not display these properly.
 *
 * @since 0.27.0
 *
 * @param {Object} [options] - output options
 * @param {number} [options.quality=50] - quality, integer 1-100
 * @param {boolean} [options.lossless=false] - use lossless compression
 * @param {number} [options.speed=5] - CPU effort vs file size, 0 (slowest/smallest) to 8 (fastest/largest)
 * @param {string} [options.chromaSubsampling='4:2:0'] - set to '4:4:4' to prevent chroma subsampling otherwise defaults to '4:2:0' chroma subsampling, requires libvips v8.11.0
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
function avif (options) {
  return this.heif({ ...options, compression: 'av1' });
}

/**
 * Use these HEIF options for output image.
 *
 * Support for patent-encumbered HEIC images requires the use of a
 * globally-installed libvips compiled with support for libheif, libde265 and x265.
 *
 * @since 0.23.0
 *
 * @param {Object} [options] - output options
 * @param {number} [options.quality=50] - quality, integer 1-100
 * @param {string} [options.compression='av1'] - compression format: av1, hevc
 * @param {boolean} [options.lossless=false] - use lossless compression
 * @param {number} [options.speed=5] - CPU effort vs file size, 0 (slowest/smallest) to 8 (fastest/largest)
 * @param {string} [options.chromaSubsampling='4:2:0'] - set to '4:4:4' to prevent chroma subsampling otherwise defaults to '4:2:0' chroma subsampling, requires libvips v8.11.0
 * @returns {Sharp}
 * @throws {Error} Invalid options
 */
function heif (options) {
  if (is.object(options)) {
    if (is.defined(options.quality)) {
      if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
        this.options.heifQuality = options.quality;
      } else {
        throw is.invalidParameterError('quality', 'integer between 1 and 100', options.quality);
      }
    }
    if (is.defined(options.lossless)) {
      if (is.bool(options.lossless)) {
        this.options.heifLossless = options.lossless;
      } else {
        throw is.invalidParameterError('lossless', 'boolean', options.lossless);
      }
    }
    if (is.defined(options.compression)) {
      if (is.string(options.compression) && is.inArray(options.compression, ['av1', 'hevc'])) {
        this.options.heifCompression = options.compression;
      } else {
        throw is.invalidParameterError('compression', 'one of: av1, hevc', options.compression);
      }
    }
    if (is.defined(options.speed)) {
      if (is.integer(options.speed) && is.inRange(options.speed, 0, 8)) {
        this.options.heifSpeed = options.speed;
      } else {
        throw is.invalidParameterError('speed', 'integer between 0 and 8', options.speed);
      }
    }
    if (is.defined(options.chromaSubsampling)) {
      if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ['4:2:0', '4:4:4'])) {
        this.options.heifChromaSubsampling = options.chromaSubsampling;
      } else {
        throw is.invalidParameterError('chromaSubsampling', 'one of: 4:2:0, 4:4:4', options.chromaSubsampling);
      }
    }
  }
  return this._updateFormatOut('heif', options);
}

/**
 * Force output to be raw, uncompressed, 8-bit unsigned integer (unit8) pixel data.
 * Pixel ordering is left-to-right, top-to-bottom, without padding.
 * Channel ordering will be RGB or RGBA for non-greyscale colourspaces.
 *
 * @example
 * // Extract raw RGB pixel data from JPEG input
 * const { data, info } = await sharp('input.jpg')
 *   .raw()
 *   .toBuffer({ resolveWithObject: true });
 *
 * @example
 * // Extract alpha channel as raw pixel data from PNG input
 * const data = await sharp('input.png')
 *   .ensureAlpha()
 *   .extractChannel(3)
 *   .toColourspace('b-w')
 *   .raw()
 *   .toBuffer();
 *
 * @returns {Sharp}
 */
function raw () {
  return this._updateFormatOut('raw');
}

/**
 * Use tile-based deep zoom (image pyramid) output.
 * Set the format and options for tile images via the `toFormat`, `jpeg`, `png` or `webp` functions.
 * Use a `.zip` or `.szi` file extension with `toFile` to write to a compressed archive file format.
 *
 * Warning: multiple sharp instances concurrently producing tile output can expose a possible race condition in some versions of libgsf.
 *
 * @example
 *  sharp('input.tiff')
 *   .png()
 *   .tile({
 *     size: 512
 *   })
 *   .toFile('output.dz', function(err, info) {
 *     // output.dzi is the Deep Zoom XML definition
 *     // output_files contains 512x512 tiles grouped by zoom level
 *   });
 *
 * @param {Object} [options]
 * @param {number} [options.size=256] tile size in pixels, a value between 1 and 8192.
 * @param {number} [options.overlap=0] tile overlap in pixels, a value between 0 and 8192.
 * @param {number} [options.angle=0] tile angle of rotation, must be a multiple of 90.
 * @param {string|Object} [options.background={r: 255, g: 255, b: 255, alpha: 1}] - background colour, parsed by the [color](https://www.npmjs.org/package/color) module, defaults to white without transparency.
 * @param {string} [options.depth] how deep to make the pyramid, possible values are `onepixel`, `onetile` or `one`, default based on layout.
 * @param {number} [options.skipBlanks=-1] threshold to skip tile generation, a value 0 - 255 for 8-bit images or 0 - 65535 for 16-bit images
 * @param {string} [options.container='fs'] tile container, with value `fs` (filesystem) or `zip` (compressed file).
 * @param {string} [options.layout='dz'] filesystem layout, possible values are `dz`, `iiif`, `zoomify` or `google`.
 * @param {boolean} [options.centre=false] centre image in tile.
 * @param {boolean} [options.center=false] alternative spelling of centre.
 * @param {string} [options.id='https://example.com/iiif'] when `layout` is `iiif`, sets the `@id` attribute of `info.json`
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function tile (options) {
  if (is.object(options)) {
    // Size of square tiles, in pixels
    if (is.defined(options.size)) {
      if (is.integer(options.size) && is.inRange(options.size, 1, 8192)) {
        this.options.tileSize = options.size;
      } else {
        throw is.invalidParameterError('size', 'integer between 1 and 8192', options.size);
      }
    }
    // Overlap of tiles, in pixels
    if (is.defined(options.overlap)) {
      if (is.integer(options.overlap) && is.inRange(options.overlap, 0, 8192)) {
        if (options.overlap > this.options.tileSize) {
          throw is.invalidParameterError('overlap', `<= size (${this.options.tileSize})`, options.overlap);
        }
        this.options.tileOverlap = options.overlap;
      } else {
        throw is.invalidParameterError('overlap', 'integer between 0 and 8192', options.overlap);
      }
    }
    // Container
    if (is.defined(options.container)) {
      if (is.string(options.container) && is.inArray(options.container, ['fs', 'zip'])) {
        this.options.tileContainer = options.container;
      } else {
        throw is.invalidParameterError('container', 'one of: fs, zip', options.container);
      }
    }
    // Layout
    if (is.defined(options.layout)) {
      if (is.string(options.layout) && is.inArray(options.layout, ['dz', 'google', 'iiif', 'zoomify'])) {
        this.options.tileLayout = options.layout;
      } else {
        throw is.invalidParameterError('layout', 'one of: dz, google, iiif, zoomify', options.layout);
      }
    }
    // Angle of rotation,
    if (is.defined(options.angle)) {
      if (is.integer(options.angle) && !(options.angle % 90)) {
        this.options.tileAngle = options.angle;
      } else {
        throw is.invalidParameterError('angle', 'positive/negative multiple of 90', options.angle);
      }
    }
    // Background colour
    this._setBackgroundColourOption('tileBackground', options.background);
    // Depth of tiles
    if (is.defined(options.depth)) {
      if (is.string(options.depth) && is.inArray(options.depth, ['onepixel', 'onetile', 'one'])) {
        this.options.tileDepth = options.depth;
      } else {
        throw is.invalidParameterError('depth', 'one of: onepixel, onetile, one', options.depth);
      }
    }
    // Threshold to skip blank tiles
    if (is.defined(options.skipBlanks)) {
      if (is.integer(options.skipBlanks) && is.inRange(options.skipBlanks, -1, 65535)) {
        this.options.tileSkipBlanks = options.skipBlanks;
      } else {
        throw is.invalidParameterError('skipBlanks', 'integer between -1 and 255/65535', options.skipBlanks);
      }
    } else if (is.defined(options.layout) && options.layout === 'google') {
      this.options.tileSkipBlanks = 5;
    }
    // Center image in tile
    const centre = is.bool(options.center) ? options.center : options.centre;
    if (is.defined(centre)) {
      this._setBooleanOption('tileCentre', centre);
    }
    // @id attribute for IIIF layout
    if (is.defined(options.id)) {
      if (is.string(options.id)) {
        this.options.tileId = options.id;
      } else {
        throw is.invalidParameterError('id', 'string', options.id);
      }
    }
  }
  // Format
  if (is.inArray(this.options.formatOut, ['jpeg', 'png', 'webp'])) {
    this.options.tileFormat = this.options.formatOut;
  } else if (this.options.formatOut !== 'input') {
    throw is.invalidParameterError('format', 'one of: jpeg, png, webp', this.options.formatOut);
  }
  return this._updateFormatOut('dz');
}

/**
 * Update the output format unless options.force is false,
 * in which case revert to input format.
 * @private
 * @param {string} formatOut
 * @param {Object} [options]
 * @param {boolean} [options.force=true] - force output format, otherwise attempt to use input format
 * @returns {Sharp}
 */
function _updateFormatOut (formatOut, options) {
  if (!(is.object(options) && options.force === false)) {
    this.options.formatOut = formatOut;
  }
  return this;
}

/**
 * Update a boolean attribute of the this.options Object.
 * @private
 * @param {string} key
 * @param {boolean} val
 * @throws {Error} Invalid key
 */
function _setBooleanOption (key, val) {
  if (is.bool(val)) {
    this.options[key] = val;
  } else {
    throw is.invalidParameterError(key, 'boolean', val);
  }
}

/**
 * Called by a WriteableStream to notify us it is ready for data.
 * @private
 */
function _read () {
  /* istanbul ignore else */
  if (!this.options.streamOut) {
    this.options.streamOut = true;
    this._pipeline();
  }
}

/**
 * Invoke the C++ image processing pipeline
 * Supports callback, stream and promise variants
 * @private
 */
function _pipeline (callback) {
  if (typeof callback === 'function') {
    // output=file/buffer
    if (this._isStreamInput()) {
      // output=file/buffer, input=stream
      this.on('finish', () => {
        this._flattenBufferIn();
        sharp.pipeline(this.options, callback);
      });
    } else {
      // output=file/buffer, input=file/buffer
      sharp.pipeline(this.options, callback);
    }
    return this;
  } else if (this.options.streamOut) {
    // output=stream
    if (this._isStreamInput()) {
      // output=stream, input=stream
      this.once('finish', () => {
        this._flattenBufferIn();
        sharp.pipeline(this.options, (err, data, info) => {
          if (err) {
            this.emit('error', err);
          } else {
            this.emit('info', info);
            this.push(data);
          }
          this.push(null);
        });
      });
      if (this.streamInFinished) {
        this.emit('finish');
      }
    } else {
      // output=stream, input=file/buffer
      sharp.pipeline(this.options, (err, data, info) => {
        if (err) {
          this.emit('error', err);
        } else {
          this.emit('info', info);
          this.push(data);
        }
        this.push(null);
      });
    }
    return this;
  } else {
    // output=promise
    if (this._isStreamInput()) {
      // output=promise, input=stream
      return new Promise((resolve, reject) => {
        this.once('finish', () => {
          this._flattenBufferIn();
          sharp.pipeline(this.options, (err, data, info) => {
            if (err) {
              reject(err);
            } else {
              if (this.options.resolveWithObject) {
                resolve({ data, info });
              } else {
                resolve(data);
              }
            }
          });
        });
      });
    } else {
      // output=promise, input=file/buffer
      return new Promise((resolve, reject) => {
        sharp.pipeline(this.options, (err, data, info) => {
          if (err) {
            reject(err);
          } else {
            if (this.options.resolveWithObject) {
              resolve({ data: data, info: info });
            } else {
              resolve(data);
            }
          }
        });
      });
    }
  }
}

/**
 * Decorate the Sharp prototype with output-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Object.assign(Sharp.prototype, {
    // Public
    toFile,
    toBuffer,
    withMetadata,
    toFormat,
    jpeg,
    png,
    webp,
    tiff,
    avif,
    heif,
    gif,
    raw,
    tile,
    // Private
    _updateFormatOut,
    _setBooleanOption,
    _read,
    _pipeline
  });
};


/***/ }),

/***/ 1998:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const detectLibc = __nccwpck_require__(4889);

const env = process.env;

module.exports = function () {
  const arch = env.npm_config_arch || process.arch;
  const platform = env.npm_config_platform || process.platform;
  /* istanbul ignore next */
  const libc = (platform === 'linux' && detectLibc.isNonGlibcLinux) ? detectLibc.family : '';

  const platformId = [`${platform}${libc}`];

  if (arch === 'arm') {
    const fallback = process.versions.electron ? '7' : '6';
    platformId.push(`armv${env.npm_config_arm_version || process.config.variables.arm_version || fallback}`);
  } else if (arch === 'arm64') {
    platformId.push(`arm64v${env.npm_config_arm_version || '8'}`);
  } else {
    platformId.push(arch);
  }

  return platformId.join('-');
};


/***/ }),

/***/ 2932:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const is = __nccwpck_require__(768);

/**
 * Weighting to apply when using contain/cover fit.
 * @member
 * @private
 */
const gravity = {
  center: 0,
  centre: 0,
  north: 1,
  east: 2,
  south: 3,
  west: 4,
  northeast: 5,
  southeast: 6,
  southwest: 7,
  northwest: 8
};

/**
 * Position to apply when using contain/cover fit.
 * @member
 * @private
 */
const position = {
  top: 1,
  right: 2,
  bottom: 3,
  left: 4,
  'right top': 5,
  'right bottom': 6,
  'left bottom': 7,
  'left top': 8
};

/**
 * Strategies for automagic cover behaviour.
 * @member
 * @private
 */
const strategy = {
  entropy: 16,
  attention: 17
};

/**
 * Reduction kernels.
 * @member
 * @private
 */
const kernel = {
  nearest: 'nearest',
  cubic: 'cubic',
  mitchell: 'mitchell',
  lanczos2: 'lanczos2',
  lanczos3: 'lanczos3'
};

/**
 * Methods by which an image can be resized to fit the provided dimensions.
 * @member
 * @private
 */
const fit = {
  contain: 'contain',
  cover: 'cover',
  fill: 'fill',
  inside: 'inside',
  outside: 'outside'
};

/**
 * Map external fit property to internal canvas property.
 * @member
 * @private
 */
const mapFitToCanvas = {
  contain: 'embed',
  cover: 'crop',
  fill: 'ignore_aspect',
  inside: 'max',
  outside: 'min'
};

/**
 * @private
 */
function isRotationExpected (options) {
  return (options.angle % 360) !== 0 || options.useExifOrientation === true || options.rotationAngle !== 0;
}

/**
 * Resize image to `width`, `height` or `width x height`.
 *
 * When both a `width` and `height` are provided, the possible methods by which the image should **fit** these are:
 * - `cover`: (default) Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit.
 * - `contain`: Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
 * - `fill`: Ignore the aspect ratio of the input and stretch to both provided dimensions.
 * - `inside`: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
 * - `outside`: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
 *
 * Some of these values are based on the [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property.
 *
 * When using a `fit` of `cover` or `contain`, the default **position** is `centre`. Other options are:
 * - `sharp.position`: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`.
 * - `sharp.gravity`: `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center` or `centre`.
 * - `sharp.strategy`: `cover` only, dynamically crop using either the `entropy` or `attention` strategy.
 *
 * Some of these values are based on the [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) CSS property.
 *
 * The experimental strategy-based approach resizes so one dimension is at its target length
 * then repeatedly ranks edge regions, discarding the edge with the lowest score based on the selected strategy.
 * - `entropy`: focus on the region with the highest [Shannon entropy](https://en.wikipedia.org/wiki/Entropy_%28information_theory%29).
 * - `attention`: focus on the region with the highest luminance frequency, colour saturation and presence of skin tones.
 *
 * Possible interpolation kernels are:
 * - `nearest`: Use [nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation).
 * - `cubic`: Use a [Catmull-Rom spline](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline).
 * - `mitchell`: Use a [Mitchell-Netravali spline](https://www.cs.utexas.edu/~fussell/courses/cs384g-fall2013/lectures/mitchell/Mitchell.pdf).
 * - `lanczos2`: Use a [Lanczos kernel](https://en.wikipedia.org/wiki/Lanczos_resampling#Lanczos_kernel) with `a=2`.
 * - `lanczos3`: Use a Lanczos kernel with `a=3` (the default).
 *
 * @example
 * sharp(input)
 *   .resize({ width: 100 })
 *   .toBuffer()
 *   .then(data => {
 *     // 100 pixels wide, auto-scaled height
 *   });
 *
 * @example
 * sharp(input)
 *   .resize({ height: 100 })
 *   .toBuffer()
 *   .then(data => {
 *     // 100 pixels high, auto-scaled width
 *   });
 *
 * @example
 * sharp(input)
 *   .resize(200, 300, {
 *     kernel: sharp.kernel.nearest,
 *     fit: 'contain',
 *     position: 'right top',
 *     background: { r: 255, g: 255, b: 255, alpha: 0.5 }
 *   })
 *   .toFile('output.png')
 *   .then(() => {
 *     // output.png is a 200 pixels wide and 300 pixels high image
 *     // containing a nearest-neighbour scaled version
 *     // contained within the north-east corner of a semi-transparent white canvas
 *   });
 *
 * @example
 * const transformer = sharp()
 *   .resize({
 *     width: 200,
 *     height: 200,
 *     fit: sharp.fit.cover,
 *     position: sharp.strategy.entropy
 *   });
 * // Read image data from readableStream
 * // Write 200px square auto-cropped image data to writableStream
 * readableStream
 *   .pipe(transformer)
 *   .pipe(writableStream);
 *
 * @example
 * sharp(input)
 *   .resize(200, 200, {
 *     fit: sharp.fit.inside,
 *     withoutEnlargement: true
 *   })
 *   .toFormat('jpeg')
 *   .toBuffer()
 *   .then(function(outputBuffer) {
 *     // outputBuffer contains JPEG image data
 *     // no wider and no higher than 200 pixels
 *     // and no larger than the input image
 *   });
 *
 * @example
 * const scaleByHalf = await sharp(input)
 *   .metadata()
 *   .then(({ width }) => sharp(input)
 *     .resize(Math.round(width * 0.5))
 *     .toBuffer()
 *   );
 *
 * @param {number} [width] - pixels wide the resultant image should be. Use `null` or `undefined` to auto-scale the width to match the height.
 * @param {number} [height] - pixels high the resultant image should be. Use `null` or `undefined` to auto-scale the height to match the width.
 * @param {Object} [options]
 * @param {String} [options.width] - alternative means of specifying `width`. If both are present this take priority.
 * @param {String} [options.height] - alternative means of specifying `height`. If both are present this take priority.
 * @param {String} [options.fit='cover'] - how the image should be resized to fit both provided dimensions, one of `cover`, `contain`, `fill`, `inside` or `outside`.
 * @param {String} [options.position='centre'] - position, gravity or strategy to use when `fit` is `cover` or `contain`.
 * @param {String|Object} [options.background={r: 0, g: 0, b: 0, alpha: 1}] - background colour when using a `fit` of `contain`, parsed by the [color](https://www.npmjs.org/package/color) module, defaults to black without transparency.
 * @param {String} [options.kernel='lanczos3'] - the kernel to use for image reduction.
 * @param {Boolean} [options.withoutEnlargement=false] - do not enlarge if the width *or* height are already less than the specified dimensions, equivalent to GraphicsMagick's `>` geometry option.
 * @param {Boolean} [options.fastShrinkOnLoad=true] - take greater advantage of the JPEG and WebP shrink-on-load feature, which can lead to a slight moiré pattern on some images.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function resize (width, height, options) {
  if (is.defined(width)) {
    if (is.object(width) && !is.defined(options)) {
      options = width;
    } else if (is.integer(width) && width > 0) {
      this.options.width = width;
    } else {
      throw is.invalidParameterError('width', 'positive integer', width);
    }
  } else {
    this.options.width = -1;
  }
  if (is.defined(height)) {
    if (is.integer(height) && height > 0) {
      this.options.height = height;
    } else {
      throw is.invalidParameterError('height', 'positive integer', height);
    }
  } else {
    this.options.height = -1;
  }
  if (is.object(options)) {
    // Width
    if (is.defined(options.width)) {
      if (is.integer(options.width) && options.width > 0) {
        this.options.width = options.width;
      } else {
        throw is.invalidParameterError('width', 'positive integer', options.width);
      }
    }
    // Height
    if (is.defined(options.height)) {
      if (is.integer(options.height) && options.height > 0) {
        this.options.height = options.height;
      } else {
        throw is.invalidParameterError('height', 'positive integer', options.height);
      }
    }
    // Fit
    if (is.defined(options.fit)) {
      const canvas = mapFitToCanvas[options.fit];
      if (is.string(canvas)) {
        this.options.canvas = canvas;
      } else {
        throw is.invalidParameterError('fit', 'valid fit', options.fit);
      }
    }
    // Position
    if (is.defined(options.position)) {
      const pos = is.integer(options.position)
        ? options.position
        : strategy[options.position] || position[options.position] || gravity[options.position];
      if (is.integer(pos) && (is.inRange(pos, 0, 8) || is.inRange(pos, 16, 17))) {
        this.options.position = pos;
      } else {
        throw is.invalidParameterError('position', 'valid position/gravity/strategy', options.position);
      }
    }
    // Background
    this._setBackgroundColourOption('resizeBackground', options.background);
    // Kernel
    if (is.defined(options.kernel)) {
      if (is.string(kernel[options.kernel])) {
        this.options.kernel = kernel[options.kernel];
      } else {
        throw is.invalidParameterError('kernel', 'valid kernel name', options.kernel);
      }
    }
    // Without enlargement
    if (is.defined(options.withoutEnlargement)) {
      this._setBooleanOption('withoutEnlargement', options.withoutEnlargement);
    }
    // Shrink on load
    if (is.defined(options.fastShrinkOnLoad)) {
      this._setBooleanOption('fastShrinkOnLoad', options.fastShrinkOnLoad);
    }
  }
  return this;
}

/**
 * Extends/pads the edges of the image with the provided background colour.
 * This operation will always occur after resizing and extraction, if any.
 *
 * @example
 * // Resize to 140 pixels wide, then add 10 transparent pixels
 * // to the top, left and right edges and 20 to the bottom edge
 * sharp(input)
 *   .resize(140)
 *   .extend({
 *     top: 10,
 *     bottom: 20,
 *     left: 10,
 *     right: 10,
 *     background: { r: 0, g: 0, b: 0, alpha: 0 }
 *   })
 *   ...
 *
* @example
 * // Add a row of 10 red pixels to the bottom
 * sharp(input)
 *   .extend({
 *     bottom: 10,
 *     background: 'red'
 *   })
 *   ...
 *
 * @param {(number|Object)} extend - single pixel count to add to all edges or an Object with per-edge counts
 * @param {number} [extend.top=0]
 * @param {number} [extend.left=0]
 * @param {number} [extend.bottom=0]
 * @param {number} [extend.right=0]
 * @param {String|Object} [extend.background={r: 0, g: 0, b: 0, alpha: 1}] - background colour, parsed by the [color](https://www.npmjs.org/package/color) module, defaults to black without transparency.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
*/
function extend (extend) {
  if (is.integer(extend) && extend > 0) {
    this.options.extendTop = extend;
    this.options.extendBottom = extend;
    this.options.extendLeft = extend;
    this.options.extendRight = extend;
  } else if (is.object(extend)) {
    if (is.defined(extend.top)) {
      if (is.integer(extend.top) && extend.top >= 0) {
        this.options.extendTop = extend.top;
      } else {
        throw is.invalidParameterError('top', 'positive integer', extend.top);
      }
    }
    if (is.defined(extend.bottom)) {
      if (is.integer(extend.bottom) && extend.bottom >= 0) {
        this.options.extendBottom = extend.bottom;
      } else {
        throw is.invalidParameterError('bottom', 'positive integer', extend.bottom);
      }
    }
    if (is.defined(extend.left)) {
      if (is.integer(extend.left) && extend.left >= 0) {
        this.options.extendLeft = extend.left;
      } else {
        throw is.invalidParameterError('left', 'positive integer', extend.left);
      }
    }
    if (is.defined(extend.right)) {
      if (is.integer(extend.right) && extend.right >= 0) {
        this.options.extendRight = extend.right;
      } else {
        throw is.invalidParameterError('right', 'positive integer', extend.right);
      }
    }
    this._setBackgroundColourOption('extendBackground', extend.background);
  } else {
    throw is.invalidParameterError('extend', 'integer or object', extend);
  }
  return this;
}

/**
 * Extract/crop a region of the image.
 *
 * - Use `extract` before `resize` for pre-resize extraction.
 * - Use `extract` after `resize` for post-resize extraction.
 * - Use `extract` before and after for both.
 *
 * @example
 * sharp(input)
 *   .extract({ left: left, top: top, width: width, height: height })
 *   .toFile(output, function(err) {
 *     // Extract a region of the input image, saving in the same format.
 *   });
 * @example
 * sharp(input)
 *   .extract({ left: leftOffsetPre, top: topOffsetPre, width: widthPre, height: heightPre })
 *   .resize(width, height)
 *   .extract({ left: leftOffsetPost, top: topOffsetPost, width: widthPost, height: heightPost })
 *   .toFile(output, function(err) {
 *     // Extract a region, resize, then extract from the resized image
 *   });
 *
 * @param {Object} options - describes the region to extract using integral pixel values
 * @param {number} options.left - zero-indexed offset from left edge
 * @param {number} options.top - zero-indexed offset from top edge
 * @param {number} options.width - width of region to extract
 * @param {number} options.height - height of region to extract
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function extract (options) {
  const suffix = this.options.width === -1 && this.options.height === -1 ? 'Pre' : 'Post';
  ['left', 'top', 'width', 'height'].forEach(function (name) {
    const value = options[name];
    if (is.integer(value) && value >= 0) {
      this.options[name + (name === 'left' || name === 'top' ? 'Offset' : '') + suffix] = value;
    } else {
      throw is.invalidParameterError(name, 'integer', value);
    }
  }, this);
  // Ensure existing rotation occurs before pre-resize extraction
  if (suffix === 'Pre' && isRotationExpected(this.options)) {
    this.options.rotateBeforePreExtract = true;
  }
  return this;
}

/**
 * Trim "boring" pixels from all edges that contain values similar to the top-left pixel.
 * Images consisting entirely of a single colour will calculate "boring" using the alpha channel, if any.
 *
 * The `info` response Object, obtained from callback of `.toFile()` or `.toBuffer()`,
 * will contain `trimOffsetLeft` and `trimOffsetTop` properties.
 *
 * @param {number} [threshold=10] the allowed difference from the top-left pixel, a number greater than zero.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */
function trim (threshold) {
  if (!is.defined(threshold)) {
    this.options.trimThreshold = 10;
  } else if (is.number(threshold) && threshold > 0) {
    this.options.trimThreshold = threshold;
  } else {
    throw is.invalidParameterError('threshold', 'number greater than zero', threshold);
  }
  if (this.options.trimThreshold && isRotationExpected(this.options)) {
    this.options.rotateBeforePreExtract = true;
  }
  return this;
}

/**
 * Decorate the Sharp prototype with resize-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Object.assign(Sharp.prototype, {
    resize,
    extend,
    extract,
    trim
  });
  // Class attributes
  Sharp.gravity = gravity;
  Sharp.strategy = strategy;
  Sharp.kernel = kernel;
  Sharp.fit = fit;
  Sharp.position = position;
};


/***/ }),

/***/ 9927:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

function __ncc_wildcard$0 (arg) {
  if (arg === "8.10.6") return __nccwpck_require__(4272);
}
'use strict';

const events = __nccwpck_require__(8614);
const detectLibc = __nccwpck_require__(4889);

const is = __nccwpck_require__(768);
const sharp = __nccwpck_require__(2626);

/**
 * An Object containing nested boolean values representing the available input and output formats/methods.
 * @member
 * @example
 * console.log(sharp.format);
 * @returns {Object}
 */
const format = sharp.format();

/**
 * An Object containing the available interpolators and their proper values
 * @readonly
 * @enum {string}
 */
const interpolators = {
  /** [Nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation). Suitable for image enlargement only. */
  nearest: 'nearest',
  /** [Bilinear interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation). Faster than bicubic but with less smooth results. */
  bilinear: 'bilinear',
  /** [Bicubic interpolation](http://en.wikipedia.org/wiki/Bicubic_interpolation) (the default). */
  bicubic: 'bicubic',
  /** [LBB interpolation](https://github.com/jcupitt/libvips/blob/master/libvips/resample/lbb.cpp#L100). Prevents some "[acutance](http://en.wikipedia.org/wiki/Acutance)" but typically reduces performance by a factor of 2. */
  locallyBoundedBicubic: 'lbb',
  /** [Nohalo interpolation](http://eprints.soton.ac.uk/268086/). Prevents acutance but typically reduces performance by a factor of 3. */
  nohalo: 'nohalo',
  /** [VSQBS interpolation](https://github.com/jcupitt/libvips/blob/master/libvips/resample/vsqbs.cpp#L48). Prevents "staircasing" when enlarging. */
  vertexSplitQuadraticBasisSpline: 'vsqbs'
};

/**
 * An Object containing the version numbers of libvips and its dependencies.
 * @member
 * @example
 * console.log(sharp.versions);
 */
let versions = {
  vips: sharp.libvipsVersion()
};
try {
  versions = __ncc_wildcard$0(versions.vips);
} catch (err) {}

/**
 * Gets or, when options are provided, sets the limits of _libvips'_ operation cache.
 * Existing entries in the cache will be trimmed after any change in limits.
 * This method always returns cache statistics,
 * useful for determining how much working memory is required for a particular task.
 *
 * @example
 * const stats = sharp.cache();
 * @example
 * sharp.cache( { items: 200 } );
 * sharp.cache( { files: 0 } );
 * sharp.cache(false);
 *
 * @param {Object|boolean} [options=true] - Object with the following attributes, or boolean where true uses default cache settings and false removes all caching
 * @param {number} [options.memory=50] - is the maximum memory in MB to use for this cache
 * @param {number} [options.files=20] - is the maximum number of files to hold open
 * @param {number} [options.items=100] - is the maximum number of operations to cache
 * @returns {Object}
 */
function cache (options) {
  if (is.bool(options)) {
    if (options) {
      // Default cache settings of 50MB, 20 files, 100 items
      return sharp.cache(50, 20, 100);
    } else {
      return sharp.cache(0, 0, 0);
    }
  } else if (is.object(options)) {
    return sharp.cache(options.memory, options.files, options.items);
  } else {
    return sharp.cache();
  }
}
cache(true);

/**
 * Gets or, when a concurrency is provided, sets
 * the number of threads _libvips'_ should create to process each image.
 *
 * The default value is the number of CPU cores,
 * except when using glibc-based Linux without jemalloc,
 * where the default is `1` to help reduce memory fragmentation.
 *
 * A value of `0` will reset this to the number of CPU cores.
 *
 * The maximum number of images that can be processed in parallel
 * is limited by libuv's `UV_THREADPOOL_SIZE` environment variable.
 *
 * This method always returns the current concurrency.
 *
 * @example
 * const threads = sharp.concurrency(); // 4
 * sharp.concurrency(2); // 2
 * sharp.concurrency(0); // 4
 *
 * @param {number} [concurrency]
 * @returns {number} concurrency
 */
function concurrency (concurrency) {
  return sharp.concurrency(is.integer(concurrency) ? concurrency : null);
}
/* istanbul ignore next */
if (detectLibc.family === detectLibc.GLIBC && !sharp._isUsingJemalloc()) {
  // Reduce default concurrency to 1 when using glibc memory allocator
  sharp.concurrency(1);
}

/**
 * An EventEmitter that emits a `change` event when a task is either:
 * - queued, waiting for _libuv_ to provide a worker thread
 * - complete
 * @member
 * @example
 * sharp.queue.on('change', function(queueLength) {
 *   console.log('Queue contains ' + queueLength + ' task(s)');
 * });
 */
const queue = new events.EventEmitter();

/**
 * Provides access to internal task counters.
 * - queue is the number of tasks this module has queued waiting for _libuv_ to provide a worker thread from its pool.
 * - process is the number of resize tasks currently being processed.
 *
 * @example
 * const counters = sharp.counters(); // { queue: 2, process: 4 }
 *
 * @returns {Object}
 */
function counters () {
  return sharp.counters();
}

/**
 * Get and set use of SIMD vector unit instructions.
 * Requires libvips to have been compiled with liborc support.
 *
 * Improves the performance of `resize`, `blur` and `sharpen` operations
 * by taking advantage of the SIMD vector unit of the CPU, e.g. Intel SSE and ARM NEON.
 *
 * @example
 * const simd = sharp.simd();
 * // simd is `true` if the runtime use of liborc is currently enabled
 * @example
 * const simd = sharp.simd(false);
 * // prevent libvips from using liborc at runtime
 *
 * @param {boolean} [simd=true]
 * @returns {boolean}
 */
function simd (simd) {
  return sharp.simd(is.bool(simd) ? simd : null);
}
simd(true);

/**
 * Decorate the Sharp class with utility-related functions.
 * @private
 */
module.exports = function (Sharp) {
  Sharp.cache = cache;
  Sharp.concurrency = concurrency;
  Sharp.counters = counters;
  Sharp.simd = simd;
  Sharp.format = format;
  Sharp.interpolators = interpolators;
  Sharp.versions = versions;
  Sharp.queue = queue;
};


/***/ }),

/***/ 8867:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(2455)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(665)
const { re, t } = __nccwpck_require__(521)

const parseOptions = __nccwpck_require__(3197)
const { compareIdentifiers } = __nccwpck_require__(4682)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 6073:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8867)
const parse = __nccwpck_require__(9200)
const {re, t} = __nccwpck_require__(521)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null)
    return null

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 3925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8867)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 9343:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(3925)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 9200:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {MAX_LENGTH} = __nccwpck_require__(665)
const { re, t } = __nccwpck_require__(521)
const SemVer = __nccwpck_require__(8867)

const parseOptions = __nccwpck_require__(3197)
const parse = (version, options) => {
  options = parseOptions(options)

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse


/***/ }),

/***/ 665:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH
}


/***/ }),

/***/ 2455:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 4682:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers
}


/***/ }),

/***/ 3197:
/***/ ((module) => {

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl']
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((options, k) => {
    options[k] = true
    return options
  }, {})
module.exports = parseOptions


/***/ }),

/***/ 521:
/***/ ((module, exports, __nccwpck_require__) => {

const { MAX_SAFE_COMPONENT_LENGTH } = __nccwpck_require__(665)
const debug = __nccwpck_require__(2455)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$')


/***/ }),

/***/ 7032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const shebangRegex = __nccwpck_require__(2638);

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};


/***/ }),

/***/ 2638:
/***/ ((module) => {

"use strict";

module.exports = /^#!(.*)/;


/***/ }),

/***/ 4931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __nccwpck_require__(2357)
var signals = __nccwpck_require__(3710)
var isWin = /^win/i.test(process.platform)

var EE = __nccwpck_require__(8614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 3710:
/***/ ((module) => {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 8679:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isArrayish = __nccwpck_require__(8542);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ }),

/***/ 8542:
/***/ ((module) => {

module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ }),

/***/ 8174:
/***/ ((module) => {

"use strict";


module.exports = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};


/***/ }),

/***/ 5051:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractTokenizer = void 0;
const peek_readable_1 = __nccwpck_require__(3752);
/**
 * Core tokenizer
 */
class AbstractTokenizer {
    constructor(fileInfo) {
        /**
         * Tokenizer-stream position
         */
        this.position = 0;
        this.numBuffer = Buffer.alloc(10);
        this.fileInfo = fileInfo ? fileInfo : {};
    }
    /**
     * Read a token from the tokenizer-stream
     * @param token - The token to read
     * @param position - If provided, the desired position in the tokenizer-stream
     * @returns Promise with token data
     */
    async readToken(token, position) {
        const buffer = Buffer.alloc(token.len);
        const len = await this.readBuffer(buffer, { position });
        if (len < token.len)
            throw new peek_readable_1.EndOfStreamError();
        return token.get(buffer, 0);
    }
    /**
     * Peek a token from the tokenizer-stream.
     * @param token - Token to peek from the tokenizer-stream.
     * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
     * @returns Promise with token data
     */
    async peekToken(token, position = this.position) {
        const buffer = Buffer.alloc(token.len);
        const len = await this.peekBuffer(buffer, { position });
        if (len < token.len)
            throw new peek_readable_1.EndOfStreamError();
        return token.get(buffer, 0);
    }
    /**
     * Read a numeric token from the stream
     * @param token - Numeric token
     * @returns Promise with number
     */
    async readNumber(token) {
        const len = await this.readBuffer(this.numBuffer, { length: token.len });
        if (len < token.len)
            throw new peek_readable_1.EndOfStreamError();
        return token.get(this.numBuffer, 0);
    }
    /**
     * Read a numeric token from the stream
     * @param token - Numeric token
     * @returns Promise with number
     */
    async peekNumber(token) {
        const len = await this.peekBuffer(this.numBuffer, { length: token.len });
        if (len < token.len)
            throw new peek_readable_1.EndOfStreamError();
        return token.get(this.numBuffer, 0);
    }
    async close() {
        // empty
    }
}
exports.AbstractTokenizer = AbstractTokenizer;


/***/ }),

/***/ 8054:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BufferTokenizer = void 0;
const peek_readable_1 = __nccwpck_require__(3752);
class BufferTokenizer {
    /**
     * Construct BufferTokenizer
     * @param buffer - Buffer to tokenize
     * @param fileInfo - Pass additional file information to the tokenizer
     */
    constructor(buffer, fileInfo) {
        this.buffer = buffer;
        this.position = 0;
        this.fileInfo = fileInfo ? fileInfo : {};
        this.fileInfo.size = this.fileInfo.size ? this.fileInfo.size : buffer.length;
    }
    /**
     * Read buffer from tokenizer
     * @param buffer
     * @param options - Read behaviour options
     * @returns {Promise<number>}
     */
    async readBuffer(buffer, options) {
        if (options && options.position) {
            if (options.position < this.position) {
                throw new Error('`options.position` must be equal or greater than `tokenizer.position`');
            }
            this.position = options.position;
        }
        return this.peekBuffer(buffer, options).then(bytesRead => {
            this.position += bytesRead;
            return bytesRead;
        });
    }
    /**
     * Peek (read ahead) buffer from tokenizer
     * @param buffer
     * @param options - Read behaviour options
     * @returns {Promise<number>}
     */
    async peekBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        let position = this.position;
        if (options) {
            if (options.position) {
                if (options.position < this.position) {
                    throw new Error('`options.position` can be less than `tokenizer.position`');
                }
                position = options.position;
            }
            if (Number.isInteger(options.length)) {
                length = options.length;
            }
            else {
                length -= options.offset || 0;
            }
            if (options.offset) {
                offset = options.offset;
            }
        }
        if (length === 0) {
            return Promise.resolve(0);
        }
        position = position || this.position;
        if (!length) {
            length = buffer.length;
        }
        const bytes2read = Math.min(this.buffer.length - position, length);
        if ((!options || !options.mayBeLess) && bytes2read < length) {
            throw new peek_readable_1.EndOfStreamError();
        }
        else {
            this.buffer.copy(buffer, offset, position, position + bytes2read);
            return bytes2read;
        }
    }
    async readToken(token, position) {
        this.position = position || this.position;
        try {
            const tv = this.peekToken(token, this.position);
            this.position += token.len;
            return tv;
        }
        catch (err) {
            this.position += this.buffer.length - position;
            throw err;
        }
    }
    async peekToken(token, position = this.position) {
        if (this.buffer.length - position < token.len) {
            throw new peek_readable_1.EndOfStreamError();
        }
        return token.get(this.buffer, position);
    }
    async readNumber(token) {
        return this.readToken(token);
    }
    async peekNumber(token) {
        return this.peekToken(token);
    }
    /**
     * @return actual number of bytes ignored
     */
    async ignore(length) {
        const bytesIgnored = Math.min(this.buffer.length - this.position, length);
        this.position += bytesIgnored;
        return bytesIgnored;
    }
    async close() {
        // empty
    }
}
exports.BufferTokenizer = BufferTokenizer;


/***/ }),

/***/ 561:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromFile = exports.FileTokenizer = void 0;
const AbstractTokenizer_1 = __nccwpck_require__(5051);
const peek_readable_1 = __nccwpck_require__(3752);
const fs = __nccwpck_require__(3915);
class FileTokenizer extends AbstractTokenizer_1.AbstractTokenizer {
    constructor(fd, fileInfo) {
        super(fileInfo);
        this.fd = fd;
    }
    /**
     * Read buffer from file
     * @param buffer
     * @param options - Read behaviour options
     * @returns Promise number of bytes read
     */
    async readBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        if (options) {
            if (options.position) {
                if (options.position < this.position) {
                    throw new Error('`options.position` must be equal or greater than `tokenizer.position`');
                }
                this.position = options.position;
            }
            if (Number.isInteger(options.length)) {
                length = options.length;
            }
            else {
                length -= options.offset || 0;
            }
            if (options.offset) {
                offset = options.offset;
            }
        }
        if (length === 0) {
            return Promise.resolve(0);
        }
        const res = await fs.read(this.fd, buffer, offset, length, this.position);
        this.position += res.bytesRead;
        if (res.bytesRead < length && (!options || !options.mayBeLess)) {
            throw new peek_readable_1.EndOfStreamError();
        }
        return res.bytesRead;
    }
    /**
     * Peek buffer from file
     * @param buffer
     * @param options - Read behaviour options
     * @returns Promise number of bytes read
     */
    async peekBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        let position = this.position;
        if (options) {
            if (options.position) {
                if (options.position < this.position) {
                    throw new Error('`options.position` must be equal or greater than `tokenizer.position`');
                }
                position = options.position;
            }
            if (Number.isInteger(options.length)) {
                length = options.length;
            }
            else {
                length -= options.offset || 0;
            }
            if (options.offset) {
                offset = options.offset;
            }
        }
        if (length === 0) {
            return Promise.resolve(0);
        }
        const res = await fs.read(this.fd, buffer, offset, length, position);
        if ((!options || !options.mayBeLess) && res.bytesRead < length) {
            throw new peek_readable_1.EndOfStreamError();
        }
        return res.bytesRead;
    }
    /**
     * @param length - Number of bytes to ignore
     * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
     */
    async ignore(length) {
        const bytesLeft = this.fileInfo.size - this.position;
        if (length <= bytesLeft) {
            this.position += length;
            return length;
        }
        else {
            this.position += bytesLeft;
            return bytesLeft;
        }
    }
    async close() {
        return fs.close(this.fd);
    }
}
exports.FileTokenizer = FileTokenizer;
async function fromFile(sourceFilePath) {
    const stat = await fs.stat(sourceFilePath);
    if (!stat.isFile) {
        throw new Error(`File not a file: ${sourceFilePath}`);
    }
    const fd = await fs.open(sourceFilePath, 'r');
    return new FileTokenizer(fd, { path: sourceFilePath, size: stat.size });
}
exports.fromFile = fromFile;


/***/ }),

/***/ 3915:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/**
 * Module convert fs functions to promise based functions
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readFile = exports.writeFileSync = exports.writeFile = exports.read = exports.open = exports.close = exports.stat = exports.createReadStream = exports.pathExists = void 0;
const fs = __nccwpck_require__(5747);
exports.pathExists = fs.existsSync;
exports.createReadStream = fs.createReadStream;
async function stat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err)
                reject(err);
            else
                resolve(stats);
        });
    });
}
exports.stat = stat;
async function close(fd) {
    return new Promise((resolve, reject) => {
        fs.close(fd, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
exports.close = close;
async function open(path, mode) {
    return new Promise((resolve, reject) => {
        fs.open(path, mode, (err, fd) => {
            if (err)
                reject(err);
            else
                resolve(fd);
        });
    });
}
exports.open = open;
async function read(fd, buffer, offset, length, position) {
    return new Promise((resolve, reject) => {
        fs.read(fd, buffer, offset, length, position, (err, bytesRead, _buffer) => {
            if (err)
                reject(err);
            else
                resolve({ bytesRead, buffer: _buffer });
        });
    });
}
exports.read = read;
async function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
exports.writeFile = writeFile;
function writeFileSync(path, data) {
    fs.writeFileSync(path, data);
}
exports.writeFileSync = writeFileSync;
async function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, buffer) => {
            if (err)
                reject(err);
            else
                resolve(buffer);
        });
    });
}
exports.readFile = readFile;


/***/ }),

/***/ 8888:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadStreamTokenizer = void 0;
const AbstractTokenizer_1 = __nccwpck_require__(5051);
const peek_readable_1 = __nccwpck_require__(3752);
// import * as _debug from 'debug';
// const debug = _debug('strtok3:ReadStreamTokenizer');
const maxBufferSize = 256000;
class ReadStreamTokenizer extends AbstractTokenizer_1.AbstractTokenizer {
    constructor(stream, fileInfo) {
        super(fileInfo);
        this.streamReader = new peek_readable_1.StreamReader(stream);
    }
    /**
     * Get file information, an HTTP-client may implement this doing a HEAD request
     * @return Promise with file information
     */
    async getFileInfo() {
        return this.fileInfo;
    }
    /**
     * Read buffer from tokenizer
     * @param buffer - Target buffer to fill with data read from the tokenizer-stream
     * @param options - Read behaviour options
     * @returns Promise with number of bytes read
     */
    async readBuffer(buffer, options) {
        // const _offset = position ? position : this.position;
        // debug(`readBuffer ${_offset}...${_offset + length - 1}`);
        let offset = 0;
        let length = buffer.length;
        if (options) {
            if (Number.isInteger(options.length)) {
                length = options.length;
            }
            else {
                length -= options.offset || 0;
            }
            if (options.position) {
                const skipBytes = options.position - this.position;
                if (skipBytes > 0) {
                    await this.ignore(skipBytes);
                    return this.readBuffer(buffer, options);
                }
                else if (skipBytes < 0) {
                    throw new Error('`options.position` must be equal or greater than `tokenizer.position`');
                }
            }
            if (options.offset) {
                offset = options.offset;
            }
        }
        if (length === 0) {
            return 0;
        }
        const bytesRead = await this.streamReader.read(buffer, offset, length);
        this.position += bytesRead;
        if ((!options || !options.mayBeLess) && bytesRead < length) {
            throw new peek_readable_1.EndOfStreamError();
        }
        return bytesRead;
    }
    /**
     * Peek (read ahead) buffer from tokenizer
     * @param buffer - Target buffer to write the data read to
     * @param options - Read behaviour options
     * @returns Promise with number of bytes peeked
     */
    async peekBuffer(buffer, options) {
        // const _offset = position ? position : this.position;
        // debug(`peek ${_offset}...${_offset + length - 1}`);
        let offset = 0;
        let bytesRead;
        let length = buffer.length;
        if (options) {
            if (options.offset) {
                offset = options.offset;
            }
            if (Number.isInteger(options.length)) {
                length = options.length;
            }
            else {
                length -= options.offset || 0;
            }
            if (options.position) {
                const skipBytes = options.position - this.position;
                if (skipBytes > 0) {
                    const skipBuffer = Buffer.alloc(length + skipBytes);
                    bytesRead = await this.peekBuffer(skipBuffer, { mayBeLess: options.mayBeLess });
                    skipBuffer.copy(buffer, offset, skipBytes);
                    return bytesRead - skipBytes;
                }
                else if (skipBytes < 0) {
                    throw new Error('Cannot peek from a negative offset in a stream');
                }
            }
        }
        try {
            bytesRead = await this.streamReader.peek(buffer, offset, length);
        }
        catch (err) {
            if (options && options.mayBeLess && err instanceof peek_readable_1.EndOfStreamError) {
                return 0;
            }
            throw err;
        }
        if ((!options || !options.mayBeLess) && bytesRead < length) {
            throw new peek_readable_1.EndOfStreamError();
        }
        return bytesRead;
    }
    async ignore(length) {
        // debug(`ignore ${this.position}...${this.position + length - 1}`);
        const bufSize = Math.min(maxBufferSize, length);
        const buf = Buffer.alloc(bufSize);
        let totBytesRead = 0;
        while (totBytesRead < length) {
            const remaining = length - totBytesRead;
            const bytesRead = await this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
            if (bytesRead < 0) {
                return bytesRead;
            }
            totBytesRead += bytesRead;
        }
        return totBytesRead;
    }
}
exports.ReadStreamTokenizer = ReadStreamTokenizer;


/***/ }),

/***/ 3026:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromBuffer = exports.fromStream = exports.EndOfStreamError = void 0;
const ReadStreamTokenizer_1 = __nccwpck_require__(8888);
const BufferTokenizer_1 = __nccwpck_require__(8054);
var peek_readable_1 = __nccwpck_require__(3752);
Object.defineProperty(exports, "EndOfStreamError", ({ enumerable: true, get: function () { return peek_readable_1.EndOfStreamError; } }));
/**
 * Construct ReadStreamTokenizer from given Stream.
 * Will set fileSize, if provided given Stream has set the .path property/
 * @param stream - Read from Node.js Stream.Readable
 * @param fileInfo - Pass the file information, like size and MIME-type of the correspnding stream.
 * @returns ReadStreamTokenizer
 */
function fromStream(stream, fileInfo) {
    fileInfo = fileInfo ? fileInfo : {};
    return new ReadStreamTokenizer_1.ReadStreamTokenizer(stream, fileInfo);
}
exports.fromStream = fromStream;
/**
 * Construct ReadStreamTokenizer from given Buffer.
 * @param buffer - Buffer to tokenize
 * @param fileInfo - Pass additional file information to the tokenizer
 * @returns BufferTokenizer
 */
function fromBuffer(buffer, fileInfo) {
    return new BufferTokenizer_1.BufferTokenizer(buffer, fileInfo);
}
exports.fromBuffer = fromBuffer;


/***/ }),

/***/ 2635:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromStream = exports.fromBuffer = exports.EndOfStreamError = exports.fromFile = void 0;
const fs = __nccwpck_require__(3915);
const core = __nccwpck_require__(3026);
var FileTokenizer_1 = __nccwpck_require__(561);
Object.defineProperty(exports, "fromFile", ({ enumerable: true, get: function () { return FileTokenizer_1.fromFile; } }));
var core_1 = __nccwpck_require__(3026);
Object.defineProperty(exports, "EndOfStreamError", ({ enumerable: true, get: function () { return core_1.EndOfStreamError; } }));
Object.defineProperty(exports, "fromBuffer", ({ enumerable: true, get: function () { return core_1.fromBuffer; } }));
/**
 * Construct ReadStreamTokenizer from given Stream.
 * Will set fileSize, if provided given Stream has set the .path property.
 * @param stream - Node.js Stream.Readable
 * @param fileInfo - Pass additional file information to the tokenizer
 * @returns Tokenizer
 */
async function fromStream(stream, fileInfo) {
    fileInfo = fileInfo ? fileInfo : {};
    if (stream.path) {
        const stat = await fs.stat(stream.path);
        fileInfo.path = stream.path;
        fileInfo.size = stat.size;
    }
    return core.fromStream(stream, fileInfo);
}
exports.fromStream = fromStream;


/***/ }),

/***/ 4261:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.writeIntBE = exports.readIntBE = exports.writeUIntBE = exports.readUIntBE = exports.writeIntLE = exports.AnsiStringType = exports.StringType = exports.BufferType = exports.IgnoreType = exports.Float80_LE = exports.Float80_BE = exports.Float64_LE = exports.Float64_BE = exports.Float32_LE = exports.Float32_BE = exports.Float16_LE = exports.Float16_BE = exports.INT64_BE = exports.UINT64_BE = exports.INT64_LE = exports.UINT64_LE = exports.INT32_LE = exports.INT32_BE = exports.INT24_BE = exports.INT24_LE = exports.INT16_LE = exports.INT16_BE = exports.INT8 = exports.UINT32_BE = exports.UINT32_LE = exports.UINT24_BE = exports.UINT24_LE = exports.UINT16_BE = exports.UINT16_LE = exports.UINT8 = void 0;
const ieee754 = __nccwpck_require__(3092);
// Primitive types
/**
 * 8-bit unsigned integer
 */
exports.UINT8 = {
    len: 1,
    get(buf, off) {
        return buf.readUInt8(off);
    },
    put(buf, off, v) {
        return buf.writeUInt8(v, off);
    }
};
/**
 * 16-bit unsigned integer, Little Endian byte order
 */
exports.UINT16_LE = {
    len: 2,
    get(buf, off) {
        return buf.readUInt16LE(off);
    },
    put(buf, off, v) {
        return buf.writeUInt16LE(v, off);
    }
};
/**
 * 16-bit unsigned integer, Big Endian byte order
 */
exports.UINT16_BE = {
    len: 2,
    get(buf, off) {
        return buf.readUInt16BE(off);
    },
    put(buf, off, v) {
        return buf.writeUInt16BE(v, off);
    }
};
/**
 * 24-bit unsigned integer, Little Endian byte order
 */
exports.UINT24_LE = {
    len: 3,
    get(buf, off) {
        return buf.readUIntLE(off, 3);
    },
    put(buf, off, v) {
        return buf.writeUIntLE(v, off, 3);
    }
};
/**
 * 24-bit unsigned integer, Big Endian byte order
 */
exports.UINT24_BE = {
    len: 3,
    get(buf, off) {
        return buf.readUIntBE(off, 3);
    },
    put(buf, off, v) {
        return buf.writeUIntBE(v, off, 3);
    }
};
/**
 * 32-bit unsigned integer, Little Endian byte order
 */
exports.UINT32_LE = {
    len: 4,
    get(buf, off) {
        return buf.readUInt32LE(off);
    },
    put(b, o, v) {
        return b.writeUInt32LE(v, o);
    }
};
/**
 * 32-bit unsigned integer, Big Endian byte order
 */
exports.UINT32_BE = {
    len: 4,
    get(buf, off) {
        return buf.readUInt32BE(off);
    },
    put(buf, off, v) {
        return buf.writeUInt32BE(v, off);
    }
};
/**
 * 8-bit signed integer
 */
exports.INT8 = {
    len: 1,
    get(buf, off) {
        return buf.readInt8(off);
    },
    put(buf, off, v) {
        return buf.writeInt8(v, off);
    }
};
/**
 * 16-bit signed integer, Big Endian byte order
 */
exports.INT16_BE = {
    len: 2,
    get(buf, off) {
        return buf.readInt16BE(off);
    },
    put(b, o, v) {
        return b.writeInt16BE(v, o);
    }
};
/**
 * 16-bit signed integer, Little Endian byte order
 */
exports.INT16_LE = {
    len: 2,
    get(buf, off) {
        return buf.readInt16LE(off);
    },
    put(b, o, v) {
        return b.writeInt16LE(v, o);
    }
};
/**
 * 24-bit signed integer, Little Endian byte order
 */
exports.INT24_LE = {
    len: 3,
    get(buf, off) {
        return buf.readIntLE(off, 3);
    },
    put(b, o, v) {
        return b.writeIntLE(v, o, 3);
    }
};
/**
 * 24-bit signed integer, Big Endian byte order
 */
exports.INT24_BE = {
    len: 3,
    get(buf, off) {
        return buf.readIntBE(off, 3);
    },
    put(b, o, v) {
        return b.writeIntBE(v, o, 3);
    }
};
/**
 * 32-bit signed integer, Big Endian byte order
 */
exports.INT32_BE = {
    len: 4,
    get(buf, off) {
        return buf.readInt32BE(off);
    },
    put(b, o, v) {
        return b.writeInt32BE(v, o);
    }
};
/**
 * 32-bit signed integer, Big Endian byte order
 */
exports.INT32_LE = {
    len: 4,
    get(buf, off) {
        return buf.readInt32LE(off);
    },
    put(b, o, v) {
        return b.writeInt32LE(v, o);
    }
};
/**
 * 64-bit unsigned integer, Little Endian byte order
 */
exports.UINT64_LE = {
    len: 8,
    get(buf, off) {
        return readUIntLE(buf, off, this.len);
    },
    put(b, o, v) {
        return writeUIntLE(b, v, o, this.len);
    }
};
/**
 * 64-bit signed integer, Little Endian byte order
 */
exports.INT64_LE = {
    len: 8,
    get(buf, off) {
        return readIntLE(buf, off, this.len);
    },
    put(b, off, v) {
        return writeIntLE(b, v, off, this.len);
    }
};
/**
 * 64-bit unsigned integer, Big Endian byte order
 */
exports.UINT64_BE = {
    len: 8,
    get(b, off) {
        return readUIntBE(b, off, this.len);
    },
    put(b, o, v) {
        return writeUIntBE(b, v, o, this.len);
    }
};
/**
 * 64-bit signed integer, Big Endian byte order
 */
exports.INT64_BE = {
    len: 8,
    get(b, off) {
        return readIntBE(b, off, this.len);
    },
    put(b, off, v) {
        return writeIntBE(b, v, off, this.len);
    }
};
/**
 * IEEE 754 16-bit (half precision) float, big endian
 */
exports.Float16_BE = {
    len: 2,
    get(b, off) {
        return ieee754.read(b, off, false, 10, this.len);
    },
    put(b, off, v) {
        ieee754.write(b, v, off, false, 10, this.len);
        return off + this.len;
    }
};
/**
 * IEEE 754 16-bit (half precision) float, little endian
 */
exports.Float16_LE = {
    len: 2,
    get(b, off) {
        return ieee754.read(b, off, true, 10, this.len);
    },
    put(b, off, v) {
        ieee754.write(b, v, off, true, 10, this.len);
        return off + this.len;
    }
};
/**
 * IEEE 754 32-bit (single precision) float, big endian
 */
exports.Float32_BE = {
    len: 4,
    get(b, off) {
        return b.readFloatBE(off);
    },
    put(b, off, v) {
        return b.writeFloatBE(v, off);
    }
};
/**
 * IEEE 754 32-bit (single precision) float, little endian
 */
exports.Float32_LE = {
    len: 4,
    get(b, off) {
        return b.readFloatLE(off);
    },
    put(b, off, v) {
        return b.writeFloatLE(v, off);
    }
};
/**
 * IEEE 754 64-bit (double precision) float, big endian
 */
exports.Float64_BE = {
    len: 8,
    get(b, off) {
        return b.readDoubleBE(off);
    },
    put(b, off, v) {
        return b.writeDoubleBE(v, off);
    }
};
/**
 * IEEE 754 64-bit (double precision) float, little endian
 */
exports.Float64_LE = {
    len: 8,
    get(b, off) {
        return b.readDoubleLE(off);
    },
    put(b, off, v) {
        return b.writeDoubleLE(v, off);
    }
};
/**
 * IEEE 754 80-bit (extended precision) float, big endian
 */
exports.Float80_BE = {
    len: 10,
    get(b, off) {
        return ieee754.read(b, off, false, 63, this.len);
    },
    put(b, off, v) {
        ieee754.write(b, v, off, false, 63, this.len);
        return off + this.len;
    }
};
/**
 * IEEE 754 80-bit (extended precision) float, little endian
 */
exports.Float80_LE = {
    len: 10,
    get(b, off) {
        return ieee754.read(b, off, true, 63, this.len);
    },
    put(b, off, v) {
        ieee754.write(b, v, off, true, 63, this.len);
        return off + this.len;
    }
};
/**
 * Ignore a given number of bytes
 */
class IgnoreType {
    /**
     * @param len number of bytes to ignore
     */
    constructor(len) {
        this.len = len;
    }
    // ToDo: don't read, but skip data
    get(buf, off) {
    }
}
exports.IgnoreType = IgnoreType;
class BufferType {
    constructor(len) {
        this.len = len;
    }
    get(buf, off) {
        return buf.slice(off, off + this.len);
    }
}
exports.BufferType = BufferType;
/**
 * Consume a fixed number of bytes from the stream and return a string with a specified encoding.
 */
class StringType {
    constructor(len, encoding) {
        this.len = len;
        this.encoding = encoding;
    }
    get(buf, off) {
        return buf.toString(this.encoding, off, off + this.len);
    }
}
exports.StringType = StringType;
/**
 * ANSI Latin 1 String
 * Using windows-1252 / ISO 8859-1 decoding
 */
class AnsiStringType {
    constructor(len) {
        this.len = len;
    }
    static decode(buffer, off, until) {
        let str = '';
        for (let i = off; i < until; ++i) {
            str += AnsiStringType.codePointToString(AnsiStringType.singleByteDecoder(buffer[i]));
        }
        return str;
    }
    static inRange(a, min, max) {
        return min <= a && a <= max;
    }
    static codePointToString(cp) {
        if (cp <= 0xFFFF) {
            return String.fromCharCode(cp);
        }
        else {
            cp -= 0x10000;
            return String.fromCharCode((cp >> 10) + 0xD800, (cp & 0x3FF) + 0xDC00);
        }
    }
    static singleByteDecoder(bite) {
        if (AnsiStringType.inRange(bite, 0x00, 0x7F)) {
            return bite;
        }
        const codePoint = AnsiStringType.windows1252[bite - 0x80];
        if (codePoint === null) {
            throw Error('invaliding encoding');
        }
        return codePoint;
    }
    get(buf, off = 0) {
        return AnsiStringType.decode(buf, off, off + this.len);
    }
}
exports.AnsiStringType = AnsiStringType;
AnsiStringType.windows1252 = [8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352,
    8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732,
    8482, 353, 8250, 339, 157, 382, 376, 160, 161, 162, 163, 164, 165, 166, 167, 168,
    169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184,
    185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200,
    201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216,
    217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232,
    233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,
    248, 249, 250, 251, 252, 253, 254, 255];
/**
 * Best effort approach to read up to 64 bit unsigned integer, little endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function readUIntLE(buf, offset, byteLength) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    let val = buf[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
        val += buf[offset + i] * mul;
    }
    return val;
}
/**
 * Best effort approach to write up to 64 bit unsigned integer, little endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function writeUIntLE(buf, value, offset, byteLength) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    let mul = 1;
    let i = 0;
    buf[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
        buf[offset + i] = (value / mul) & 0xFF;
    }
    return offset + byteLength;
}
/**
 * Best effort approach to read 64 but signed integer, little endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function readIntLE(buf, offset, byteLength) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    let val = buf[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
        val += buf[offset + i] * mul;
    }
    mul *= 0x80;
    if (val >= mul)
        val -= Math.pow(2, 8 * byteLength);
    return val;
}
/**
 * Best effort approach to write 64 but signed integer, little endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function writeIntLE(buf, value, offset, byteLength) {
    value = +value;
    offset = offset >>> 0;
    let i = 0;
    let mul = 1;
    let sub = 0;
    buf[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && buf[offset + i - 1] !== 0) {
            sub = 1;
        }
        buf[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
}
exports.writeIntLE = writeIntLE;
/**
 * Best effort approach to read up to 64 bit unsigned integer, big endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function readUIntBE(buf, offset, byteLength) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    let val = buf[offset + --byteLength];
    let mul = 1;
    while (byteLength > 0 && (mul *= 0x100)) {
        val += buf[offset + --byteLength] * mul;
    }
    return val;
}
exports.readUIntBE = readUIntBE;
/**
 * Best effort approach to write up to 64 bit unsigned integer, big endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function writeUIntBE(buf, value, offset, byteLength) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    let i = byteLength - 1;
    let mul = 1;
    buf[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
        buf[offset + i] = (value / mul) & 0xFF;
    }
    return offset + byteLength;
}
exports.writeUIntBE = writeUIntBE;
/**
 * Best effort approach to read 64 but signed integer, big endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function readIntBE(buf, offset, byteLength) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    let i = byteLength;
    let mul = 1;
    let val = buf[offset + --i];
    while (i > 0 && (mul *= 0x100)) {
        val += buf[offset + --i] * mul;
    }
    mul *= 0x80;
    if (val >= mul)
        val -= Math.pow(2, 8 * byteLength);
    return val;
}
exports.readIntBE = readIntBE;
/**
 * Best effort approach to write 64 but signed integer, big endian.
 * Note that JavasScript is limited to 2^53 - 1 bit.
 */
function writeIntBE(buf, value, offset, byteLength) {
    value = +value;
    offset = offset >>> 0;
    let i = byteLength - 1;
    let mul = 1;
    let sub = 0;
    buf[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && buf[offset + i + 1] !== 0) {
            sub = 1;
        }
        buf[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
}
exports.writeIntBE = writeIntBE;


/***/ }),

/***/ 4207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(5622)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(7126)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 2626:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = require(__nccwpck_require__.ab + "build/Release/sharp.node")

/***/ }),

/***/ 5976:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"_args":[["mozjpeg@7.0.0","/home/runner/work/image-compress-action/image-compress-action"]],"_from":"mozjpeg@7.0.0","_id":"mozjpeg@7.0.0","_inBundle":false,"_integrity":"sha512-mH7atSbIusVTO3A4H43sEdmveN3aWn54k6V0edefzCEvOsTrbjg5murY2TsNznaztWnIgaRbWxeLVp4IgKdedQ==","_location":"/mozjpeg","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"mozjpeg@7.0.0","name":"mozjpeg","escapedName":"mozjpeg","rawSpec":"7.0.0","saveSpec":null,"fetchSpec":"7.0.0"},"_requiredBy":["/imagemin-mozjpeg"],"_resolved":"https://registry.npmjs.org/mozjpeg/-/mozjpeg-7.0.0.tgz","_spec":"7.0.0","_where":"/home/runner/work/image-compress-action/image-compress-action","ava":{"serial":true},"bin":{"mozjpeg":"cli.js"},"bugs":{"url":"https://github.com/imagemin/mozjpeg-bin/issues"},"dependencies":{"bin-build":"^3.0.0","bin-wrapper":"^4.0.0","logalot":"^2.1.0"},"description":"mozjpeg wrapper that makes it seamlessly available as a local dependency","devDependencies":{"ava":"^3.8.0","bin-check":"^4.1.0","compare-size":"^3.0.0","execa":"^4.0.0","tempy":"^0.5.0","xo":"^0.30.0"},"engines":{"node":">=10"},"files":["index.js","cli.js","lib","vendor/source"],"homepage":"https://github.com/imagemin/mozjpeg-bin#readme","keywords":["imagemin","jpeg","jpg","img","image","compress","minify","mozjpeg","optimize"],"license":"MIT","name":"mozjpeg","repository":{"type":"git","url":"git+https://github.com/imagemin/mozjpeg-bin.git"},"scripts":{"build-linux":"docker build --tag imagemin/mozjpeg docker && docker run --rm --volume $(pwd)/vendor/linux:/src/out imagemin/mozjpeg cp cjpeg /src/out","postinstall":"node lib/install.js","test":"xo && ava --timeout=120s"},"version":"7.0.0"}');

/***/ }),

/***/ 2749:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"_args":[["pngquant-bin@6.0.0","/home/runner/work/image-compress-action/image-compress-action"]],"_from":"pngquant-bin@6.0.0","_id":"pngquant-bin@6.0.0","_inBundle":false,"_integrity":"sha512-oXWAS9MQ9iiDAJRdAZ9KO1mC5UwhzKkJsmetiu0iqIjJuW7JsuLhmc4JdRm7uJkIWRzIAou/Vq2VcjfJwz30Ow==","_location":"/pngquant-bin","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"pngquant-bin@6.0.0","name":"pngquant-bin","escapedName":"pngquant-bin","rawSpec":"6.0.0","saveSpec":null,"fetchSpec":"6.0.0"},"_requiredBy":["/imagemin-pngquant"],"_resolved":"https://registry.npmjs.org/pngquant-bin/-/pngquant-bin-6.0.0.tgz","_spec":"6.0.0","_where":"/home/runner/work/image-compress-action/image-compress-action","author":{"name":"Kevin Mårtensson","email":"kevinmartensson@gmail.com","url":"github.com/kevva"},"bin":{"pngquant":"cli.js"},"bugs":{"url":"https://github.com/imagemin/pngquant-bin/issues"},"dependencies":{"bin-build":"^3.0.0","bin-wrapper":"^4.0.1","execa":"^4.0.0","logalot":"^2.0.0"},"description":"`pngquant` wrapper that makes it seamlessly available as a local dependency","devDependencies":{"ava":"^3.8.0","bin-check":"^4.0.1","compare-size":"^3.0.0","tempy":"^0.5.0","xo":"^0.30.0"},"engines":{"node":">=10"},"files":["cli.js","index.js","lib","vendor/source"],"homepage":"https://github.com/imagemin/pngquant-bin#readme","keywords":["imagemin","compress","image","img","minify","optimize","png","pngquant"],"license":"GPL-3.0+","maintainers":[{"name":"Sindre Sorhus","email":"sindresorhus@gmail.com","url":"sindresorhus.com"},{"name":"Shinnosuke Watanabe","url":"github.com/shinnn"}],"name":"pngquant-bin","repository":{"type":"git","url":"git+https://github.com/imagemin/pngquant-bin.git"},"scripts":{"postinstall":"node lib/install.js","test":"xo && ava"},"version":"6.0.0"}');

/***/ }),

/***/ 1062:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"vc":{"W0":"8.10.6"}}');

/***/ }),

/***/ 4272:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"aom":"3.0.0","cairo":"1.17.4","exif":"0.6.22","expat":"2.3.0","ffi":"3.3","fontconfig":"2.13.93","freetype":"2.10.4","fribidi":"1.0.10","gdkpixbuf":"2.42.4","gettext":"0.21","gif":"5.1.4","glib":"2.68.0","gsf":"1.14.47","harfbuzz":"2.8.0","heif":"1.11.0","imagequant":"2.4.1","lcms":"2.12","mozjpeg":"4.0.3","orc":"0.4.32","pango":"1.48.3","pixman":"0.40.0","png":"1.6.37","svg":"2.51.0","spng":"0.6.2","tiff":"4.2.0","vips":"8.10.6","webp":"1.2.0","xml":"2.9.10","zlib-ng":"2.0.2"}');

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 4293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");;

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 7619:
/***/ ((module) => {

"use strict";
module.exports = require("constants");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(3109);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map