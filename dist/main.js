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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const globby_1 = __importDefault(require("globby"));
const lib_1 = require("@squoosh/lib");
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = core.getInput('files');
        const quality = parseInt(core.getInput('quality')) || undefined;
        const minSize = parseInt(core.getInput('min-size'));
        let fileArray = files.split('\n');
        if (minSize) {
            fileArray = fileArray.filter(it => fs_1.statSync(it).size > minSize);
        }
        const filePaths = yield globby_1.default(fileArray, { onlyFiles: true });
        const outputs = [];
        const imagePool = new lib_1.ImagePool();
        for (const fileName of filePaths) {
            const file = path.resolve(__dirname, fileName);
            const realQuality = quality
                ? quality
                : (minSize / fs_1.statSync(file).size) * 100;
            const image = imagePool.ingestImage(file);
            image
                .encode({
                mozjpeg: {
                    quality: realQuality
                }
            })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const encodedImage = yield image.encodedWith['mozjpeg'];
                const filename = file.slice(0, file.lastIndexOf('.') + 1) +
                    (yield encodedImage).extension;
                fs_1.writeFileSync(filename, (yield encodedImage).binary);
                outputs.push(filename);
                core.setOutput('images', outputs.join('\n'));
            }))
                .catch(reson => console.log(reson));
        }
    });
}
