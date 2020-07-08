const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const excludeFolders = ['images'];
const filenames = fs.readdirSync(path.resolve(process.cwd(), 'public'));
const itemsToRemove = filenames.filter(name => !excludeFolders.includes(name));

itemsToRemove.forEach(name =>
  fse.removeSync(path.resolve(process.cwd(), `public/${name}`))
);
