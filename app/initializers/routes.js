import Router from '../router';

export function initialize() {
  Router.map(function() {
    this.route('rfc', { path: '/:id' });
  });
}

export default {
  initialize
};
