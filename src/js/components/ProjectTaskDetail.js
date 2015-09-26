/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {Link} from 'react-router';
import {getTaskDetail,deleteTask,updateTask} from '../services/taskService.js';
import moment from 'moment';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S,REFRESH_TASK,REFRESH_TASK_DETAIL,MESSAGE_APP_TYPE} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import ProjectChildTask from './ProjectChildTask';
import Comment from '../components/Comment.js';
import reduxContainer from '../services/reduxContainer.js';
import _ from 'lodash';
import FileShowComponent from '../components/FileShowComponent.js';
import actionContainer from '../services/actionContainer.js';
import AvatarComponent from './AvatarComponent.js';
import {task} from '../i18n/index.js';

export default class ProjectTaskDetail extends React.Component{

    constructor(props){
        super(props);
        this.state={
            showId:'',
            title:'',
            level:'',
            users:[],
            userNames:[],
            status:'',
            statusName:'',
            project:'',
            projectName:'',
            endtime:'',
            detail:'',
            projectStatusList:[],
            children:[],
            isParent:'',
            statusList:[],
            create_user:'',
            create_user_name:'',
            methodType:'',
            mainUsers:[],
            mainUserNames:[],
            mainCreateUser:'',
            mainCreateUserName:'',
            isShowLevel:false,
            tag:false,
            isAnnex:0,
            fileShowIds:[]
        }
    }

    toggleDropdown(e){
        if(e.target !== React.findDOMNode(this.refs.statusName)&&e.target !== React.findDOMNode(this.refs.icoStatus)){
            this.setState({
                isShowLevel: false
            });
        }
    }

