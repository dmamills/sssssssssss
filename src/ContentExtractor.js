const markdown = require('markdown-js').markdown;
const fs = require('fs/promises');

const { fileToString, slugify } = require('./utils');

const extract = (content) => {
  const lines = content.split('\n')
  const headers = {};
  lines.shift();
  let currentLine = lines.shift();
  while(currentLine != '---') {
    const meta = currentLine.split(':');
    headers[meta[0]] = meta[1].trim();
    currentLine = lines.shift()
  }

  return { headers, extractedContent: lines.join('\n') };
}


class ContentExtractor {
  constructor(options) {
    this.basePath = options.basePath;
    this.baseUrl = options.baseUrl;
    this.baseFolder = options.baseFolder;
  }

  parsePage = async (page) => {
    const { headers, extractedContent }  = extract(page);
    const html = markdown(extractedContent);
    return {
      ...headers,
      content: html,
      slug: slugify(headers),
      path: `${this.baseUrl}${slugify(headers)}.html`
    }
  }

  processPages = async () => {
    const files = await fs.readdir(`${this.baseFolder}/${this.basePath}`);
    const parsedPages = [];
    for(let file of files) {
      const content = await fileToString(`${this.baseFolder}/${this.basePath}/${file}`);
      const parsed = await this.parsePage(content);
      parsedPages.push(parsed);
    }

    //TODO: order by date
    return parsedPages;
  }
}

module.exports = ContentExtractor;