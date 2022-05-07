import Controller, { inject as controller } from '@ember/controller';

export default class RfcController extends Controller {
  @controller application;

  get previousRFC() {
    let currentRFCIndex = this.application.model.links.indexOf(this.model.id);
    if (currentRFCIndex <= 0) {
      return null;
    }

    return this.application.model.links[currentRFCIndex - 1];
  }

  get nextRFC() {
    let currentRFCIndex = this.application.model.links.indexOf(this.model.id);
    if (currentRFCIndex >= this.application.model.links.length) {
      return null;
    }

    return this.application.model.links[currentRFCIndex + 1];
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-hidden');
  }
}
