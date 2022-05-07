import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  async model() {
    const [, , toc] = await Promise.all([
      this.store.findAll('team'),
      this.store.findAll('stage'),
      this.store.findRecord('toc', 'rfcs'),
    ]);
    return toc;
  }
}
