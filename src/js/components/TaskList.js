/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';

import {sliderShow} from '../services/slider.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import CalendarBody from './CalendarBody.js';
import CalendarTitle from './CalendarTitle.js';
import {Link} from 'react-router';
import {getWhiteBoards,getProjectDetail} from '../services/taskService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import ProjectWhiteBoard from './ProjectWhiteBoard';
import {task} from '../i18n/index.js';

export default class CalendarArea extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            whiteBoards: [],
            projectName: '',
            showId: ''
        };
    }
    componentDidMount(){
        this._getWhiteBoards(this.props.params.pId);
        this._getProjectDetail(this.props.params.pId);
   }

  render() {
      return (
          <div className=" global-detail-area">
              <div className="calendar">
                  <div className="calendar-title clearfix attend-person-group">
                      <div className="calendar-title-detail">
                          <Link to="/application/task/ProjectManage">
                              <span className="title">{this.state.projectName}</span>
                              <i className="icon-glyph-142 icon-add"></i>
                          </Link>
                          <i className="icon-glyph-115 pull-right" onClick={this._showSearchList.bind(this,this.state.showId)}></i>
                          <span className="btn btn-default calendar-action-add pull-right" style={{display:'none'}}>
                              <i className="icon-glyph-166" ></i>
                              <span >{task.NewBoard}</span>
                          </span>
                      </div>
                  </div>
              </div>
              {this.state.whiteBoards && this.state.whiteBoards.map(function (item, index) {
                  return <ProjectWhiteBoard board={item} pId={this.props.params.pId} key={index}></ProjectWhiteBoard>;
              }.bind(this))}
          </div>
      );
  }

    //获得项目详情
  _getProjectDetail(pId) {
      getProjectDetail(pId).then(res=> {
          var resData = packRespnseData(res);
          if (resData.Data) {
              this.setState({
                  projectName: resData.Data.name,
                  showId: resData.Data.showId
              });
          } else {
              alert(resData.Reason);
          }
      })
  }


    //获得白板list
  _getWhiteBoards(data) {
      getWhiteBoards(data).then(res=> {
          var resData = packRespnseData(res);
          if (resData.Data) {
              this.setState({whiteBoards: resData.Data});
          }
          else {
              alert(resData.Reason);
          }
      })
  }

    //查询数据
    _showSearchList(data) {
        sliderShow({
            type: S.TASK_SEARCH,
            task: {
                type: 1,
                projectId: data
            }
        });
    }
}



