import Model, { attr } from '@ember-data/model';

export default class TeamModel extends Model {
  @attr content;
  @attr html;
  @attr name;
}
