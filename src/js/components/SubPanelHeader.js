/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import PubSub from 'pubsub-js';
import SelectUserArea from './SelectUserArea.js'
import {SHOW_TREE_RESULT,SHOW_CHAT_TREE} from '../constants/launchr.js';
import actionContainer from '../services/actionContainer.js';

export default class SubPanelHeader extends React.Component {

    constructor() {
        super();
        this.state = {
            value: '',
            A_CC:[]
        }
    }

    render() {
        return (
            <header className="sub-panel-header">
                <span className="btn-add icon-glyph-102"
                      onClick={this.toggleUser.bind(this, SHOW_TREE_RESULT.CHAT_PEOPLE)}></span>

                <div className="form-feedback work-search left">
                    <input type="search" className="form-c" placeholder="搜索" valueLink={this.linkState('value')}/>
                    <span className="feedback  icon-glyph-115"></span>
                </div>
                <SelectUserArea ref="approve" multiple={true}
                                selectKeys={this.state.A_CC}
                                getSelectKeys={this.getSelectKeys.bind(this)}
                                onCheck={this._setTreeResult.bind(this, SHOW_TREE_RESULT.CHAT_PEOPLE)}  />
            </header>
        );

    }

    getSelectKeys(list){
        return list.map((item, index)=>{
            return item.name;
        });
    }

    toggleUser(type) {
        this.refs.approve.show();
    }

    _setTreeResult(show, result) {
        if (result.length == 0) {
            return;
        }
        let action = actionContainer.get();
        (()=> (result.length === 1 ? action.addChatTalk(result[0]) : action.creatGroup(result)))().then(res=> {
            action.changeThread(res.threadID, res.title);
        });
    }
}

Object.assign(SubPanelHeader.prototype, React.addons.LinkedStateMixin);