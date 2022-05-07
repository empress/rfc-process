/* eslint-disable ember/no-classic-classes, prettier/prettier */
import Route from '@ember/routing/route';

export default Route.extend({
  async model() {
    const [, , toc] = await Promise.all([
      this.store.findAll('team'),
      this.store.findAll('stage'),
      this.store.findRecord('toc', 'rfcs'),
    ])
    return toc;
  }
});