    componentDidMount() {
        this._initTask(this.props.task);
        this.refreshTaskDetail = PubSub.subscribe(REFRESH_TASK_DETAIL, function (type, data) {
            let taskData={};
            if(data.type=='Delete'){
                taskData = {showId:data.T_LEVEL!=2?data.SHOW_ID:data.T_PARENT_SHOW_ID}
            }else{
                taskData = {showId:data.SHOW_ID}
            }
            this._initTask(taskData);
        }.bind(this))
        document.addEventListener('click', ::this.toggleDropdown);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.task != this.props.task) {
            if (this.state.methodType !== 'Delete') {
                this._initTask(nextProps.task);
            }
        }
        document.addEventListener('click', ::this.toggleDropdown);
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.refreshTaskDetail);
    }

    render(){

        let [toUsers,toUserNames]=this._getSendUserArray();
        //console.log(toUsers,toUserNames);
        return (
            <div className="new-meeting-box">
                <div className="meeting-box-header">
                    <span>{task.TaskDetail}</span>
                    <i className="icon-glyph-167" onClick={::this.props.onClose}></i>
                </div>

                <div className="meeting-box-body">
                    <p className="meeting-detail-title"><span className="title">{this.state.title}</span><span className="pull-right">{this.state.level}</span>
                        <span className="circle pull-right"></span></p>

                    <div className="attend-person-group">
                        <div className="task-line">
                            <div className="task-detail-title "><span>{task.Participant}</span></div>
                            <div className="task-detail-person">
                            {this.state.users&&this.state.users.length>0&&this.state.users.map(function(item,index){
                                return (
                                    <div className="chat-room-member"><AvatarComponent userName={item} trueName={this.state.userNames[index]} /></div>
                                )
                            }.bind(this))}
                            </div>
                            <div  className="task-detail-tips"  ><i className="demo-icon icon-glyph-91 default"></i>
                                <span ref="statusName" className="ordinary"  onClick={::this._showLevelList}>{this.state.statusName}</span>
                                <i ref="icoStatus" onClick={::this._showLevelList} className={classnames({"demo-icon icon-glyph-141":this.state.isShowLevel,"demo-icon icon-glyph-142":!this.state.isShowLevel,"default":true})}></i>
                                {(this._isJoiner()||this._isCreater())&&this.state.isShowLevel&&this.state.projectStatusList&&this.state.projectStatusList.length>0&&(<ul className="dropdown-list top-right" style={{right:'-15px',top:'28px'}} >
                                  {this.state.projectStatusList&&this.state.projectStatusList.length&&this.state.projectStatusList.map(function(item,index){
                                      return (<li className="dropdown-item" >
                                          <a href="javascript:void(0);" onClick={this._updateTaskStatus.bind(this,item)}>
                                              <span>{item.StatusName}</span>
                                          </a>
                                      </li>);
                                  }.bind(this))}
                                </ul>)}
                            </div>
                        </div>
                    </div>
                    <div className={this.state.detail?'attend-person-group':''}>
                        <div className="task-line">
                            <div className="task-detail-title "><span>{task.Project}</span></div>
                            <div className="task-detail-main"><span>{this.state.projectName}</span></div>
                            <div className="task-detail-tips"><span className="emergency">{this.state.endtime.length==0?"":this.state.endtime+task.End}</span></div>
                        </div>
                        {this.state.tag&&(<div className="task-line">
                            <div className="task-detail-title "><span>{task.Label}</span></div>
                            <div className="task-detail-main"><span>设计、App、日本</span></div>
                            <div className="task-detail-tips"><i className="demo-icon icon-glyph-80 default"></i><span>每周循环</span></div>
                        </div>)}
                    </div>


                {this.state.detail!=''&&this.state.detail && <div className={this.state.isAnnex==1?'attend-person-group':''} >
                        <p className="meeting-detail-topic">{this.state.detail}</p>
                    </div>}

                {this.state.isAnnex==1 &&  (<FileShowComponent appShowID={'PWP56jQLLjFEZXLe'} rmShowID={this.state.showId} ></FileShowComponent>)}

                    {this.state.isParent==1&&(<p className="new-event-choose-time task-detail-new-subtask">
                        <span className="subtask-span">{task.SubTask}</span>
                         <span onClick={::this._addTask}>
                             <span className="pull-right subtask-span">{task.NewSubTask}</span>
                            <i className="demo-icon icon-glyph-102 pull-right"></i>
                         </span>
                    </p>)}

                {this.state.isParent==1 &&this.state.children&&this.state.children.length>0&& (<div className="attend-person-group ">
                         {this.state.children.map(function(item,index){
                             return <ProjectChildTask child={item} key={index}/>
                         })}
                    </div>)}

                    <Comment
                        appShowID={"PWP56jQLLjFEZXLe"}
                        rmShowID={this.props.task.showId}
                        toUsers={toUsers}
                        toUserNames={toUserNames}
                        Title={this.state.title}
                        messageAppType={MESSAGE_APP_TYPE.TASK}
                        ></Comment>

                </div>

                <div className="meeting-detail-footer-btn">
                    <a><i className=" toolbar icon-glyph-71"></i></a>
                    {(this._isJoiner()||this._isCreater())&&(<a onClick={::this._editTask}><i className=" toolbar icon-glyph-77"></i></a>)}
                    {this._isCreater()&&(<a onClick={::this._deleteTask}><i className=" demo-icon icon-trash-empty"></i></a>)}
                </div>
            </div>
        )
    }


    //初始化任务
    _initTask(data)
    {
        //console.log('init '+data.showId+''+i++);
        getTaskDetail(data).then(res=> {
            var resData = packRespnseData(res);
            if (resData.Data)
            {
                //console.log(resData.Data);
                this.setState({
                    showId:resData.Data.SHOW_ID,
                    title:resData.Data.T_TITLE,
                    level:this._changeLevel(resData.Data.T_PRIORITY),
                    users:resData.Data.T_USERS,
                    userNames:resData.Data.T_USERS_NAME,
                    statusName:resData.Data.S_NAME,
                    project:resData.Data.P_SHOW_ID,
                    projectName:resData.Data.P_NAME,
                    endtime:resData.Data.T_END_TIME>0?moment(resData.Data.T_END_TIME).format("MM月DD日"):"",
                    detail:resData.Data.T_BACKUP,
                    isParent:resData.Data.T_LEVEL,
                    children:resData.Data.TaskChildList,
                    projectStatusList:resData.Data.TaskStatusList,
                    create_user:resData.Data.CREATE_USER,
                    create_user_name:resData.Data.CREATE_USER_NAME,
                    mainUsers:resData.Data.MAIN_TASK_USERS,
                    mainUserNames:resData.Data.MAIN_TASK_USERNAMES,
                    mainCreateUser:resData.Data.MAIN_TASK_CREATE_USER,
                    mainCreateUserName:resData.Data.MAIN_TASK_CREATE_USER_NAME,
                    isAnnex:resData.Data.T_IS_ANNEX
                });
            }
            else
            {
                alert(resData.Reason);
            }
        })
    }

    //新增子项目
    _addTask() {
        sliderShow({
            type:S.TASK_ADD,
            task:{
                parentId:this.state.showId,
                pId:this.state.project
            }
        });
    }

    //编辑项目
    _editTask() {
        sliderShow({
            type: S.TASK_ADD,
            task: {
                showId: this.state.showId,
                msgId: this.props.task.msgId || ''
            }
        });
    }

    //删除任务
    _deleteTask() {
        //console.log('delete '+this.state.showId);
        deleteTask(this.state.showId).then(res=> {
            var resData = packRespnseData(res);
            if (resData.Data) {
                this.setState({methodType: 'Delete'});
                this.props.onClose();
                let data=resData.Data;
                let refreshData={method:'Delete',...data};
                PubSub.publish(REFRESH_TASK, refreshData);
            }
            else {
                alert(resData.Reason);
            }
        })
    }

    //翻译任务等级
    _changeLevel(level)
    {
        switch(level)
        {
            case "HIGH":return task.High;
            case "MEDIUM": return task.Medium;
            case "LOW":return task.Low;
            default:return task.Unknown;
        }
    }

    //筛选下拉
    _filterLevelList(status,list){
        if(list&&list.length>0)
        {
            if(status=='WAITING')
            {
                return list;
            }
            else if(status=='FINISH'){
                return [];
            }
            else
            {
                list.shift();
                return list;
            }
        }else{
            return [];
        }
    }

    //显示隐藏下拉
    _showLevelList() {
        this.setState({isShowLevel:!this.state.isShowLevel});
    }

    //更新任务状态
    _updateTaskStatus(data,event) {
        let task = {showId: this.state.showId, statusId: data.StatusShowId}
        event.stopPropagation();
        updateTask(task, "3").then(res=> {
            var resData = packRespnseData(res);
            if (resData.Data) {
                if (this.props.task.msgId) {
                    let requestData = {
                        showId: this.state.showId
                    };
                    actionContainer.get().getChatTaskDetail(requestData, this.props.task.msgId);
                } else {
                    this.setState({statusName: data.StatusName, isShowLevel: false});
                    let res=resData.Data;
                PubSub.publish(REFRESH_TASK, {...res,method:'Update'});
                PubSub.publish(REFRESH_TASK_DETAIL, resData.Data);
            }
            }
            else {
                alert(resData.Reason);
            }
        })
    }

    //推送评论人
    _getSendUserArray()
    {
        let toUsers=[];
        let toUserNames=[];
        let currentUser=reduxContainer.get().getState().userinfo.me.loginName;
        let currentUserName=reduxContainer.get().getState().userinfo.me.name;;
        if(this._isJoiner()||this._isCreater()) {
            if(this.state.isParent==2){
                toUsers=[...this.state.users,this.state.create_user,...this.state.mainUsers,this.state.mainCreateUser];
                toUserNames=[...this.state.userNames,this.state.create_user_name,...this.state.mainUserNames,this.state.mainCreateUserName];
            }else {
                toUsers=[...this.state.users,this.state.create_user];
                toUserNames=[...this.state.userNames,this.state.create_user_name];
            }
            this._filterSelf(toUsers,currentUser);
            this._filterSelf(toUserNames,currentUserName);
        }
        return [toUsers,toUserNames];
    }

    //排除自己
    _filterSelf(array,name){
         _.remove(array,function(item){
            return item==name;
        })
    }

    //判断是否是参与人
    _isJoiner()
    {
        let currentname=reduxContainer.get().getState().userinfo.me.loginName;
        if(this.state.users.join().indexOf(currentname))
        {
            return false;
        }
        return true;
    }

    _isCreater()
    {
        let currentname=reduxContainer.get().getState().userinfo.me.loginName;
        if(this.state.create_user!=currentname)
        {
            return false;
        }
        return true;
    }

    //筛选发送人
    _filterRecevier(array,recevierArray)
    {
        recevierArray.forEach((item,index)=>{
            this._filterUsers(array,item)
        })
    }

    //筛选人员
    _filterUsers(array,chkObj)
    {
        if(typeof chkObj=='string'){
            this._filterUser(array,chkObj);
        }else if(chkObj!==null)
        {
            chkObj.forEach((item,index)=>{
                   this._filterUser(array,item)
                }
            );
        }
    }

    //筛选重复人员
    _filterUser(array,name)
    {
        let isRepeat=false;
        array.forEach(function(item,index){
            if(item==name)
            {
                isRepeat=true;
            }
        })
        if(!isRepeat) {
            array.push(name);
        }
    }
}

Object.assign(ProjectTaskDetail.prototype, React.addons.LinkedStateMixin);