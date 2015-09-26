/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {Link} from 'react-router';

export default class ProjectTaskEdit extends React.Component{

    constructor(props){
        super(props);
        this.state={
            tagHidden:false,
            repeat:false
        }
    }

    render(){
        return (
            <div className="new-meeting-box">
                <div className="meeting-box-header">
                    <span>任务详情</span>
                    <i className="icon-glyph-167" onClick={::this.props.onClose}></i>
                </div>

                <div className="meeting-box-body">
                    <p className="meeting-detail-title">Lotus希望看到设计任务持续推进<span className="pull-right">高</span>
                        <span className="circle pull-right"></span></p>

                    <div className="attend-person-group">
                        <div className="task-line">
                            <div className="task-detail-title "><span>参与者</span></div>
                            <div className="task-detail-main">
                                <div className="chat-room-member"><img src="./public/img/jinmuyan.jpg" alt="" width="40" height="40"/><i
                                    className="icon-glyph-192 circle"></i></div>
                            </div>
                            <div className="task-detail-tips"><i className="demo-icon icon-glyph-91 default"></i><span
                                className="ordinary">进行中</span><i className="demo-icon icon-glyph-142 default"></i></div>
                        </div>
                    </div>
                    <div className="attend-person-group">
                        <div className="task-line">
                            <div className="task-detail-title "><span>项目</span></div>
                            <div className="task-detail-main"><span>Launchr</span></div>
                            <div className="task-detail-tips"><span className="emergency">8月4日截止</span></div>
                        </div>
                        <div className="task-line">
                            <div className="task-detail-title "><span>标签</span></div>
                            <div className="task-detail-main"><span>设计、App、日本</span></div>
                            <div className="task-detail-tips"><i className="demo-icon icon-glyph-80 default"></i><span>每周循环</span></div>
                        </div>
                    </div>


                    <div className="attend-person-group">
                        <p className="meeting-detail-topic">在如今这个开发布会，拿着 PPT 画大饼，巧舌如簧骗投资屡见不鲜的年代，如果有哪家初创公司五年来一直在拒绝融资，那他一定是疯了。</p>
                    </div>

                    <div className="meeting-line">
                        <div className="attend-title pull-left"><span>附件</span>
                        </div>
                        <div className="attend-meeting-detail">
                            <div className="meeting-detail-line">
                                <i className=" toolbar icon-glyph-35"></i>
                                <span>2015-03-26-1426047909.png</span>
                            </div>
                            <div className="meeting-detail-line">
                                <i className=" toolbar icon-glyph-35 "></i>
                                <span>报销单.jpg</span>
                            </div>
                        </div>
                    </div>

                    <p className="new-event-choose-time task-detail-new-subtask">
                        <span>子任务</span>
                        <span className="pull-right">新增子任务</span>
                        <i className="demo-icon icon-glyph-102 pull-right"></i>
                    </p>

                    <div className="attend-person-group ">
                        <div className="subtask-group">
                            <div className="subtask-member pull-left">
                                <div className="chat-room-member emergency-line">
                                    <img src="./public/img/jinmuyan.jpg" alt="" width="40" height="40"/>
                                </div>
                            </div>
                            <div className="subtask-detail">
                                <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                <div className="subtask-detail-line"><i className="demo-icon icon-glyph-91 default"></i><span className="default">进行中</span>
                                    <i className="demo-icon icon-glyph-118 default"></i>
                                </div>
                            </div>
                            <div className="subtask-tips pull-right"><i className="demo-icon icon-glyph-142 pull-right"></i></div>
                        </div>
                        <div className="subtask-group">
                            <div className="subtask-member pull-left">
                                <div className="chat-room-member emergency-line">
                                    <img src="./public/img/jinmuyan.jpg" alt="" width="40" height="40"/>
                                </div>
                            </div>
                            <div className="subtask-detail">
                                <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                <div className="subtask-detail-line"><i className="demo-icon icon-glyph-91 default"></i><span className="default">进行中</span>
                                    <i className="demo-icon icon-glyph-118 default"></i>
                                </div>
                            </div>
                            <div className="subtask-tips pull-right"><i className="demo-icon icon-glyph-142 pull-right"></i></div>
                        </div>
                        <div className="subtask-group">
                            <div className="subtask-member pull-left">
                                <div className="chat-room-member emergency-line">
                                    <img src="./public/img/jinmuyan.jpg" alt="" width="40" height="40"/>
                                </div>
                            </div>
                            <div className="subtask-detail">
                                <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                <div className="subtask-detail-line"><i className="demo-icon icon-glyph-91 default"></i><span className="default">进行中</span>
                                    <i className="demo-icon icon-glyph-118 default"></i>
                                </div>
                            </div>
                            <div className="subtask-tips pull-right"><i className="demo-icon icon-glyph-142 pull-right"></i></div>
                        </div>

                    </div>

                    <div className="meeting-chat-group">
                        <div className="meeting-chat-line">
                            <div className="meeting-chat-menber">
                                <span>Jerry Luoasdfasd:</span>
                            </div>
                            <div className="meeting-chat-detail">
                                <span>看似轻松的路，往往很拥挤，而花了一些力气，却能更快到达目的地。</span>
                            </div>
                            <div className="meeting-chat-time">3分钟前</div>
                        </div>
                    </div>

                    <div className="meeting-group-wrapper">
                        <div className="input-group">
                            <div className="input-group-addon">
                                <i className=" toolbar icon-glyph-118"></i>
                            </div>
                            <input className="form-c comment-input" type="text" />

                            <div className="input-submit-btm">
                                <span>评论</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="meeting-detail-footer-btn">
                    <a><i className=" toolbar icon-glyph-71"></i></a>
                    <a><i className=" toolbar icon-glyph-77"></i></a>
                    <a><i className=" demo-icon icon-trash-empty"></i></a>
                </div>
            </div>
        )
    }

}

Object.assign(ProjectTaskEdit.prototype, React.addons.LinkedStateMixin);