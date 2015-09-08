import React from 'react/addons';
import bem from './bem';
import _ from 'underscore';
import Router from 'react-router';
import {RouteHandler} from 'react-router';
import Reflux from 'reflux';

// import {dataInterface} from 'dataInterface';

import {log, t, notify,
          parsePermissions,
          formatTime,
          anonUsername,
          getAnonymousUserPermission,
        } from './utils';

var TagList = bem('tag-list');
var TagList__header = TagList.__('header');
var TagList__content = TagList.__('content');
var TagList__headeritem = TagList.__('headeritem');
var TagList__row = TagList.__('row');
var TagList__tagname = TagList.__('tagname');
var TagList__taginfo = TagList.__('taginfo');
var TagList__button = TagList.__('button', '<button>');

var TagListComponent = React.createClass({
  mixins: [
    Reflux.ListenerMixin,
  ],
  getInitialState () {
    return {
      list: [
              {
                "status": "coded",
                "color": "green",
                "count": 6
              },
            ]
          };
  },
  render () {
    return (
        <TagList>
          <TagList__header>
            <TagList__headeritem m='count'>
              {t('___ tags').replace('___', this.state.list.length)}
            </TagList__headeritem>
            <TagList__headeritem m='sort'>
              {t('sort')}
            </TagList__headeritem>
          </TagList__header>
          <TagList__content>
            {this.state.list.map(function(tag){
              return (
                  <TagList__row>
                    <TagList__tagname style={{backgroundColor: tag.color}}>
                      <i />
                      {tag.status}
                    </TagList__tagname>
                    <TagList__taginfo>
                      {t('___ tags').replace('___', tag.count)}
                    </TagList__taginfo>
                    <TagList__button m='edit'>
                      <i />
                      {t('edit')}
                    </TagList__button>
                    <TagList__button m='delete'>
                      <i />
                      {t('delete')}
                    </TagList__button>
                  </TagList__row>
                );
            })}
          </TagList__content>
        </TagList>
      );
  },
});

export default TagListComponent;