/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S,REFRESH_TASK} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import {Link} from 'react-router';
import ProjectTask from './ProjectTask.js';
import {getTaskList,getUnReadMessageList} from '../services/taskService.js';
import {toTreeData} from '../services/sectionPeopleTree.js';
import $ from 'jquery';
import { ItemTypes } from './ItemTypes.js';
import { DropTarget } from 'react-dnd';

import {Scrollbars} from './scrollbar';
const dropTask = {
    drop(props, monitor, component) {
        return{
            id:props.board.showId,
            statusId:props.board.showId
        }

    }
}
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    }
}

 class ProjectBoardBody extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            initialTaskList:[],
            pageIndex:1,
            taskList:[],
            comment:this._Comment(),
            isload:true
        }
    }
    componentDidMount() {
        this._getTaskList(this.props);
        this.refreshTask = PubSub.subscribe(REFRESH_TASK, function (type, data) {
            //this._refreshData(data);
            this.setState({pageIndex:1,isload:true});
            this._getTaskList(this.props);
        }.bind(this));

    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.refreshTask);
    }

    render(){
        const { connectDropTarget, isOver,canDrop } = this.props;

        return connectDropTarget(
            <div>
                <Scrollbars style={{height:this._scrollHeight()}} onScroll={::this._scrollLoad} >
                <div className="task-area-wrapper" >
                    <div ref="childDiv">
                    {this.state.taskList&&this.state.taskList.map(function(item,index){
                        return (<ProjectTask task={item}  key={item.taskId} talk={this.state.comment}></ProjectTask>);
                    }.bind(this))}
                    </div>
                </div>
                </Scrollbars>
            </div>
        );
    }

    //查找评论
    _Comment() {
        getUnReadMessageList().then(res=> {
            var resData = packRespnseData(res);
            if (resData.Data){
                this.setState({comment:resData.Data});
            }else{
                alert(resData.Reason);
            }
        })
    }

    //获取任务列表
    _getTaskList(data) {
        var taskData={statusId:data.board.showId,pageIndex:1}
        getTaskList(taskData).then(res=>{
            var resData=packRespnseData(res);
            if(resData.Data)
            {
               this.setState({
                   initialTaskList:resData.Data,
                   taskList:toTreeData(resData.Data.slice(),'taskId', 'parentTaskId' )
               });
            }
            else
            {
                alert(resData.Reason);
            }
        });
    }

    //滚动加载
    _scrollLoad(e) {
        let boardDiv=e.target;
        let child=React.findDOMNode(this.refs.childDiv);
        console.log(boardDiv.offsetHeight,boardDiv.scrollTop,child.scrollHeight)
        let marginHeight=150;
        if(boardDiv.offsetHeight+boardDiv.scrollTop+marginHeight>child.scrollHeight) {
            if(this.state.isload){
                let data={statusId:this.props.board.showId,pageIndex:this.state.pageIndex+1};
                getTaskList(data).then(res=>{
                    var resData=packRespnseData(res);
                    if(resData.Data.length>0) {
                        this.setState({
                            initialTaskList:this.state.initialTaskList.concat(resData.Data),
                            taskList:this.state.taskList.concat(toTreeData(resData.Data.slice(),'taskId', 'parentTaskId')),
                            pageIndex:data.pageIndex
                        });
                    } else if(resData.Data.length==0) {
                        this.setState({
                            isload:false
                        });
                    } else {
                        alert(resData.Reason);
                    }
                });
            }else{
                //已无更多
            }
        }
    }

    //刷新数据
    _refreshData(data) {
        switch(data.method)
        {
            case 'Add':this._addTask(this.state.initialTaskList,data);break;
            case 'Update':this._updateTask(this.state.initialTaskList,data);break;
            case 'Delete':this._removeTask(this.state.initialTaskList,data);break;
        }
    }

    //新增任务
    _addTask(array,data){
        let newTask={
            allTask:data.ALLTASK,
            endTime:data.T_END_TIME,
            finishedTask:data.FINISHTASK,
            image:"",
            isAnnex:data.T_IS_ANNEX,
            level:data.T_LEVEL,
            parentTaskId:data.T_PARENT_SHOW_ID,
            priority:data.T_PRIORITY,
            projectId:data.P_SHOW_ID,
            projectName:data.P_NAME,
            statusId:data.S_SHOW_ID,
            statusName:data.S_NAME,
            statustype:this._changeStateType(data.S_TYPE) ,
            taskId:data.SHOW_ID,
            title:data.T_TITLE
        }

        let parentIndex=this._findFatherTask(array,function(item){
            return item.parentTaskId==newTask.parentTaskId;
        });

        if(newTask.parentTaskId!=''&&parentIndex>=0){
            array.unshift(newTask);
            if(newTask.statustype=='Finish'){
                array[parentIndex].finishedTask=array[parentIndex].finishedTask+1;
            }
            array[parentIndex].allTask=array[parentIndex].allTask+1;
        }else if(this.props.board.showId==newTask.statusId){
            array.unshift(newTask);
        }

        this.setState({
            initialTaskList:array,
            taskList:toTreeData(array.slice(),'taskId', 'parentTaskId')
        })

    }

    //更新任务
    _updateTask(array,data){
        _.remove(array,item=>(
        item.taskId==data.SHOW_ID
        ));
        let newTask={
            allTask:data.ALLTASK,
            endTime:data.T_END_TIME,
            finishedTask:data.FINISHTASK,
            image:"",
            isAnnex:data.T_IS_ANNEX,
            level:data.T_LEVEL,
            parentTaskId:data.T_PARENT_SHOW_ID,
            priority:data.T_PRIORITY,
            projectId:data.P_SHOW_ID,
            projectName:data.P_NAME,
            statusId:data.S_SHOW_ID,
            statusName:data.S_NAME,
            statustype:this._changeStateType(data.S_TYPE),
            taskId:data.SHOW_ID,
            title:data.T_TITLE
        }

        this.props.board.showId==newTask.statusId&&array.unshift(newTask);

        this.setState({
            initialTaskList:array,
            taskList:toTreeData(array.slice(),'taskId', 'parentTaskId')
        })
    }

    //移除任务
    _removeTask(array,data){
        _.remove(array,item=>(
             item.taskId==data.SHOW_ID
        ));
        this.setState({
            initialTaskList:array,
            taskList:toTreeData(array.slice(),'taskId', 'parentTaskId')
        });
    }

    //找父节点索引
    _findFatherTask(array,taskId){
       return  _.findIndex(array,function(item){
            return item.taskId=taskId;
        })
    }

    //转化状态类型
    _changeStateType(type){
        switch(type){
            case 'FINISH':return 'Finish';
            case 'WAITING':return 'Waiting';
            case  'IN_PROGRESS':return 'In_Progress'
        }
    }

     _scrollHeight(){
         oHeight=$(document.body).height()-113;

         return oHeight;
     }
}
    ProjectTask.propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        id:PropTypes.any.isRequired
    };

export default DropTarget(ItemTypes.ProjectTask, dropTask, collect)(ProjectBoardBody);


