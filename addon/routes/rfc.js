import Route from '@ember/routing/route';
export default class RfcsRoute extends Route {

  model(params) {
    return this.store.findRecord('rfc', params.id);
  }
}
