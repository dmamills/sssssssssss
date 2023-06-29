require('should');
const sinon = require('sinon');
const TemplateRenderer = require('../src/TemplateRenderer');
const { readFile } = require('fs');

describe('TemplateRenderer', () => {
    it('should load a template', async () => {
        const renderer = new TemplateRenderer({
            baseTemplate: 'base.ejs',
            baseFolder: './tests'
        });

        const template = await renderer.loadTemplate('base.ejs');
        template.should.be.a.String();
    });

    it('should read template from cache on second call', async () => {
        const renderer = new TemplateRenderer({
            baseTemplate: 'base.ejs',
            baseFolder: './tests'
        });

        readFileSpy = sinon.spy(require('fs/promises'), 'readFile');
        
        const template = await renderer.loadTemplate('base.ejs');
        const template2 = await renderer.loadTemplate('base.ejs');
        template.should.be.equal(template2);
        readFileSpy.calledOnce.should.be.true();
        readFileSpy.restore();
    });

    it('should render a template', async () => {
        const renderer = new TemplateRenderer({
            baseTemplate: 'base.ejs',
            baseFolder: './tests'
        });

        const rendered = await renderer.renderTemplate('page.ejs', { 
            metadata: {
                blogTitle: 'My Blog'
            },
            baseUrl: '/',
            page: {
                title: 'My Title',
                content: 'My Content',
                date: '2021-01-01'
            }
        });

        rendered.should.be.a.String();
        rendered.indexOf('My Title').should.be.greaterThan(-1);
        rendered.indexOf('My Content').should.be.greaterThan(-1);
        rendered.indexOf('2021-01-01').should.be.greaterThan(-1);
    });
});