'use strict';

const StaticSiteJson = require('broccoli-static-site-json');
const BroccoliMergeTrees = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');
const writeFile = require('broccoli-file-creator');

const { Serializer } = require('jsonapi-serializer');
const { readdirSync, existsSync } = require('fs');
const { join } = require('path');

const TocSerializer = new Serializer('toc', {
  attributes: [
    'links',
  ],
});

module.exports = {
  name: require('./package').name,

  config() {
    return {
      fastboot: {
        hostWhitelist: [/localhost:\d+/]
      },
    }
  },

  urlsForPrember() {
    let appPrefix = join(this.project.configPath(), '../..');
    const rfcs = readdirSync(join(appPrefix, 'text')).map((file) => file.replace(/\.md$/, ''));

    return ['/', ...rfcs];
  },

  treeForPublic() {
    let appPrefix = join(this.project.configPath(), '../..');

    const rfcsJSON = new StaticSiteJson(join(appPrefix, 'text'), {
      contentFolder: 'rfcs',
      type: 'rfcs',
    });

    const readmeFile = funnel(appPrefix, {
      files: ['README.md']
    });

    const pagesJSON = new StaticSiteJson(readmeFile, {
      contentFolder: 'pages',
      type: 'pages',
    })

    const rfcs = readdirSync(join(appPrefix, 'text')).map((file) => file.replace(/\.md$/, ''));

    const tocFile = writeFile('/tocs/rfc.json', JSON.stringify(TocSerializer.serialize({ id: 'rfc', links: rfcs })));

    const trees = [rfcsJSON, tocFile, pagesJSON]

    if(existsSync(join(appPrefix, 'images'))) {
      const images = funnel(join(appPrefix, 'images'), {
        destDir: 'images'
      });

      trees.push(images);
    }

    return BroccoliMergeTrees(trees);
  }
};
