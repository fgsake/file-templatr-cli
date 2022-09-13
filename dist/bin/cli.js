#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const commander_1 = require("commander");
require("dotenv/config");
const find_root_1 = __importDefault(require("find-root"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("totalist/sync");
const constants_1 = require("../constants");
const CWD = process.env.INIT_CWD || process.cwd();
const PROJECT_DIR = (0, find_root_1.default)(CWD);
const TEMPLATE_BASE_DIR = `${PROJECT_DIR}/${constants_1.FOLDER_TEMPLATE_DIR_NAME}`;
if (!fs_extra_1.default.existsSync(TEMPLATE_BASE_DIR)) {
    console.log('file-templatr :: No Folder Template Dir Exists');
    console.log('file-templatr :: CWD');
    process.exit(1);
}
// console.log('index :: CWD               -', CWD);
// console.log('index :: PROJECT_DIR       -', PROJECT_DIR);
// console.log('index :: PACKAGE_DIR       -', PACKAGE_DIR);
// console.log('index :: TEMPLATE_BASE_DIR -', TEMPLATE_BASE_DIR);
const program = new commander_1.Command()
    .version('1.0.0')
    .description('CLI Utility for creating new files and folder based on a templated structure')
    .addArgument(new commander_1.Argument('<TargetName>', 'Target Name for newly created template'))
    .addOption(new commander_1.Option('-w, --watch').hideHelp())
    .addOption(new commander_1.Option('-p, --path [path]', 'Destination folder for the component').default('', "current directory"))
    .addOption(new commander_1.Option('-t, --template <template>', 'Template you want to use from your `.fs-templates` directory').makeOptionMandatory())
    .addOption(new commander_1.Option('-f, --force', 'Force overwrite any files'))
    .addOption(new commander_1.Option('-d, --debug', 'Enable debug mode'))
    .action((targetName) => {
    // console.log('index :: componentName -', componentName);
    const options = program.opts();
    const TARGET_BASE_DIR = path_1.default.resolve(CWD, options.path);
    const TEMPLATE_DIR = path_1.default.resolve(TEMPLATE_BASE_DIR, options.template);
    const FS_NAME_PARAM = (0, change_case_1.paramCase)(targetName);
    const FS_NAME_PASCAL = (0, change_case_1.pascalCase)(targetName);
    console.log('file-templatr :: TARGET_BASE_DIR   -', TARGET_BASE_DIR);
    console.log('file-templatr :: TEMPLATE_DIR      -', TEMPLATE_DIR);
    console.log('file-templatr :: FS_NAME_PARAM     -', FS_NAME_PARAM);
    console.log('file-templatr :: FS_NAME_PASCAL    -', FS_NAME_PASCAL);
    console.log('file-templatr :: options           -', options);
    if (!fs_extra_1.default.existsSync(TEMPLATE_DIR)) {
        console.log(`file-templatr :: Could not find Template - ${options.template}`);
        process.exit(1);
    }
    if (!fs_extra_1.default.existsSync(TARGET_BASE_DIR)) {
        console.log(`file-templatr :: Can not find target path - ${options.path}`);
        process.exit(1);
    }
    const TARGET_DIR = `${TARGET_BASE_DIR}/${(0, change_case_1.paramCase)(targetName)}`;
    if (fs_extra_1.default.existsSync(TARGET_DIR) && !options.force) {
        console.log(`file-templatr :: Target folder already exists - ${TARGET_DIR}`);
        process.exit(1);
    }
    fs_extra_1.default.copySync(TEMPLATE_DIR, TARGET_DIR);
    // const files: Array<Entry> = scandirSync(TARGET_DIR);
    (0, sync_1.totalist)(TARGET_DIR, (relPath, absPath) => __awaiter(void 0, void 0, void 0, function* () {
        const newAbsPath = absPath.includes('__ENV_FS_NAME_PARAMCASE')
            ? absPath.replace('__ENV_FS_NAME_PARAMCASE', FS_NAME_PARAM)
            : absPath.includes('__ENV_FS_NAME_PASCALCASE')
                ? absPath.replace('__ENV_FS_NAME_PASCALCASE', FS_NAME_PASCAL)
                : absPath;
        if (absPath !== newAbsPath) {
            yield fs_extra_1.default.rename(absPath, newAbsPath);
        }
        const contents = fs_extra_1.default.readFileSync(newAbsPath).toString();
        fs_extra_1.default.writeFileSync(newAbsPath, contents
            .replace(/__ENV_FS_NAME_PARAMCASE/g, FS_NAME_PARAM)
            .replace(/__ENV_FS_NAME_PASCALCASE/g, FS_NAME_PASCAL)
            .replace(/__ENV_FS_COMPONENT_PARENT_DIR/g, path_1.default.basename(TARGET_BASE_DIR)));
    }));
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map