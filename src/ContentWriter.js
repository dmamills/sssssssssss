const fs = require('fs/promises');
const npath = require('path');

const STATIC_PATH = '/static';
const OUTPUT_STATIC_PATH = '/public';

class ContentWriter {
  constructor(options) {
    this.baseFolder = options.baseFolder;
    this.outputPath = options.outputPath;
  }

  ensureDirExists = async (path) => {
    try {
      await fs.access(path);
    } catch {
      await fs.mkdir(path);
    }
  }

  createBuildDir = async () => {
    await this.ensureDirExists(this.outputPath);
    await this.ensureDirExists(`${this.outputPath}${OUTPUT_STATIC_PATH}`)
  }

  write = async (pages) => {
    await this.createBuildDir();
    for(let page of pages) {
      const writePath = `${this.outputPath}/${page.path}`;
      await fs.writeFile(writePath, page.content);
    }
  }

  readAndCopyDirectory = async (path) => {
    const files = await fs.readdir(path);
    const dirWritePath = `${this.outputPath}${OUTPUT_STATIC_PATH}${path}`
      .replace(STATIC_PATH, '')
      .replace(this.baseFolder, '');

    await this.ensureDirExists(dirWritePath);
    for(let i =0;i < files.length; i++) {
      const currentPath = `${path}/${files[i]}`
      const stat = await fs.lstat(currentPath);

      if(stat.isDirectory()) {
        await this.readAndCopyDirectory(currentPath);
      } else {
        const writePath = npath.resolve(`${this.outputPath}${OUTPUT_STATIC_PATH}${currentPath}`
        .replace(STATIC_PATH, '')
        .replace(this.baseFolder, ''));
        await fs.copyFile(npath.resolve(currentPath), writePath);
      }
    }
  }

  statics = async () => {
    await this.readAndCopyDirectory(`${this.baseFolder}${STATIC_PATH}`);
  }
}

module.exports = ContentWriter;