const ContentExtractor = require('./ContentExtractor');
const TemplateRenderer = require('./TemplateRenderer');
const ContentWriter = require('./ContentWriter');

class SSSSSSSSSSS {
  constructor(options) {
    this.options = options;
    this.contentWriter = new ContentWriter(options);
    this.extractor = new ContentExtractor(options.basePath, options.baseUrl);
    this.templateRenderer = new TemplateRenderer(options.templatesPath, options.baseTemplate);
  }

  generate = async () => {
    const pages = await this.extractor.processPages();

    const outputFiles = [];
    for(let page of pages) {
      const renderedPage = await this.templateRenderer.renderTemplate(this.options.pageTemplate, { page, metadata: this.options.metadata });
      console.log(page.path);
      outputFiles.push({ path: `${page.slug}.html`, content: renderedPage})
    }

    const index = await this.templateRenderer.renderTemplate('index.ejs', { pages, metadata: this.options.metadata });
    outputFiles.push({ path: 'index.html', content: index });
    await this.contentWriter.write(outputFiles);
    await this.contentWriter.statics();
  }
}

module.exports = SSSSSSSSSSS;