/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {Link} from 'react-router';
import {getProjectList,addTask,updateTask,getTaskDetail} from '../services/taskService.js';
import {REFRESH_TASK,SHOW_SECTION_TREE,SHOW_TREE_RESULT} from '../constants/launchr.js';
import Datepicker from './calendar/Datepicker.js';
import ToggleBtn from './ToggleBtn.js';

import $ from 'jquery';
import FileUploadComponent from '../components/FileUploadComponent.js';
import {arrayRemove} from '../services/arrayService.js'
import SelectUserArea from './SelectUserArea.js'
import actionContainer from '../services/actionContainer.js';
import AvatarComponent from './AvatarComponent.js';
import reduxContainer from '../services/reduxContainer.js';
import {task} from '../i18n/index.js';

export default class ProjectTaskAdd extends React.Component {

    constructor(props) {
        super(props);
        let currentInfo = reduxContainer.get().getState().userinfo.me;
        this.state = {
            showId: '',
            parentId: '',
            title: '',
            project: '',
            projectList: [{}],
            priority: 'LOW',
            detail: '',
            endTime: new Date().getTime(),
            tag: false,
            repeat: false,
            remind: false,
            IS_DEADLINE_ALL_DAY: 0,
            //memberNames:[],
            //memberTrueNames:[],
            attendMembers: [{
                name:currentInfo.loginName,
                trueName:currentInfo.name
            }], //选人控件中传回来的数据
            fileShowIds: []
        }
    }

    componentDidMount() {
        this._getProjectList().then(() => {
            this._initTask(this.props.task);
        });
    }

    componentWillUnMount() {

    }

    render() {
        let isSelectDisabled = (this.state.project != '' && this.state.parentId != '') || (this.state.showId != '') ? "disabled" : "";
        return (
            <div className="new-meeting-box">
                <div className="meeting-box-header">
                    <span>{this.state.showId != '' ? task.EditTask : task.NewTask}</span>
                    <i className="icon-glyph-167" onClick={::this.props.onClose}></i>
                </div>
                <div className="meeting-box-body">
                    <div>
                        <input className="form-c" type="text" placeholder={task.FillTaskName} valueLink={this.linkState('title')}/>
                    </div>

                    <div className="clearfix">
                        <div className="new-event-place pull-left">
                            <div className="event-input-group">
                                {this.state.projectList && (<select name="" id="" defaultValue={this.state.project}
                                                                    valueLink={this.linkState('project')}
                                                                    disabled={isSelectDisabled}
                                                                    className="form-c clear-attr">
                                    {this.state.projectList.map(function (item, index) {
                                        return (<option value={item.showId}>{item.name}</option>)
                                    })}
                                </select>)}
                            </div>
                        </div>
                        <div className="new-event-switch pull-left">
                            <div style={{width: '80% ', float: 'right'}}>
                                <select name="" id="" defaultValue={this.state.priority}
                                        valueLink={this.linkState('priority')} className="form-c clear-attr">
                                    <option value="LOW">{task.Low}</option>
                                    <option value="MEDIUM">{task.Medium}</option>
                                    <option value="HIGH">{task.High}</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="">
                        <div className="approve-line">
                            <div className="attend-title pull-left">
                                <span>{task.Participant}</span>
                            </div>
                            <div className="attend-meeting-detail">
                                <div className="meeting-detail-line">
                                    {this.state.attendMembers.map((item, index)=> {
                                        return <div className="chat-room-member">
                                            <AvatarComponent userName={item.name} trueName={item.trueName}/><i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.attendMembers,item.name)}></i>
                                        </div>
                                    })}
                                    <div className="chat-room-members-add icon-glyph-1"
                                         onClick={this._toggleUser.bind(this)}></div>
                                </div>
                            </div>
                        </div>
                        <SelectUserArea ref="task" multiple={false}
                                        selectKeys={::this.getSelectKeys(this.state.attendMembers)}
                                        onCheck={this._setTreeResult.bind(this)}/>

