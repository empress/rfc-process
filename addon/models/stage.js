import Model, { attr } from '@ember-data/model';

export default class StageModel extends Model {
  @attr content;
  @attr html;
  @attr name;
}
