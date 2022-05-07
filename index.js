/* eslint-disable prettier/prettier, no-undef */
'use strict';

const StaticSiteJson = require('broccoli-static-site-json');
const BroccoliMergeTrees = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');

const { readdirSync, existsSync } = require('fs');
const { join } = require('path');

const TocBuilder = require('./lib/toc-builder');

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
    const rfcs = readdirSync(join(this.getDataDirectory(), 'text'))
      .map((file) => file.replace(/\.md$/, ''))
      .map(file => `/id/${file}`);

    return ['/', ...rfcs];
  },

  treeForPublic() {
    let dataDirectory = this.getDataDirectory();

    const rfcsJSON = new StaticSiteJson(join(dataDirectory, 'text'), {
      contentFolder: 'rfcs',
      collate: true,
      type: 'rfcs',
      attributes: ['start-date', 'release-date', 'release-versions', 'proposal-pr', 'tracking-link'],
      references: ['teams', 'stage']
    });

    const teamsJSON = new StaticSiteJson(join(dataDirectory, 'teams'), {
      contentFolder: 'teams',
      collate: true,
      type: 'teams',
      attributes: ['name'],
    });

    const stagesJSON = new StaticSiteJson(join(dataDirectory, 'stages'), {
      contentFolder: 'stages',
      collate: true,
      type: 'stages',
      attributes: ['name'],
    });

    const readmeFile = funnel(dataDirectory, {
      files: ['README.md']
    });

    const pagesJSON = new StaticSiteJson(readmeFile, {
      contentFolder: 'pages',
      type: 'pages',
    })

    const tocTree = new TocBuilder(rfcsJSON);

    const trees = [rfcsJSON, teamsJSON, stagesJSON, tocTree, pagesJSON]

    if(existsSync(join(dataDirectory, 'images'))) {
      const images = funnel(join(dataDirectory, 'images'), {
        destDir: 'images'
      });

      trees.push(images);
    }

    return BroccoliMergeTrees(trees);
  }
};
