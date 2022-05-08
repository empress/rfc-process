'use strict';

const path = require('path');

module.exports = {
  description: 'Default blueprint for rfc-process',

  normalizeEntityName() {
    // no-op
  },

  filesToRemove: ['app/templates/application.hbs'],

  afterInstall() {
    let devInstall = {
      packages: ['prember', 'ember-cli-fastboot'],
    };

    return this.addAddonsToProject(devInstall);
  },

  fileMapTokens: function () {
    let isAddon = this.project.isEmberCLIAddon();
    return {
      __base__() {
        if (isAddon) {
          return path.join('tests', 'dummy');
        }
        return '';
      },
    };
  },
};
