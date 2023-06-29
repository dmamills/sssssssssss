require('should');
const { fileToString, slugify, optionsFileInArgs } = require('../src/utils');

describe('utils', () => {
    it('should read a file to string', async () => {
        const content = await fileToString('./tests/posts/test.md');
        content.should.be.a.String();
    });

    it('should slugify a string', () => {
        const headers = {
            date: '2021-01-01',
            title: 'My Title'
        };

        const slug = slugify(headers);
        slug.should.be.a.String();
        slug.should.be.equal('2021-01-01-my-title'); 
    });


    it('should find the options file in the args', () => {
        const args = ['node', 'index.js', 'options.json'];
        const optionsFile = optionsFileInArgs(args);
        optionsFile.should.be.a.String();
        optionsFile.should.be.equal('options.json');
    });

    it('should return null if no options file is found', () => {
        const args = ['node', 'index.js'];
        const optionsFile = optionsFileInArgs(args);
        (optionsFile === null).should.be.true();
    });
});