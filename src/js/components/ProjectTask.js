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
import {getUnReadMessageList,updateTask} from '../services/taskService.js';
import { ItemTypes } from './ItemTypes.js';
import { DragSource, DropTarget } from 'react-dnd';
import actionContainer from '../services/actionContainer.js';
import AvatarComponent from './AvatarComponent.js';

const taskTarget  = {
    canDrop() {
        return true;
    },
    drop(props,monitor,component){

            const { id: draggedId } = monitor.getItem();
            const { id: overId } = props.task;
            const {statusId: adraggedId} = monitor.getItem();
            const {statusId: aoverId} = props.task;

            if(draggedId==overId){
                return;
            }
            if(adraggedId==aoverId){
                let data={showId:draggedId,parentId:overId}
                updateTask(data,2).then(res=>{
                var resData = packRespnseData(res);
                if(resData.Data){
                   let res=resData.Data;
                   PubSub.publish(REFRESH_TASK, {...res,method:'Update'});
                   PubSub.publish(REFRESH_TASK_DETAIL, resData.Data);
                }else{
                   alert(resData.Reason);
                }
            })
            //component._updateTaskStatus(draggedId,'',overId);


                return;}
            else{
                return;
        }


    }
}
const knightSource = {
    beginDrag(props) {
        return {
            id: props.task.id,
            statusId:props.task.statusId
        }

    },
    endDrag(props,monitor,component){
        const item = monitor.getItem();
        const trueDrap=monitor.getDropResult();
        const didDrop = monitor.didDrop();
       if(didDrop){
           if(item.statusId==trueDrap.id){
               return;
           }else{
               component._updateTaskStatus(item.id,trueDrap.id);
           }

        }
    }
};
@DropTarget(ItemTypes.ProjectTask, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))
@DragSource(ItemTypes.ProjectTask, knightSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default  class ProjectTask extends React.Component{
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        oid: PropTypes.any.isRequired
    };

    constructor(props){
        super(props);
        this.state={
            isShowChild:false
        }
      
    }

    componentDidMount(){

    }

    render(){
        const { connectDragSource,connectDropTarget } = this.props;

        return connectDragSource(connectDropTarget(
            <div>{this._showTask(this.props)}</div>
            )
        );
    }

    //渲染任务
    _showTask(data) {
        let isFlag=this.state.isShowChild&&data.task.children&&data.task.children.length>0;
           return (<div className={classnames({"task-box":true,"emergency-line":data.task.priority=="HIGH","important-line":data.task.priority=="MEDIUM"})} onClick={this._editTask.bind(this,data.task.taskId)}>
                <div className="task-box-innerbox">
                    <div className="subtask-member pull-left">
                        <div className="chat-room-member-small">
                            <AvatarComponent userName={data.task.img} />
                        </div>
                    </div>
                    <div className="subtask-detail">
                        <div className="subtask-detail-line">{data.task.statustype=="Finish"?<s>{data.task.title}</s>: <span>{data.task.title}</span>}</div>
                        <div className="meeting-detail-line subtask-detail-line">
                            {data.task.endTime>0&&<div className="line-detail-group">
                                <i className="demo-icon icon-glyph-101"></i>
                                <span className={classnames({"important":this._importantEndTime(data)})}>{moment(data.task.endTime).format("MM月DD日")}</span>
                            </div>}
                            {this._isHasComment(data.task.taskId)>0&&(<div className="line-detail-group">
                                <i className={classnames({"approval-item-comment":true,"icon-glyph-29":true,"comment-tip":this._isHasUnReadComment(data.task.taskId)==1})}></i>
                            </div>)}
                            {data.task.isAnnex>0&&(<div className="line-detail-group">
                                <i className="demo-icon icon-glyph-118"></i>
                            </div>)}
                            {data.task.children.length>0&&(<div className="line-detail-group pull-right" onClick={::this._controlChild}>
                                <i className="demo-icon icon-glyph-83"></i>
                                <span>{data.task.finishedTask}/{data.task.allTask}</span>
                            </div>)}
                        </div>
                    </div>
                </div>
               {isFlag&&data.task.children.map(function(item,index){
                   return (<div className="subtask-box-line clearfix" onClick={this._editTask.bind(this,item.taskId)}>
                       <div className={classnames({"avator clearfix":true,"emergency-line-thin":item.priority=="HIGH","important-line-thin":item.priority=="MEDIUM"})} >
                           <AvatarComponent userName={data.task.img} />
                       </div>
                        {item.statustype=="Finish"?<s className="subtask-item-detail">{item.title}</s>:<span className="subtask-item-detail">{item.title}</span>}
                       <span className="pull-right">{item.statusName}</span>
                   </div>)
               }.bind(this))}
            </div>);
    }

    //控制显示子任务
    _controlChild(event) {
        event.stopPropagation();
        this.setState({isShowChild:!this.state.isShowChild});
    }

    //任务详情
    _editTask(data,event) {
        event.stopPropagation();
        sliderShow({
            type:S.TASK_DETAIL,
            task:{
                showId:data
            }
        });
    }

    //是否有未读评论
    _isHasUnReadComment(taskId){
        let ret=0;
        this.props.talk&&this.props.talk.forEach((item)=>{
            if(item.rmShowID==taskId&&item.readStatus==0){
                ret=1;//未读
                return;
            }
        })
        return ret;//没有评论
    }

    //是否有评论
    _isHasComment(taskId){
        let ret=0
        this.props.talk&&this.props.talk.forEach((item)=>{
            if(item.rmShowID==taskId){
                ret=1;//未读
                return;
            }
        })
        return ret;
    }

    //是否快到截止日期
    _importantEndTime(data) {
        if(data.task.statustype!='Finish') {
            let nowDate = new Date().getTime();
            if (data.task.endTime > 0 && nowDate >= data.task.endTime) {
                return true;
            }
            else{
                return false;
            }
        }
        else {
            return false;
        }
    }

    //更新任务状态
    _updateTaskStatus(showId,statusId) {
        let task = {showId:showId, statusId:statusId}
        updateTask(task, 3).then(res=> {
            var resData = packRespnseData(res);
            if (resData.Data) {
                if (this.props.task.msgId) {
                    let requestData = {
                        showId: this.state.showId
                    };
                    actionContainer.get().getChatTaskDetail(requestData, this.props.task.msgId);
                } else {
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
}



