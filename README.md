# code name: sssssssssss

![tests](https://github.com/dmamills/sssssssssss/actions/workflows/node.js.yml/badge.svg) [![codecov](https://codecov.io/gh/dmamills/sssssssssss/branch/master/graph/badge.svg?token=A3KD0MREI2)](https://codecov.io/gh/dmamills/sssssssssss)

because i am not sure what to call this yet other than yet another static site generator.

[example output can be seen here](https://dmamills.github.io/sssssssssss/)

## usage

the cli tool accepts the path to an `options.json` file, in this format:

```
{
  "baseFolder": "./example" // Where your posts/templates/static files are located
  "baseUrl": "/", //subdomain if required
  "outputPath": "./docs", //Where to put the generated html files
  "pageTemplate": "page.ejs", //The name of your page template, this is used for every markdown file in your "basePath"
  "baseTemplate": "base.ejs", // The base template that will be used by both index+page views
  "metadata": { //The metadata object is provided to each rendered view
    "blogTitle": "Test Blog"
  }
}
```

You can run it using `sssssssssss my-options-file.json`

## Pages

Each page stored in your `basePath` will be generated into it's own html file. Each entry allows for a header in this format:
```
---
title: Some blog post
date: 2022-01-01
---
```

### Markdown Assets

If you require the use of additional assets in your markdown files, you can include them using the `@asset` For example: `@asset(script, "public/js/script.js")` This file maps to your `/static` folder. This will be converted to the proper html tag at compile time, and ensure your `baseUrl` has been included.

## Index Page

The index is a special template that recieves an array of `pages` found in the `basePath` directory. This can be used to list links to each blog post.

The `page` structure is:
```
{
  title: 'the blog title in a url friendly format'
  date: '2022-01-01'
  ...headers, // any additional headers provided
  content: 'html string of template content',
  slug: 'the-blog-title-in-a-url-friendly-format',
  path: '/qualified/path/to/the-blog-title-in-a-url-friendly-format.html'
}
```


## example

When you clone this repo, you can use the directories provided to generate an example using: `node debug.js example-options.json`. This will create an `output` directory where you can see the outputted files.



## arch

`sssssssssss` is broken down into three main components:

- `ContentExtractor` is responsible for parsing all of the `page` files within the `/posts` directory. It renders the markdown, as well as applies the transformation to `@asset` tags.
The return value from the extractor is an array of `pages` in the following structure:

```
{
  title: '',
  date: '',
  //...another other header metadata
  content: 'html content of markdown page',
  slug: '<date>-slugified-version-of-title',
  path: 'url html path to file'
}
```

- `TemplateRenderer` is reponsible for converting each of the processed `pages` through the `ejs` compiler. This is a two step process. First the `page` is rendered to the `/templates/page.ejs`, then the `/templates/base.ejs`. Each of these templates receive the `page` object from the `ContentExtractor` in their view.

The `TemplateRenderer` is also called to render the `index` page. This page uses the `/templates/index.ejs` and recieves all of the pages, as well as the full options metadata in it's view.

- `ContentWriter` is responsible for taking the rendered pages and outputting them to the `options.outputPath`. It will write all index, and pages. As well as copy over any static files it finds in the `/statics` directory. 
