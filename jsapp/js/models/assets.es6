import {assign} from '../utils';
import _ from 'underscore';
import moment from 'moment';

class CollectionMixin {
  constructor (asset, params) {
    this.asset = asset;
  }
}

class AssetWithContentMixin {
  constructor (asset, params) {
    this.asset = asset;
  }
}

class BaseAsset {
  constructor (params) {

    if (params.tag_string) {
      params.tags = params.tag_string.split(',');
    }
    delete params['tag_string'];

    this.pickKeys(params, [
      "uid",
      "name",
      "tags",
      "kind",
      "owner",
      "children",
      "downloads",
      "asset_type",
      "date_created",
      "date_modified",
    ]);

    this.setTimeAttribute('date_modified');
    this.setTimeAttribute('date_created');
    this.setSummary();
    this.processDownloads();

    this.load(params);
  }
  setTimeAttribute (whichTime) {
    if (!this[whichTime]) {
      this[whichTime] = moment().toISOString();
    }
    if (!this[`${whichTime}__time`]) {
      this[`${whichTime}__time`] = moment(this[whichTime]).toDate().getTime();
    }
  }
  toJsonString (n) {
    return JSON.stringify(this.__items, null, n);
  }
  processDownloads () {
    this.downloads = [];
  }
  setSummary () {
    this.summary = {
      languages: [],
    };
  }
  pickKeys (params, keys) {
    assign(this, _.pick(params, keys));
  }
  dump () {
    let tag_string;
    if (this.tags && this.tags.length > 0) {
      tag_string = this.tags.join(',');
    }
    return assign({
      uid: this.uid,
      url: this.url,
      name: this.name,
      children: this.children,
      tag_string: tag_string,
      kind: this.kind,
      downloads: this.downloads,
      date_created: this.date_created,
      date_modified: this.date_modified,
      asset_type: this.asset_type,
    }, this.dumpItem());
  }
}

class Collection extends BaseAsset {
  loadDumpKeys () {
    return [
      "ancestors",
      "owner",
      "owner__username",
      "parent",
      "permissions",
    ];
  }
  load (params) {
    this.pickKeys(params, this.loadDumpKeys());
  }
  dumpItem () {
    return _.pick(this, this.loadDumpKeys());
  }
}

class AssetWithContent extends BaseAsset {
  load (params) {
    this.pickKeys(params, [
      "summary",
    ]);
    if (!params.content) {
      throw new Error('no content');
    }
    // parse content here
    this.content = params.content;
    this.afterContentSet();
  }
}

class LibraryQuestionBlock extends AssetWithContent {
  afterContentSet () {
  }
  dumpItem () {
    return {
      summary: this.summary,
      content: this.content,
    };
  }
}
class Survey extends AssetWithContent {
  afterContentSet () {

  }
  dumpItem () {
    return {
      summary: this.summary,
      content: this.content,
    };
  }
}


export function buildAsset (asset, from='local') {
  var _c = asset.kind === 'collection' ?
    Collection
    :
    {
      survey: Survey,
      question: LibraryQuestionBlock,
      block: LibraryQuestionBlock,
    }[asset.asset_type];
  return new _c(asset);
  // return new _c(new _c(asset).dump())
}
