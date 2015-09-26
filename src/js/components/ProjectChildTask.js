/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S,REFRESH_TASK,REFRESH_TASK_DETAIL} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import {Link} from 'react-router';
import moment from 'moment';
import {getTaskDetail,deleteTask,updateTask} from '../services/taskService.js';
import AvatarComponent from './AvatarComponent.js';
import {task} from '../i18n/index.js';

export default class ProjectChildTask extends React.Component{

    constructor(props){
        super(props);
        this.state={
            isEdit:false
        }
    }

    toggleDropdown(e){
        if(e.target !== React.findDOMNode(this.refs.arrow)){
            this.setState({
                isEdit: false
            });
        }
    }
    componentDidMount(){
        document.addEventListener('click', ::this.toggleDropdown);

    }

    componentWillUnmount(){
        document.removeEventListener('click', ::this.toggleDropdown);

    }

    render(){
        return (
            <div className="subtask-group">
                <div className="subtask-member pull-left">
                    <div className={classnames({"chat-room-member":true,"emergency-line":this.props.child.proiority=="HIGH","important-line":this.props.child.proiority=="MEDIUM"})}>
                        <AvatarComponent userName={this.props.child.img} />
                    </div>
                </div>
                <div className="subtask-detail">
                    <div className="subtask-detail-line"><span>{this.props.child.title}</span></div>
                    <div className="subtask-detail-line"><i className="demo-icon icon-glyph-91 default"></i><span className="default">{this.props.child.status}</span>
                        {this.props.child.T_IS_ANNEX==1&&(<i className="demo-icon icon-glyph-118 default"></i>)}

                    </div>
                </div>
                <div className="subtask-tips pull-right">
                    <i ref="arrow" className={classnames({"demo-icon icon-glyph-142":!this.state.isEdit,"demo-icon icon-glyph-141":this.state.isEdit})}  onClick={::this._showEdit}></i>
                    {this.state.isEdit&&(<ul className="dropdown-list top-right right" style={{top:'50px'}} >
                        <li className="dropdown-item">
                            <a href="javascript:void(0);" onClick={this._updateTask.bind(this,this.props.child.showId)}>
                                <span>{task.EditSubTask}</span>
                            </a>
                        </li>
                        <li className="dropdown-item">
                            <a href="javascript:void(0);" onClick={this._deleteTask.bind(this,this.props.child.showId)}>
                                <span>{task.DeleteSubTask}</span>
                            </a>
                        </li>
                        <li className="dropdown-item">
                            <a href="javascript:void(0);" onClick={this._changeToTask.bind(this,this.props.child.showId)}>
                                <span>{task.ChangeTask}</span>
                            </a>
                        </li>
                    </ul>)}
                </div>
            </div>
        );
    }

    _showEdit() {
        this.setState({
            isEdit:!this.state.isEdit
        })
    }

    //编辑任务
    _updateTask(data){
        sliderShow({
            type:S.TASK_ADD,
            task:{
                showId:data
            }
        });
    }

    //转为任务
    _changeToTask(data){
        let task={showId:data};
        updateTask(task,'1').then(res=>{
            var resData=packRespnseData(res);
            if(resData.Data)
            {
                PubSub.publish(REFRESH_TASK, resData.Data);
                PubSub.publish(REFRESH_TASK_DETAIL, resData.Data)
            }
            else
            {
                alert(resData.Reason);
            }
        })
    }

    //删除任务
    _deleteTask(data){
        deleteTask(data).then(res=>{
            var resData=packRespnseData(res);
            if(resData.Data)
            {
                let res=resData.Data;
                PubSub.publish(REFRESH_TASK, resData.Data);
                PubSub.publish(REFRESH_TASK_DETAIL, {...res,type:'Delete'})
            }
            else
            {
                alert(resData.Reason);
            }
        })
    }


}



