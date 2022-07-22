import HeadData from 'ember-meta/services/head-data';
import config from 'ember-get-config';
import { getExcerpt, stripHTML } from '../helpers/excerpt';

const { rfcs } = config;

export default class HeadDataService extends HeadData {
  get config() {
    return rfcs;
  }

  get url() {
    // url is only ever valid if you have a host
    if (!rfcs.host) {
      return null;
    }

    // we remove any trailing / from the host and add it back in to make sure
    // that we always have a consistent URL
    const normalisedHost = rfcs.host.replace(/\/$/, '');
    const normalisedUrl = this.router.currentURL.replace(/\/$/, '');

    return `${normalisedHost}${normalisedUrl}/`;
  }

  get siteName() {
    return this.config.title;
  }

  get description() {
    let currentModel = this.currentRouteMeta;

    if (currentModel && currentModel.html) {
      let excerpt = getExcerpt(currentModel.html, {
        words: 33,
      });

      // TODO remove this when we separate title and content
      excerpt = excerpt.replace(new RegExp(`^${this.title} `), '');

      return `${excerpt}${
        excerpt.length !== stripHTML(currentModel.html).length ? '...' : ''
      }`;
    }

    return rfcs.description;
  }
}
