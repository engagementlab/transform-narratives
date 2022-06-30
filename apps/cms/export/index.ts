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

const join = path.join;

// const colors = require('colors');
// const glob = require('glob');

let appNames: string[] = [];
let appPort = 3000;
let spawnIndex = 0;

const spawnBuild = () => {
  fs.writeFileSync(
    join(process.cwd(), '/currentApp.tsx'),
    `export default '${appNames[spawnIndex]}'`
  );
  const schemaFixChild = spawn('npm', [
    'run',
    'postinstall',
    '--',
    `--app=${appNames[spawnIndex]}`,
  ]);
  schemaFixChild.on('error', (chunk: any) => {
    console.error(chunk);
  });
  schemaFixChild.stderr.on('data', (errout: { toString: () => any }) => {
    console.error(errout.toString());
  });

  schemaFixChild.on('exit', (err: any, info: any) => {
    console.log('done', err, info);
    const child = spawn('npm', [
      'run',
      'build',
      '--',
      `--app=${appNames[spawnIndex]}`,
      `--port=${appPort}`,
    ]);

    console.log(`Building ${appNames[spawnIndex]}`);
    child.stderr.pipe(process.stderr);
    child.on('error', (chunk: any) => {
      console.error(chunk);
    });
    child.stderr.on('data', (errout: { toString: () => any }) => {
      console.error(errout.toString());
    });
    child.on('exit', (err: any, info: any) => {
      console.log(err, info);
      fs.move(
        join(__dirname, '../.keystone/admin'),
        join(__dirname, `../.keystone/${appNames[spawnIndex]}`)
      );

      spawnIndex++;
      appPort++;
      if (spawnIndex < appNames.length) spawnBuild();
    });
  });
};
// Get all current CMS schemas from '../admin'
(async () => {
  // const pm2 = require('pm2');

  // pm2.connect(function (err: any) {
  //   if (err) {
  //     console.error(err);
  //     process.exit(2);
  //   }
  //   pm2.list((err: any, list: any[]) => {
  //     // console.log(err, list);

  //     if (list.find((el) => el.name === 'cms-elab')) {
  //       pm2.restart('cms-elab', (err: any, proc: any) => {
  //         // Disconnects from PM2
  //         pm2.disconnect();
  //       });
  //     } else {
  //       pm2.start(
  //         {
  //           script: join(process.cwd(), '/export/start.js'),
  //           name: 'cms-elab',
  //           args: ' --app=elab --port=3001',
  //         },
  //         function (err: any, apps: any) {
  //           if (err) {
  //             console.error(err);
  //           }
  //           pm2.disconnect();
  //         }
  //       );
  //     }
  //   });
  // });

  fs.rmSync(path.join(process.cwd(), '/.keystone'), {
    recursive: true,
    force: true,
  });
  const schemasDir = join(__dirname, '../admin/schema');
  const schemaItems = await fs.readdir(schemasDir);
  const schemaDirs = schemaItems.filter((schemaItem: any) => {
    return fs.statSync(`${schemasDir}/${schemaItem}`).isDirectory();
  });
  appNames = schemaDirs;
  spawnBuild();
})();
