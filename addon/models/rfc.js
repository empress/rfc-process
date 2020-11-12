import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  start: DS.attr('date'),
  release: DS.attr(),
  releaseVersions: DS.attr(),
  teams: DS.hasMany(),
  rfc: DS.attr(),
  stage: DS.attr(),
  content: DS.attr(),
  html: DS.attr(),
});
