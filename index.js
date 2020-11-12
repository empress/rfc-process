'use strict';

const StaticSiteJson = require('broccoli-static-site-json');
const BroccoliMergeTrees = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');
const writeFile = require('broccoli-file-creator');
const resolve = require('resolve');

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

  getSrcPkg() {
    let appPrefix = join(this.project.configPath(), '../..');

    if(this.app.options.rfcProcess && this.app.options.rfcProcess.source) {
      try {
        return resolve.sync(this.app.options.rfcProcess.source, { basedir: process.cwd() });
      } catch (e) {
        // try getting node_modules directly
        let fullPath = join(process.cwd(), 'node_modules', this.app.options.rfcProcess.source);
        if(existsSync(fullPath)) {
          return fullPath;
        }
      }

    } else if(existsSync(join(appPrefix, 'text'))) {
      return appPrefix;
    }
  },

  urlsForPrember() {
    let srcPrefix = this.getSrcPkg();
    const rfcs = readdirSync(join(srcPrefix, 'text')).map((file) => file.replace(/\.md$/, ''));

    return ['/', ...rfcs];
  },

  treeForPublic() {
    let srcPrefix = this.getSrcPkg();

    const rfcsJSON = new StaticSiteJson(join(srcPrefix, 'text'), {
      attributes: ['start', 'release', 'releaseVersions', 'rfc', 'stage'],
      references: ['teams'],
      contentFolder: 'rfcs',
      type: 'rfcs',
    });

    const teamsJSON = new StaticSiteJson(join(srcPrefix, 'teams'), {
      attributes: ['title'],
      contentFolder: 'teams',
      type: 'teams',
    });

    const readmeFile = funnel(srcPrefix, {
      files: ['README.md']
    });

    const pagesJSON = new StaticSiteJson(readmeFile, {
      contentFolder: 'pages',
      type: 'pages',
    });

    const rfcs = readdirSync(join(srcPrefix, 'text')).map((file) => file.replace(/\.md$/, ''));

    const tocFile = writeFile('/tocs/rfc.json', JSON.stringify(TocSerializer.serialize({ id: 'rfc', links: rfcs })));

    const trees = [rfcsJSON, tocFile, pagesJSON, teamsJSON]

    if(existsSync(join(srcPrefix, 'images'))) {
      const images = funnel(join(srcPrefix, 'images'), {
        destDir: 'images'
      });

      trees.push(images);
    }

    return BroccoliMergeTrees(trees);
  }
};
