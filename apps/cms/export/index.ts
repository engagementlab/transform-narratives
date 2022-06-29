/**
 * @el-next CMS
 * Developed by Engagement Lab, 2022
 *
 * @author Johnny Richardson
 * CMS production instance builder
 * ==========
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { argv } = require('yargs');

const join = path.join;

// const colors = require('colors');
// const glob = require('glob');

let appNames: string[] = [];
let spawnIndex = 0;

const spawnBuild = () => {
  const schemaFixChild = spawn('npm', [
    'run',
    'postinstall',
    '--',
    `--app=${appNames[spawnIndex]}`,
  ]);

  schemaFixChild.on('exit', (err, info) => {
    console.log('done', err, info);
    const child = spawn('npm', [
      'run',
      'build',
      '--',
      `--app=${appNames[spawnIndex]}`,
    ]);

    console.log(`Building ${appNames[spawnIndex]}`);
    // if (fs.existsSync(join(__dirname, '../schema.graphql'))) {
    //   fs.unlinkSync(join(__dirname, '../schema.graphql'));
    //   fs.unlinkSync(join(__dirname, '../schema.prisma'));
    // }
    child.stderr.pipe(process.stderr);
    child.on('error', (chunk) => {
      console.error(chunk);
    });
    child.stderr.on('data', (errout) => {
      console.error(errout.toString());
    });
    child.on('exit', (err: any, info: any) => {
      console.log(err, info);
      fs.move(
        join(__dirname, '../.keystone/admin'),
        join(__dirname, `../.keystone/${appNames[spawnIndex]}`)
      );

      spawnIndex++;
      // console.log(spawnIndex, appNames.length);
      if (spawnIndex < appNames.length) spawnBuild();
    });
  });
};
// Get all current CMS schemas from '../admin'
(async () => {
  const schemasDir = join(__dirname, '../admin/schema');
  const schemaItems = await fs.readdir(schemasDir);
  const schemaDirs = schemaItems.filter((schemaItem: any) => {
    return fs.statSync(`${schemasDir}/${schemaItem}`).isDirectory();
  });
  appNames = schemaDirs;
  spawnBuild();

  //     if (err !== 0) {
  //         global.logger.error(
  //             `⛔ Uncaught error for ${colors.yellow(pkg.name)} process (code: ${err}) ${info}.`
  //         );
  //     } else {
  //         global.logger.info(
  //             `🍺 CMS bundle exported for ${colors.yellow(pkg.name)}.`
  //         );
  //         exportsDone.push(outDir);

  //         if (exportsDone.length === keys.length) {
  //             global.logger.info(
  //                 '✨    All bundles done, organizing directories.    ✨'
  //             );
  //             postBuild(exportsDone);
  //         }
  //     }
  // });
})();
