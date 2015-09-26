/**
 * Created by ArnoYao on 2015/9/11.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import moment from 'moment';
import AvatarComponent from './AvatarComponent.js';
import {getTaskDetail} from '../services/taskService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';

export default class TaskSearchList extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div> {this._getTaskList(this.props.data)}</div>
        );
    }

    _getTaskList(data) {
        return data.map((task, index)=> {
            return <div className="subtask-group pointer" onClick={this._getTaskDetail.bind(this,task.taskId)}>
                <div className="subtask-member pull-left">
                    <div className={classnames({
                        'chat-room-member': true,
                        'height-line': task.priority == 'HIGH',
                        'medium-line': task.priority == 'MEDIUM'
                    })}>
                        <AvatarComponent userName={'default'} trueName={''}/>
                    </div>
                </div>
                <div className="subtask-detail">
                    <div className="subtask-detail-line">
                    {task.statustype == 'Finish' ? <s>{task.title}</s> : <span>{task.title}</span>}</div>
                    <div className="meeting-detail-line">
                        <span className="title">{task.projectName}</span>
                    {task.endTime != null && task.endTime != 0 && <div className="line-detail-group">
                        <i className="demo-icon icon-glyph-101"></i>
                        <span className={classnames({"important": this._importantEndTime(task)})}>{moment(task.endTime).format("MM月DD日")}</span>
                    </div>}
                        <div className="line-detail-group">
                            <i className="demo-icon icon-glyph-91"></i>
                            <span>{task.statusName}</span>
                        </div>
                    {task.level == 1 && task.allTask>0 && <div className="line-detail-group">
                        <i className="demo-icon icon-glyph-83"></i>
                        <span>{task.finishedTask}/{task.allTask}</span>
                    </div>}
                    {task.isAnnex == 1 && <div className="line-detail-group">
                        <i className="demo-icon icon-glyph-118"></i>
                    </div>}
                        <div className="line-detail-group">
                            <i className="demo-icon icon-glyph-29"></i>
                        </div>
                    </div>
                </div>
                <div className="subtask-tips pull-right" style={{display:'none'}}>
                    <i className="demo-icon icon-glyph-142 pull-right"></i>
                </div>
            </div>
        })
    }

    //获取任务详情
    _getTaskDetail(data) {
        sliderShow({
            type: S.TASK_DETAIL,
            task: {
                showId: data
            }
        });
    }

    //是否快到截止日期
    _importantEndTime(data) {
        if (data.statustype != 'Finish') {
            let nowDate = new Date().getTime();
            if (data.endTime > 0 && nowDate >= data.endTime) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}

Object.assign(TaskSearchList.prototype, React.addons.LinkedStateMixin);



