'use strict';

const path = require('path');
const { applyConfig } = require('empress-blueprint-helpers');

module.exports = {
  description: 'Default blueprint for rfc-process',

  normalizeEntityName() {
    // no-op
  },

  filesToRemove: ['app/templates/application.hbs'],

  async afterInstall() {
    let devInstall = {
      packages: ['prember', 'ember-cli-fastboot'],
    };

    await this.addAddonsToProject(devInstall);

    applyConfig(this.project, 'rfcs', {
      title: 'rfc-process',
      description: 'RFC Workflow App - Built with Ember',
    });
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
