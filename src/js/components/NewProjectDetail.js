/**
 * Created by ArnoYao on 2015/9/14.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {SHOW_SECTION_TREE,SHOW_TREE_RESULT} from '../constants/launchr.js';
import $ from 'jquery';
import AvatarComponent from './AvatarComponent.js';
import reduxContainer from '../services/reduxContainer.js';
import SelectUserArea from './SelectUserArea.js'
import {task} from '../i18n/index.js';

export default class NewProjectDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state=this.getState();
    }

    render() {
        let memberHtml = this._getMembers();
        let memberNameList=this._getMemberNameList(this.state.members);
        return (
            <div className="approval-submit-box">
                <div className="head">
                    <input className="form-c" type="text" placeholder={task.ProjectName} valueLink={this.linkState('name')} />
                    <div className="task-member-group">
                        <span>{task.Member}</span>
                    {memberHtml}
                        <div className="chat-room-members-add icon-glyph-1" onClick={this._toggleUser.bind(this)}></div>
                    </div>
                </div>
                <SelectUserArea ref='project' selectKeys={memberNameList}  onCheck={this._setTreeResult.bind(this)}/>
                <div className="approval-submit-btn-group clearfix">
                    <div className="button cancle" onClick={::this._onclose}>{task.Cancel}</div>
                    <div className="button comfirm-pass" onClick={::this._onConfirm}>{task.Comfirm}</div>
                </div>
            </div>
        );
    }

    _getMembers() {
        return this.state.members.map((member, index)=> {
            return <div className="chat-room-member-small"><AvatarComponent userName={member.memberName} trueName={member.memberTrueName}/></div>
        })
    }

    _getMemberNameList(list) {
        return list.map((item) => (item.memberName));
    }

    //获取返回值
    _setTreeResult(result) {
        var result = $.extend([], result),data=[];
        $.each(result,(index,item)=>{
            data.push({
                memberName:item.name,
                memberTrueName:item.trueName
            })
        });
        this.setState({
            members: data
        });
    }

    //关闭
    _onclose() {
        this.props.onClose();
    }

    //保存
    _onConfirm() {
        this.props.onConfirm(this.state);
    }

    _toggleUser() {
        this.refs.project.show();
    }

    getState() {
        let members = [];
        if (this.props.project.members && this.props.project.members.length > 1) {
            members = this.props.project.members;
        } else {
            let currentInfo = reduxContainer.get().getState().userinfo.me;
            members = [{
                memberName: currentInfo.loginName,
                memberTrueName: currentInfo.name
            }];
        }
        return {
            showId: this.props.project.showId || '',
            name: this.props.project.name || '',
            members: members
        };
    }
}

Object.assign(NewProjectDetail.prototype, React.addons.LinkedStateMixin);