import Controller, { inject as controller } from '@ember/controller';

export default class IndexController extends Controller {
  @controller application;

  get nextRFC() {
    return this.application.model.links[0];
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-hidden');
  }
}