                        <div className="approve-line">
                            <div className="attend-title pull-left">
                                <span>{task.EndTime}</span>
                            </div>
                            <div className="attend-meeting-detail">
                                <div className="meeting-detail-line">
                                    <div className="input-group-wrapper">
                                        <div className="form-feedback left-item ">
                                            <Datepicker dateFormatAllDay={"MM-DD"} dateFormatNotAllDay={"MM-DD H:mm"}
                                                        className="form-c" allDay={this.state.IS_DEADLINE_ALL_DAY == 1}
                                                        onChange={::this._getDeadline}
                                                        date={new Date(this.state.endTime)}/>
                                            <span className="feedback  icon-glyph-89"></span>
                                        </div>
                                    </div>
                                    <div className="new-event-switch pull-right approval-switch-day">
                                        <span>{task.AllDay}</span>
                                        <ToggleBtn on={this.state.IS_DEADLINE_ALL_DAY} style={{float: "right"}}
                                                   className="demo-icon"
                                                   onToggleBtnChange={::this._onToggleDeadlineAllday}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.tag && (<div className="approve-line">
                            <div className="attend-title pull-left">
                                <span>{task.Label}</span>
                            </div>
                            <div className="attend-meeting-detail">
                                <div className="form-c tag-box">
                                    <div className="tag-edit">
                                        <span>移动端</span>
                                        <i className=" toolbar icon-glyph-167"></i>
                                    </div>
                                    <div className="tag-inactive">
                                        <span>Apple</span>
                                    </div>
                                    <div className="tag-edit">
                                        <span>移动端</span>
                                        <i className=" toolbar icon-glyph-167"></i>
                                    </div>
                                    <div className="tag-inactive">
                                        <span>移动端</span>
                                    </div>
                                    <div className="tag-edit">
                                        <span>移动端</span>
                                        <i className=" toolbar icon-glyph-167"></i>
                                    </div>
                                    <div className="tag-inactive">
                                        <span>Apple</span>
                                    </div>
                                    <div className="tag-edit">
                                        <span>移动端</span>
                                        <i className=" toolbar icon-glyph-167"></i>
                                    </div>
                                    <div className="tag-inactive">
                                        <span>移动端</span>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                    {this.state.repeat && (<select className="form-c" name="" id="">
                        <option>重复周期</option>
                        <option>重复周期</option>
                        <option>重复周期</option>
                    </select>)}
                    {this.state.remind && (<select className="form-c pull-right" name="" id="">
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                    </select>)}
                    <textarea className="form-c" name="" id="" cols="30" rows="2" placeholder={task.Remark}
                              valueLink={this.linkState('detail')}></textarea>
                    <FileUploadComponent
                        appShowID={'PWP56jQLLjFEZXLe'}
                        addFile={this._addFile.bind(this)}
                        removeFile={this._removeFile.bind(this)}
                        loadAttachments={::this._loadAttachments}
                        rmShowID={this.props.task!=null && this.props.task!=undefined ?this.props.task.showId:""}
                        ></FileUploadComponent>

                    <div className="meeting-box-footer">
                        <span className="btn-comfirm" onClick={::this._addAndUpdateTask}>{task.Comfirm}</span>
                        <span className="btn-cancle" onClick={::this.props.onClose}>{task.Cancel}</span>
                    </div>
                </div>
            </div>
        )
    }

    //新增任务
    _addAndUpdateTask() {
        if (this.state.showId != '') {
            updateTask(this.state, "").then(res=> {
                var resData = packRespnseData(res);
                if (resData.Data) {
                    this.props.onClose();
                    if (this.props.task && this.props.task.msgId) {
                        let requestData = {
                            showId: this.state.showId
                        };
                        actionContainer.get().getChatTaskDetail(requestData, this.props.task.msgId);
                    } else {
                        let data = resData.Data;
                        PubSub.publish(REFRESH_TASK, {...data, method: 'Update'});
                    }
                }
                else {
                    alert(resData.Reason);
                }
            })
        }
        else {
            addTask(this.state).then(res=> {
                var resData = packRespnseData(res);
                if (resData.Data) {
                    this.props.onClose();
                    if (this.props.task && !this.props.task.msgId) {
                        let data = resData.Data;
                        PubSub.publish(REFRESH_TASK, {...data, method: 'Add'});
                    }
                }
                else {
                    alert(resData.Reason);
                }
            })
        }
    }

    //初始化任务
    _initTask(data) {
        if (data && data.pId && data.parentId) {
            this.setState({
                project: data.pId,
                parentId: data.parentId
            });
        } else if (data && data.showId) {
            getTaskDetail(data).then(res=> {
                var resData = packRespnseData(res);
                if (resData.Data) {
                    this.setState({
                        showId: resData.Data.SHOW_ID,
                        parentId: resData.Data.T_PARENT_SHOW_ID,
                        title: resData.Data.T_TITLE,
                        project: resData.Data.P_SHOW_ID,
                        priority: resData.Data.T_PRIORITY,
                        detail: resData.Data.T_BACKUP,
                        endTime: resData.Data.T_END_TIME || '',
                        attendMembers: this._initMembers(resData.Data.T_USERS, resData.Data.T_USERS_NAME)
                    });
                } else {
                    alert(resData.Reason);
                }
            })
        } else if (data && data.pId) {
            this.setState({
                project: data.pId
            });
        } else {
            this.setState({
                project: this.state.projectList[0].showId
            })
        }
    }


    //获取项目
    _getProjectList() {
        return getProjectList().then(res=> {
            var resData = packRespnseData(res);
            if (resData.Data && resData.Data.length > 0) {
                this.setState({
                    projectList: resData.Data
                });
            }
            else {
                alert(resData.Reason);
            }
        })
    }

    _getDeadline(e) {
        this.setState({
            endTime: e.valueOf()
        });
    }

    _onToggleDeadlineAllday(allday) {
        this.setState({
            IS_DEADLINE_ALL_DAY: allday ? 1 : 0
        });
    }

    //添加附件
    _addFile(fileShowID) {
        let fileIds = this.state.fileShowIds.map(function (item, index) {
            return item;
        });
        fileIds.push(fileShowID);
        this.setState({
            fileShowIds: fileIds
        });
    }

    //删除附件
    _removeFile(fileShowID) {
        this.setState({
            fileShowIds: arrayRemove(this.state.fileShowIds, fileShowID)
        });
    }

    //加载附件
    _loadAttachments(fileShowIds) {
        this.setState({
            fileShowIds: fileShowIds
        });
    }

    //初始化参与人
    _initMembers(users, userNames) {
        users = users || [];
        userNames = userNames || [];
        return members = users.map((item, index)=> {
            return {
                name: users[index] || '',
                trueName: userNames[index] || ''
            }
        });
    }

    //选人控件
    _toggleUser() {
        this.refs.task.show();
    }

    //获取返回值
    _setTreeResult(result) {
        var result = $.extend([], result), data = [];
        $.each(result, function (index, item) {
            data.push({
                name: item.name,
                trueName: item.trueName,
                image: item.url
            })
        });
        this.setState({
            attendMembers: data
        });
    }

    getSelectKeys(list) {
        return list.map((item, index)=> {
            return item.name;
        });
    }


    _removeUser(users, user) {
       let index= _.findIndex(users,function(item){
            return item.name==user;
        })

        users.splice(index,1);

        this.setState({attendMembers:users});
    }
}


Object.assign(ProjectTaskAdd.prototype, React.addons.LinkedStateMixin);