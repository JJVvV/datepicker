/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';

import CalendarBody from './CalendarBody.js';
import CalendarTitle from './CalendarTitle.js';

export default class CalendarArea extends React.Component{

  componentDidMount(){
  }


  render() {
      return (
          <div className="calendar">
              <div className="calendar-title clearfix attend-person-group">
                  <div className="calendar-title-detail">
                      <span className="title">Launchr</span>
                      <i className="icon-glyph-142 icon-add"></i>
                      <i className="icon-glyph-115 pull-right" ></i>
                          <button className="btn btn-default">
                              <i className="icon-glyph-166 "></i>
                              <span className="btn-text">新增标签</span>
                          </button>
                  </div>
              </div>
              <div className="task-area" style={{height:'842px'}}>
                  <div className="task-area-header">
                      <span>待办</span>
                      <i className="icon-glyph-166 pull-right" ></i>
                  </div>
                  <div className="task-area-wrapper">
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><s>Lotus希望看到设计任务持续推进</s></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group important">
                                          <i className="demo-icon icon-glyph-101 important"></i>
                                          <span className="important">8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="task-box important-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group pull-right">
                                          <i className="demo-icon icon-glyph-83"></i>
                                          <span>0/3</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-101"></i>
                                          <span>8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <span>需求文档整理</span>
                              <span className="pull-right">完成</span>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <span>需求文档整理</span>
                              <span className="pull-right">进行中</span>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <s>需求文档整理</s>
                              <span className="pull-right">待办</span>
                          </div>
                      </div>
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-101"></i>
                                          <span>8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="task-area" style={{height:'842px'}}>
                  <div className="task-area-header">
                      <span>进行中</span>
                      <i className="icon-glyph-167 pull-right" ></i>
                  </div>
                  <div className="task-area-wrapper">
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group important">
                                          <i className="demo-icon icon-glyph-101 important"></i>
                                          <span className="important">8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="task-box important-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group pull-right">
                                          <i className="demo-icon icon-glyph-83"></i>
                                          <span>0/3</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-101"></i>
                                          <span>8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <span>需求文档整理</span>
                              <span className="pull-right">完成</span>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <span>需求文档整理</span>
                              <span className="pull-right">进行中</span>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <s>需求文档整理</s>
                              <span className="pull-right">待办</span>
                          </div>
                      </div>
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-101"></i>
                                          <span>8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="task-area" style={{height:'842px'}}>
                  <div className="task-area-header task-finish-header">
                      <span>完成</span>
                  </div>
                  <div className="task-area-wrapper">
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group important">
                                          <i className="demo-icon icon-glyph-101 important"></i>
                                          <span className="important">8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="task-box important-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group pull-right">
                                          <i className="demo-icon icon-glyph-83"></i>
                                          <span>0/3</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-101"></i>
                                          <span>8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <span>需求文档整理</span>
                              <span className="pull-right">完成</span>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <span>需求文档整理</span>
                              <span className="pull-right">进行中</span>
                          </div>
                          <div className="subtask-box-line">
                              <div className="avator clearfix important-line-thin">
                                  <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="20" height="20"/>
                              </div>
                              <s>需求文档整理</s>
                              <span className="pull-right">待办</span>
                          </div>
                      </div>
                      <div className="task-box emergency-line">
                          <div className="task-box-innerbox">
                              <div className="subtask-member pull-left">
                                  <div className="chat-room-member-small">
                                      <img src="/redux-launchr/public/img/zhangqiuyan.jpg" alt="" width="40" height="40"/>
                                  </div>
                              </div>
                              <div className="subtask-detail">
                                  <div className="subtask-detail-line"><span>Lotus希望看到设计任务持续推进</span></div>
                                  <div className="meeting-detail-line subtask-detail-line">
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-101"></i>
                                          <span>8月16日</span>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="approval-item-comment icon-glyph-29 comment-tip"></i>
                                      </div>
                                      <div className="line-detail-group">
                                          <i className="demo-icon icon-glyph-118"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}



