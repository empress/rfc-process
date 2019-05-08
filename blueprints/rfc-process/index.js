'use strict';

module.exports = {
  description: 'Default blueprint for rfc-process',

  filesToRemove: ['app/templates/application.hbs'],

  afterInstall() {
    let devInstall = {
      packages: [
        'prember',
        'ember-cli-fastboot',
      ]
    }

    return this.addAddonsToProject(devInstall);
  }
};
