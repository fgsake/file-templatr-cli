#!/usr/bin/env node
import { paramCase, pascalCase } from 'change-case';
import { Argument, Command, Option } from 'commander';
import 'dotenv/config';
import findRoot from 'find-root';
import fs from 'fs-extra';
import path from 'path';
import { totalist } from 'totalist/sync';

import { FOLDER_TEMPLATE_DIR_NAME } from "../constants";

const CWD: string = process.env.INIT_CWD || process.cwd();
const PROJECT_DIR: string | undefined = findRoot(CWD);
const TEMPLATE_BASE_DIR: string = `${PROJECT_DIR}/${FOLDER_TEMPLATE_DIR_NAME}`;


if (!fs.existsSync(TEMPLATE_BASE_DIR)) {
  console.log('file-templatr :: No Folder Template Dir Exists');
  console.log('file-templatr :: CWD');

  process.exit(1);
}

// console.log('index :: CWD               -', CWD);
// console.log('index :: PROJECT_DIR       -', PROJECT_DIR);
// console.log('index :: PACKAGE_DIR       -', PACKAGE_DIR);
// console.log('index :: TEMPLATE_BASE_DIR -', TEMPLATE_BASE_DIR);

const program: Command = new Command()
  .version('1.0.0')
  .description('CLI Utility for creating new files and folder based on a templated structure')
  .addArgument(new Argument('<TargetName>', 'Target Name for newly created template'))
  .addOption(new Option('-w, --watch').hideHelp())
  .addOption(
    new Option(
      '-p, --path [path]',
      'Destination folder for the component'
    ).default('', "current directory")
  )
  .addOption(
    new Option(
      '-t, --template <template>',
      'Template you want to use from your `.fs-templates` directory'
    ).makeOptionMandatory()
  )
  .addOption(new Option('-f, --force', 'Force overwrite any files'))
  .addOption(new Option('-d, --debug', 'Enable debug mode'))
  .action((targetName) => {
    // console.log('index :: componentName -', componentName);
    const options = program.opts();

    const TARGET_BASE_DIR: string = path.resolve(CWD, options.path);
    const TEMPLATE_DIR: string = path.resolve(TEMPLATE_BASE_DIR, options.template)
    const FS_NAME_PARAM: string = paramCase(targetName);
    const FS_NAME_PASCAL: string = pascalCase(targetName);



    console.log('file-templatr :: TARGET_BASE_DIR   -', TARGET_BASE_DIR);
    console.log('file-templatr :: TEMPLATE_DIR      -', TEMPLATE_DIR);

    console.log('file-templatr :: FS_NAME_PARAM     -', FS_NAME_PARAM);
    console.log('file-templatr :: FS_NAME_PASCAL    -', FS_NAME_PASCAL);

    console.log('file-templatr :: options           -', options);


    if (!fs.existsSync(TEMPLATE_DIR)) {
      console.log(`file-templatr :: Could not find Template - ${options.template}`);
      process.exit(1);
    }

    if (!fs.existsSync(TARGET_BASE_DIR)) {
      console.log(`file-templatr :: Can not find target path - ${options.path}`);
      process.exit(1);
    }

    const TARGET_DIR: string = `${TARGET_BASE_DIR}/${paramCase(targetName)}`;

    if (fs.existsSync(TARGET_DIR) && !options.force) {
      console.log(`file-templatr :: Target folder already exists - ${TARGET_DIR}`);
      process.exit(1);
    }

    fs.copySync(TEMPLATE_DIR, TARGET_DIR);

    // const files: Array<Entry> = scandirSync(TARGET_DIR);
    totalist(TARGET_DIR, async (relPath: string, absPath: string) => {
      const newAbsPath = absPath.includes('__ENV_FS_NAME_PARAMCASE')
        ? absPath.replace('__ENV_FS_NAME_PARAMCASE', FS_NAME_PARAM)
        : absPath.includes('__ENV_FS_NAME_PASCALCASE')
        ? absPath.replace('__ENV_FS_NAME_PASCALCASE', FS_NAME_PASCAL)
        : absPath;

      if (absPath !== newAbsPath) {
        await fs.rename(absPath, newAbsPath);
      }

      const contents: string = fs.readFileSync(newAbsPath).toString();

      fs.writeFileSync(
        newAbsPath,
        contents
          .replace(/__ENV_FS_NAME_PARAMCASE/g, FS_NAME_PARAM)
          .replace(/__ENV_FS_NAME_PASCALCASE/g, FS_NAME_PASCAL)
          .replace(/__ENV_FS_COMPONENT_PARENT_DIR/g, path.basename(TARGET_BASE_DIR))
      );
    });
  });

program.parse(process.argv);





