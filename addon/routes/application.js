import Route from '@ember/routing/route';
export default class ApplicationRoute extends Route {

  async model() {
    const [, , toc] = await Promise.all([
      this.store.findAll('team'),
      this.store.findAll('stage'),
      this.store.findRecord('toc', 'rfcs'),
    ]);
    return toc;
  }
}
