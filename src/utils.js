const fs = require('fs/promises');

const fileToString = async (filepath) => { return (await fs.readFile(filepath)).toString(); }

const slugify = (headers) => `${headers.date}-${headers.title.toLowerCase().split(' ').join('_')}`;

const optionsFileInArgs = (args) => {
  let optionsFile = null;

  args.forEach(arg => {
    if(arg.endsWith('.json')) {
      optionsFile = arg;
    }
  });

  return optionsFile;
}

module.exports = {
  fileToString,
  optionsFileInArgs,
  slugify
};