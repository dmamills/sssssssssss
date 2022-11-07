# code name: sssssssssss

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

any key value pairs provided in the header will be available to the view in the `metadata` object.

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