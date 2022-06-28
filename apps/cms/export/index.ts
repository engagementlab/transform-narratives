/**
 * @el-next CMS
 * Developed by Engagement Lab, 2022
 *
 * @author Johnny Richardson
 * CMS production instance builder
 * ==========
 */

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { argv } = require('yargs');

const fsPromises = fs.promises;

// const colors = require('colors');
// const glob = require('glob');

// Get all current CMS schemas from '../admin'
(async () => {
  const schemas = await fsPromises.readdir(
    path.join(__dirname, '../admin/schema')
  );
  console.log(schemas);
})();
