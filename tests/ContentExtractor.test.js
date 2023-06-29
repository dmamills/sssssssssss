require('should');
const ContentExtractor = require('../src/ContentExtractor');
const { fileToString } = require('../src/utils');

describe('ContentExtractor', () => {

    it('should extract pages from a folder', async () => {
        const options = {
            baseUrl: '/',
            baseFolder: './tests',
            pageTemplate: 'page.ejs',
            metadata: {
                title: 'My Blog',
                description: 'My Blog Description',
            }
        };

        const extractor = new ContentExtractor(options);
        const pages = await extractor.processPages();

        pages.should.be.an.Array();
        pages.length.should.be.equal(1);

        const page = pages[0];
        page.should.have.property('title');
        page.should.have.property('content');
        page.should.have.property('date');
        page.should.have.property('slug');
        page.should.have.property('path');
    });

    it('should parse parse page', async () => {
        const options = {
            baseUrl: '/',
            baseFolder: './tests',
            pageTemplate: 'page.ejs',
            metadata: {
                title: 'My Blog',
                description: 'My Blog Description',
            }
        };

        const extractor = new ContentExtractor(options);
        const pageContent = await fileToString('./tests/posts/test.md')
        const page = await extractor.parsePage(pageContent);

        page.should.have.property('title');
        page.should.have.property('content');
        page.should.have.property('date');
        page.should.have.property('slug');
        page.should.have.property('path');
    });

    it('should rewrite image assets', () => {
        const extractor = new ContentExtractor({ baseUrl: '/' });
        const asset = extractor.rewriteAsset('@asset(img, images/test.png');
        asset.should.be.equal('<img src="/images/test.png" />');
    });

    it('should rewrite stylesheet assets', () => {
        const extractor = new ContentExtractor({ baseUrl: '/' });
        const asset = extractor.rewriteAsset('@asset(style, css/test.css');
        asset.should.be.equal('<link rel="stylesheet" href="/css/test.css" />');
    });

    it('should rewrite script assets', () => {
        const extractor = new ContentExtractor({ baseUrl: '/foo/' });
        const asset = extractor.rewriteAsset('@asset(script, js/test.js');
        asset.should.be.equal('<script src="/foo/js/test.js"></script>');
    });

    it('should extract headers and content from a page', async () => {
        const extractor = new ContentExtractor({ baseUrl: '/' });
        const content = await fileToString('./tests/posts/test.md');
        
        const { headers, extractedContent } = extractor.extract(content);
        headers.should.have.property('title');
        headers.should.have.property('date');
        extractedContent.should.be.equal('# hello world');
    });
});