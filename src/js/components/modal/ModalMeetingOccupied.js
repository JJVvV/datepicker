/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import {FadeModal as Modal} from './boron/Boron.js';





export default class Bubble {



  showModal(){
    this.refs.modal.show();
  }
  hideModal(){
    this.refs.modal.hide();
  }
  render() {
    return (
        <div>

          <Modal ref="modal">
            <div className="calendar-reason-box">
              <div className="reason-header">
                <span>8月5日（周二）9:00~11:00</span>
                <span className="icon-glyph-167 pull-right "></span>
              </div>
              <div className="reason-body">
                <div className="reason-group ">
                  <div className="reason-avator">
                    <img src="./public/img/zhangqiuyan.jpg" alt="" className="chat-message-avator" width="40" height="40" />
                  </div>
                  <div className="reason-info">
                    <div className="reason-info-line">
                      <span style="font-size: 14px;">Jerry Luo</span>
                    </div>
                    <div className="reason-info-line ">
                      <div className="circle"></div>
                      <span>设计会议</span>
                    </div>
                    <div className="reason-info-line ">
                      <i className="icon-glyph-101 icon"></i>
                      <span>9:00~12:00</span>
                      <i className=" toolbar icon-glyph-207 icon"></i>
                      <span>303大会议室</span>
                    </div>
                  </div>
                </div>
                <div className="reason-group ">
                  <div className="reason-avator">
                    <img src="./public/img/zhangqiuyan.jpg" alt="" className="chat-message-avator" width="40" height="40" />
                  </div>
                  <div className="reason-info">
                    <div className="reason-info-line">
                      <span>Jerry Luo</span>
                    </div>
                    <div className="reason-info-line ">
                      <div className="circle"></div>
                      <span>设计会议</span>
                    </div>
                    <div className="reason-info-line ">
                      <i className="icon-glyph-101 icon"></i>
                      <span>9:00~12:00</span>
                      <i className=" toolbar icon-glyph-207 icon"></i>
                      <span>303大会议室</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Modal>
        </div>
    );
  }

}