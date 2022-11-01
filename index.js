const SSSSSSSSSSS = require('./src/SSSSSSSSSSS');
const { fileToString, optionsFileInArgs } = require('./src/utils');

const DEFAULT_OPTIONS = {
  basePath: './posts',
  templatesPath: './templates',
  outputPath: './docs',
  staticPath: './static',
  baseUrl: '/',
  outputStaticPath: '/public',
  pageTemplate: 'page.ejs',
  baseTemplate: 'base.ejs',
  metadata: {
    blogTitle: 'Test Blog'
  }
};

const generateOptions = async (argv) => {
  let optionsFile = optionsFileInArgs([...argv]);
  let parsedOptions = {};
  try {
    if(optionsFile) {
      parsedOptions = JSON.parse(await fileToString(optionsFile));
    }
  } catch {
    console.log('unable to find options file, using defaults');
  }

  return {
    ...DEFAULT_OPTIONS,
    ...parsedOptions
  }
}


const main = async (argv) => {
  const options = await generateOptions([...argv]);

  console.log("options:", options);
  const sssssssssss = new SSSSSSSSSSS(options);
  await sssssssssss.generate();
}

module.exports = main;