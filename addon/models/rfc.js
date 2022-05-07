import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class RfcModel extends Model {
  @attr content;
  @attr html;

  @attr('date') startDate;
  @attr('date') releaseDate;
  @attr releaseVersions;
  @attr proposalPr;
  @attr trackingLink;

  @hasMany('team') teams;
  @belongsTo('stage') stage;
}
