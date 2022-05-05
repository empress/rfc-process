/* eslint-disable ember/no-classic-classes, ember/require-computed-property-dependencies, prettier/prettier, ember/no-actions-hash */
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  application: controller(),

  previousRFC: computed('model.id', function() {
    let currentRFCIndex = this.application.model.links.indexOf(this.model.id)
    if(currentRFCIndex <= 0 ) {
      return;
    }

    return this.application.model.links[currentRFCIndex - 1];
  }),

  nextRFC: computed('model.id', function() {
    let currentRFCIndex = this.application.model.links.indexOf(this.model.id)
    if(currentRFCIndex >= this.application.model.links.length) {
      return;
    }

    return this.application.model.links[currentRFCIndex + 1];
  }),

  actions: {
    toggleSidebar() {
      document.body.classList.toggle('sidebar-hidden');
    }
  }
});
