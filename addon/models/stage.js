/* eslint-disable ember/use-ember-data-rfc-395-imports */
import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  content: DS.attr(),
  html: DS.attr(),
  name: DS.attr(),
});
