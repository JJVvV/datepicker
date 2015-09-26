/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import {Link} from 'react-router';
import ProjectBoardHead from './ProjectBoardHead.js';
import ProjectBoardBody from './ProjectBoardBody.js';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

export default class ProjectWhiteBoard extends React.Component{

    constructor(props){
        super(props);
    }

    render(){

        return (
            <div className="task-area" style={{height:'100%'}}>
                <ProjectBoardHead board={this.props.board} pId={this.props.pId}></ProjectBoardHead>
                <ProjectBoardBody board={this.props.board}></ProjectBoardBody>
            </div>
        );
}

}
 export default DragDropContext(HTML5Backend)(ProjectWhiteBoard);


