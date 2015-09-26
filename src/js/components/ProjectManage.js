/**
 * Created by ArnoYao on 2015/9/11.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import {sliderShow} from '../services/slider.js';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, SLIDER_ON_CLOSE, S} from '../constants/launchr.js';

import ProjectList from './ProjectList.js';
import Tag from './Tag.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {task} from '../i18n/index.js';

export default class ProjectManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showProject: true,
            selected: 0
        }
    }

    componentDidMount() {
        this. unsubscribeSlider = PubSub.subscribe(SLIDER_ON_CLOSE, (eventName, data)=> {
            this.setState({
                selected: 0
            })
        })
    }

    componentWillUnmount(){
        PubSub.unsubscribe(this.unsubscribeSlider);
    }

    render() {
        return (
            <div className="approval-area global-detail-area">
                <div className="approval">
                    <div className="attend-person-group">
                        <div className="approval-handle-title-wrapper" style={{width: '50%'}}>
                            <div className="approval-handle-title clearfix">
                                <div  className={classnames({
                                    "approval-handle-title-item": true,
                                    active: this.state.showProject
                                })} onClick={::this._showProject}>
                                    <span>{task.Project}</span>
                                </div>
                                <div className={classnames({
                                    "approval-handle-title-item": true,
                                    active: !this.state.showProject
                                })}  onClick={::this._showTag} style={{display:'none'}}>
                                    <span>{task.Label}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.showProject && <ProjectList></ProjectList>}
                    {!this.state.showProject && <Tag></Tag>}

                    <div className="chat-send" style={{height:"200px"}}>
                        <div className="approval-body">
                            <div className="meeting-detail-group">
                                <div className="footer-attend-task" onClick={this._showSearchList.bind(this,3)}>
                                    <span className= {classnames({'task-item':true, active:this.state.selected==3})}>{task.MyAttendTask}</span>
                                </div>
                                <div className="footer-attend-task" onClick={this._showSearchList.bind(this,4)}>
                                    <span className={classnames({'task-item':true, active:this.state.selected==4})}>{task.MySendTask}</span>
                                </div>
                                <div className="footer-attend-task" onClick={this._showSearchList.bind(this,100)}>
                                    <span className={classnames({'task-item':true, active:this.state.selected==100})}>{task.EndToday}</span>
                                </div>
                                <div className="footer-attend-task" onClick={this._showSearchList.bind(this,101)}>
                                    <span className={classnames({'task-item':true, active:this.state.selected==101})}>{task.EndWeek}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //显示项目
    _showProject() {
        if (!this.state.showProject) {
            this.setState({
                showProject: true
            });
        }
    }

    //显示标签
    _showTag() {
        if (this.state.showProject) {
            this.setState({
                showProject: false
            });
        }
    }

    //查询数据
    _showSearchList(data) {
        this.setState({
            selected: data || 0
        });
        sliderShow({
            type: S.TASK_SEARCH,
            task: {
                type: data
            }
        });
    }
}

Object.assign(ProjectManage.prototype, React.addons.LinkedStateMixin);



