/* eslint-disable prettier/prettier */
import Router from '../router';

export function initialize() {
  Router.map(function() {
    this.route('rfc', { path: 'id/:id' });
  });
}

export default {
  initialize
};
