import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  application: controller(),
  nextRFC: computed(function() {
    return this.application.model.links[0];
  }),

  actions: {
    toggleSidebar() {
      document.body.classList.toggle('sidebar-hidden');
    }
  }
});
