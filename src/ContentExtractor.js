const markdown = require('markdown-js').markdown;
const fs = require('fs/promises');

const { fileToString, slugify } = require('./utils');


function rewriteAsset(asset, baseUrl) {
  // @asset(img, "public/img/sssssssssss.png")


  const tagType = asset.split('@asset(')[1].split(',')[0];
  const path = asset.split('@asset(')[1].split(',')[1].split(')')[0].trim().replace(/"/g, '')

  let newContent = '';
  if(tagType === 'img') {
    newContent = `<img src="${baseUrl}${path}" />`;
  } else if (tagType === 'script') {
    newContent = `<script src="${baseUrl}${path}"></script>`;
  }
  
  return newContent
}


const extract = (content, baseUrl) => {
  let lines = content.split('\n')
  const headers = {};
  lines.shift();
  let currentLine = lines.shift();
  while(currentLine != '---') {
    const meta = currentLine.split(':');
    headers[meta[0]] = meta[1].trim();
    currentLine = lines.shift()
  }


  lines = lines.map(line => {
    if(line.indexOf('@asset') > -1) {
      console.log('found asset to rewrite');
      line = rewriteAsset(line, baseUrl);
    }
    return line;
  })

  let extractedContent = lines.join('\n');

  console.log(extractedContent);
  return { headers, extractedContent};
}

const POST_PATH = '/posts';

class ContentExtractor {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.baseFolder = options.baseFolder;
  }

  parsePage = async (page) => {
    const { headers, extractedContent }  = extract(page, this.baseUrl);
    const html = markdown(extractedContent, this.baseUrl);
    return {
      ...headers,
      content: html,
      slug: slugify(headers),
      path: `${this.baseUrl}${slugify(headers)}.html`
    }
  }

  processPages = async () => {
    const files = await fs.readdir(`${this.baseFolder}/${POST_PATH}`);
    const parsedPages = [];
    for(let file of files) {
      const content = await fileToString(`${this.baseFolder}/${POST_PATH}/${file}`);
      const parsed = await this.parsePage(content);
      parsedPages.push(parsed);
    }

    //TODO: order by date
    return parsedPages;
  }
}

module.exports = ContentExtractor;