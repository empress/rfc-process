'use strict';

module.exports = {
  description: 'Default blueprint for RFC Process when installed into an addon',

  normalizeEntityName() {
    // no-op
  },

  filesToRemove: ['tests/dummy/app/templates/application.hbs'],
};
