const fs = require('fs/promises');
const ejs = require('ejs');

class TemplateRenderer {
  constructor(options) {
    this.templateCache = {};
    this.templatesPath = options.templatesPath;
    this.baseTemplate = options.baseTemplate;
    this.baseFolder = options.baseFolder
  }

  loadTemplate = async (filename) => {
    if(this.templateCache[filename]) return this.templateCache[filename];
    const templatePath = `${this.baseFolder}${this.templatesPath}/${filename}`;
    const results = (await fs.readFile(templatePath)).toString();
    this.templateCache[filename] = results;
    return results;
  }

  renderTemplate = async (name, payload) => {
    const base = await this.loadTemplate(this.baseTemplate);
    const pageTemplate = await this.loadTemplate(name);
    const renderedPage = ejs.render(pageTemplate, payload);
    return ejs.render(base, { content: renderedPage, ...payload });
  }
}

module.exports = TemplateRenderer;