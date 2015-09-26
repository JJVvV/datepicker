/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
//import {getShowModule} from '../services/taskProjectService.js';
//import ProjectManage from './ProjectManage.js';
//import TaskDetail from './TaskDetail.js';

export default class TaskArea extends React.Component{
    constructor(){
        super();
    }

    render() {
        return (
            //<div className="approval-area global-detail-area">

            <div style={{height:"100%"}}>
            {this.props.children}</div>
            //</div>
        );
    }

    //showModule()
    //{
    //    return <ProjectManage></ProjectManage>
    //}
}



