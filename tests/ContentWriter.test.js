require('should');
const assert = require('assert');
const fs = require('fs/promises');

const ContentWriter = require('../src/ContentWriter');

describe('ContentWriter', () => {

    afterEach(async () => {
        try {
        await fs.rmdir('./tests/fixtures', { recursive: true });
        } catch(e) {}
    });

    it('should create a build directory', async () => {
        const writer = new ContentWriter({
            baseFolder: './tests/posts',
            outputPath: './tests/fixtures'
        });

        await writer.createBuildDir();

        const checkFn = async () => { await fs.access('./tests/fixtures'); }

        try {
            await checkFn();
          } catch (error) {
            assert.fail('Expected asyncFunction not to throw an exception');
          }
    });

    it('should write files to the build directory', async () => {
        const writer = new ContentWriter({
            baseFolder: './tests/posts',
            outputPath: './tests/fixtures'
        });

        await writer.createBuildDir();
        await writer.write([{
            path: 'test.html',
            content: '<h1>Test</h1>'
        }]);

        const checkFn = async () => { await fs.access('./tests/fixtures/test.html'); }

        try {
            await checkFn();
          } catch (error) {
            console.log(error);
            assert.fail('Expected asyncFunction not to throw an exception');
          }
    });

});