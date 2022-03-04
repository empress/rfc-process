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
      showdown: {
        tables: true
      }
    }
  },

  getDataDirectory() {
    if (this.app.options.rfcProcess && this.app.options.rfcProcess.textLocation) {
      return this.app.options.rfcProcess.textLocation;
    } else if(this.app.options.rfcProcess && this.app.options.rfcProcess.source) {
      try {
        return resolve.sync(this.app.options.rfcProcess.source, { basedir: process.cwd() });
      } catch (e) {
        // try getting node_modules directly
        let fullPath = join(process.cwd(), 'node_modules', this.app.options.rfcProcess.source);
        if(existsSync(fullPath)) {
          return fullPath;
        }
      }
    }

    return join(this.project.configPath(), '../..');
  },

  urlsForPrember() {
    let appPrefix = join(this.project.configPath(), '../..');
    const rfcs = readdirSync(join(appPrefix, 'text')).map((file) => file.replace(/\.md$/, ''));

    return ['/', ...rfcs];
  },

  treeForPublic() {
    let dataDirectory = this.getDataDirectory();

    const rfcsJSON = new StaticSiteJson(join(dataDirectory, 'text'), {
      contentFolder: 'rfcs',
      type: 'rfcs',
    });

    const readmeFile = funnel(dataDirectory, {
      files: ['README.md']
    });

    const pagesJSON = new StaticSiteJson(readmeFile, {
      contentFolder: 'pages',
      type: 'pages',
    })

    const rfcs = readdirSync(join(dataDirectory, 'text')).map((file) => file.replace(/\.md$/, ''));

    const tocFile = writeFile('/tocs/rfc.json', JSON.stringify(TocSerializer.serialize({ id: 'rfc', links: rfcs })));

    const trees = [rfcsJSON, tocFile, pagesJSON]

    if(existsSync(join(dataDirectory, 'images'))) {
      const images = funnel(join(dataDirectory, 'images'), {
        destDir: 'images'
      });

      trees.push(images);
    }

    return BroccoliMergeTrees(trees);
  }
};
