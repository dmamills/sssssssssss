const fs = require('fs/promises');
const npath = require('path');

class ContentWriter {
  constructor(options) {
    this.baseFolder = options.baseFolder;
    this.outputPath = options.outputPath;
    this.staticPath = options.staticPath;
    this.outputStaticPath = options.outputStaticPath;
    //this.outputBase = options.outputPath;
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
    await this.ensureDirExists(`${this.outputPath}${this.outputStaticPath}`)
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
    const dirWritePath = `${this.outputPath}${this.outputStaticPath}${path}`
      .replace('/static', '')
      .replace(this.baseFolder, '');

    await this.ensureDirExists(dirWritePath);
    for(let i =0;i < files.length; i++) {
      const currentPath = `${path}/${files[i]}`
      const stat = await fs.lstat(currentPath);

      if(stat.isDirectory()) {
        await this.readAndCopyDirectory(currentPath);
      } else {

        const writePath = npath.resolve(`${this.outputPath}${this.outputStaticPath}${currentPath}`
        .replace(this.staticPath, '')
        .replace(this.baseFolder, ''));
        await fs.copyFile(npath.resolve(currentPath), writePath);
      }
    }
  }

  statics = async () => {
    await this.readAndCopyDirectory(`${this.baseFolder}${this.staticPath}`);
  }
}

module.exports = ContentWriter;