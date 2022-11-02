const fs = require('fs/promises');
const ejs = require('ejs');

class TemplateRenderer {
  constructor(templatePath, baseTemplate, basePath) {
    this.templateCache = {};
    this.templatePath = templatePath;
    this.baseTemplate = baseTemplate;
  }

  loadTemplate = async (filename)  => {
    if(this.templateCache[filename]) return this.templateCache[filename];
    const results = (await fs.readFile(`${this.templatePath}/${filename}`)).toString();

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