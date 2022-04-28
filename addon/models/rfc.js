import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  content: DS.attr(),
  html: DS.attr(),

  startDate: DS.attr('date'),
  releaseDate: DS.attr('date'),
  releaseVersions: DS.attr(),
  proposalPr: DS.attr(),
  trackingLink: DS.attr(),


  teams: DS.hasMany('team'),
  stage: DS.belongsTo('stage'),
});
