import Model, { attr } from '@ember-data/model';

export default class TocModel extends Model {
  @attr links;
  @attr stageLinks;
  @attr stages;
}
