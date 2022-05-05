/* eslint-disable ember/use-ember-data-rfc-395-imports */
import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  links: DS.attr(),
});
