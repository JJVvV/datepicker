/**
 * Created by Administrator on 2015/7/10.
 */
/*
 * application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import {SHOW_TREE_RESULT,SHOW_CHAT_ADD_TREE,ENTER} from '../../constants/launchr.js';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import actionContainer from '../../services/actionContainer.js';
import SelectUserArea from '../SelectUserArea.js'
import reduxContainer from '../../services/reduxContainer.js';

export default class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            A_CC: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name,
        });
    }

    render() {
        let {isGroup}= this.props;
        const {name ,memberList,removeUser} = this.props;
        let me = reduxContainer.me();
        isGroup = isGroup && _.first(memberList).userName == me.id;
        return (
            <div className="chat-room">
                <div className="chat-room-inner">
                    {isGroup &&
                    <div className="chat-room-search">
                        <label for="chat-room-search"></label>
                        <input type="text" id="chat-room-search"
                               onKeyPress={this.keyPress.bind(this)}
                               onChange={this.change.bind(this)}
                               value={this.state.name}/>
                    </div>}
                    <div className="chat-room-members clearfix">
                        <div className="chat-room-members-add icon-glyph-1"
                             onClick={this.toggleUser.bind(this, SHOW_TREE_RESULT.CHAT_ADD_PEOPLE)}></div>
                        { _.map(memberList, user=> {
                            return (
                                <div className="chat-room-member">
                                    <img src={user.avatar} alt={user.nickName} width="47" height="47"/>
                                    { isGroup &&
                                    <i className="icon-glyph-192 circle" onClick={removeUser.bind(this,user)}></i>}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <SelectUserArea ref="approve" multiple={true}
                                selectKeys={this.state.A_CC}
                                getSelectKeys={this.getSelectKeys.bind(this)}
                                onCheck={this._setTreeResult.bind(this, SHOW_TREE_RESULT.CHAT_ADD_PEOPLE)}/>
            </div>
        );
    }

    getSelectKeys(list) {
        return list.map((item, index)=> {
            return item.name;
        });
    }

    toggleUser(type) {
        this.refs.approve.show();
    }

    change(event) {
        this.setState({
            name: event.target.value
        });
    }

    keyPress(event) {
        let val = _.trim(this.state.name);
        if (event.which === ENTER && val.length) {
            let action = actionContainer.get();
            action.modifyGroupName(this.props.currentThreadID, val);
        }
    }

    _setTreeResult(show, result) {
        if (result.length == 0) {
            return;
        }
        let action = actionContainer.get();
        if (this.props.isGroup) {
            action.addGroupUser(this.props.currentThreadID, result);
        } else {
            let currentUser = _.last(this.props.memberList);
            action.creatGroup([...result, {
                id: currentUser.id,
                url: currentUser.avator,
                trueName: currentUser.nickName
            }]).then(res=> {
                action.changeThread(res.threadID, res.title);
            });

        }

    }
}



