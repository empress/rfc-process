'use strict';

const StaticSiteJson = require('broccoli-static-site-json');
const BroccoliMergeTrees = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');
const writeFile = require('broccoli-file-creator');

const { Serializer } = require('jsonapi-serializer');
const { readdirSync } = require('fs');

const TocSerializer = new Serializer('toc', {
  attributes: [
    'links',
  ],
});

const rfcsJSON = new StaticSiteJson('text', {
  contentFolder: 'rfcs',
  type: 'rfcs',
});

const readmeFile = funnel('./', {
  files: ['README.md']
});

const images = funnel('./images', {
  destDir: 'images'
});

const pagesJSON = new StaticSiteJson(readmeFile, {
  contentFolder: 'pages',
  type: 'pages',
})

module.exports = {
  name: require('./package').name,

  treeForPublic() {
    const rfcs = readdirSync('text').map((file) => file.replace(/\.md$/, ''));

    const tocFile = writeFile('/tocs/rfc.json', JSON.stringify(TocSerializer.serialize({ id: 'rfc', links: rfcs })));
    return BroccoliMergeTrees([rfcsJSON, tocFile, pagesJSON, images]);
  }
};
