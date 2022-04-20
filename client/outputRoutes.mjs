import fs from 'fs';
import _ from 'lodash';
import recursiveReaddirFiles from 'recursive-readdir-files';
export default (async () => {
  const files = await recursiveReaddirFiles(`${process.cwd()}/out`, {
    ignored: /(\.js|.css|.json|.ico|.DS_Store|favicon)$/,
    filter: (item) => {
      return item.path;
    },
  });
  const urls = _.map(files, (file) => {
    return `"${file.path
      .replace(process.cwd() + '/out', 'http://localhost:8080')
      .replace('index.html', '')}"`;
  });

  if (fs.existsSync('.pa11yci')) fs.unlinkSync('.pa11yci');
  fs.writeFileSync('.pa11yci', `{"urls": [${urls}]}`);
})();
