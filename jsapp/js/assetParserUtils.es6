import {
  parsePermissions,
  assign,
} from './utils';

function parseTags (asset) {
  return {
    tags: asset.tag_string.split(',').filter((tg) => { return tg.length > 1; })
  };
}

function parseResponsePermissions (resp) {
  if (!resp.owner__username) {
    return {};
  }
  var out = {};
  var pp = parsePermissions(resp.owner__username, resp.permissions);
  out.parsedPermissions = pp;

  var isPublic = !!resp.permissions.filter(function(pp_){
    return pp_.user__username === 'AnonymousUser';
  })[0];

  out.access = (()=>{
    var viewers = {};
    var changers = {};
    pp.forEach(function(userPerm){
      if (userPerm.can.view) {
        viewers[userPerm.username] = true;
      }
      if (userPerm.can.change) {
        changers[userPerm.username] = true;
      }
    });
    return {view: viewers, change: changers, ownerUsername: resp.owner__username, isPublic: isPublic};
  })();
  return out;
}

function parseSettings (asset) {
  var settings = asset.content && asset.content.settings;
  if (settings) {
    if (settings.length) {
      settings = settings[0];
    }
    return {
      unparsed__settings: settings,
      settings__style: settings.style,
      settings__form_id: settings.form_id,
      settings__title: settings.title,
    };
  } else {
    return {};
  }
}

function parsed (asset) {
  var _p = assign(asset,
      parseSettings(asset),
      parseResponsePermissions(asset));
  if (_p.tag_string) {
    return assign(_p, parseTags(asset));
  } else {
    return _p;
  }
}

function prepareAsset (asset) {
  if (!asset.tags) {
    asset.tags = [];
  }
  return asset;
}

export default {
  parsed: parsed,
  prepareAsset: prepareAsset,
  parseTags: parseTags,
  parseResponsePermissions: parseResponsePermissions,
}

