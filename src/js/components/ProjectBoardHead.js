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

export default class ProjectBoardHead extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>{this._showBoardTitle(this.props)}</div>
        );
    }

    _showBoardTitle(data) {
        switch(data.board.type)
        {
            case 'Wating':return (<div className="task-area-header">
                <span>{data.board.name}</span>
              <i className="icon-glyph-166 pull-right" onClick={::this._addTask}></i>
            </div>);
            case 'Finish': return (<div className="task-area-header task-finish-header">
                <span>{data.board.name}</span>
            </div>);
            default: return (<div className="task-area-header">
                <span>{data.board.name}</span>
                <i className="icon-glyph-167 pull-right" ></i>
            </div>);
        }
    }

    _addTask()
    {
        sliderShow({
            type:S.TASK_ADD,
            task:{
                pId:this.props.pId
            }
        });
    }

}



