/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react/addons.js';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux'
import PubSub from 'pubsub-js';
import * as launchrAction from '../actions';
import GlobalPanel from './GlobalPanel.js'
import actionContainer from '../services/actionContainer.js';
//const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import Slider from './Slider.js';
import EventDetail from './EventDetail.js';
import getSliderContent from '../services/sliderContent.js';
import {FadeModal as Modal} from './boron/Boron.js';

import TreeForLaunchr from './tree/TreeForLaunchr.js';

import $ from 'jquery';

import {CHANGE_SLIDER, S, SHOW_SECTION_TREE} from '../constants/launchr.js';
import loading from '../components/loading/Loading.js';
//import i18n from '../i18n';
//console.log(i18n);

@connect((state, prop) => ({
  chatData: state.chat,
  transitionKey: prop.location.pathname
}))



export default class Application extends React.Component{

  constructor(props, context){
    super(props, context);
    this.state = {
      child: ''
    }

  }
  componentWillMount(){
    const { dispatch, chatData, children} = this.props;
    const actions = bindActionCreators(launchrAction, dispatch);
    actionContainer.set(actions);
    //actions.getCurrentUserInfo()
    actions.getCurrentUserInfo().then(res=>{
      actions.loadThreadAppList().then(res=>actions.loadAppLastMsg()).then(res=>actions.loadAppPush());
      actions.loadThreadChatList().then(res=>actions.loadLongPoll());
    });
    //actions.getCurrentUserInfo().then(res=>actions.loadThreadList())
  }
  componentDidMount(){
    var slider = this.refs.slider;
    this.unbindChangeSlide = PubSub.subscribe(CHANGE_SLIDER, ::this.changeSlide);
    //this.unbindToggleSectionTree = PubSub.subscribe(SHOW_SECTION_TREE, ::this.showSectionTree);
    //actionContainer.get().loadThreadList().then((aa) => {
    //
    //});



  }
  componentWillUnMount(){
    PubSub.unsubscribe(this.unbindChangeSlide);
    //PubSub.unsubscribe(this.unbindToggleSectionTree);
  }
  changeSlide(eventName, data){
    this.setState({
      child: data
    });
  }

  showSectionTree(){
    this.refs.modal.show();
  }
  hideSectionTree(){
    this.refs.modal.hide();
  }


  onChange1(timer){
    //console.log(timer);
  }

  render(){
    const { dispatch, chatData, children} = this.props;
    const actions = bindActionCreators(launchrAction, dispatch);
    let sideChild = this.getChild(this.state.child);

    actionContainer.set(actions);


    return (
      <div className="container">
          <GlobalPanel chatData={chatData}/>

          {React.cloneElement(
            children,
            {
              action: actions,
              chatData
            }
          )}
        <Slider ref="slider" onCloseStart={::this.closeSliderStart} onCloseEnd={::this.closeSliderEnd}>{sideChild}</Slider>
        <Modal ref="modal">

          <div className="choose-people-box clearfix" style={{boxShadow: 'none'}}>
            <div className="half-box">
              <div className="form-feedback left input-whole-width">
                <input type="search" className="form-c" placeholder="搜索" />
                <span className="feedback  demo-icon icon-glyph-115"></span>
              </div>

              <div className="approval-handle-title clearfix">
                <div className="choose-people-title-item ">
                  <span>按姓名</span>
                </div>
                <div className="choose-people-title-item active">
                  <span>按部门</span>
                </div>
              </div>
              <TreeForLaunchr />



            </div>
            <div className="half-box">
              <div className="meeting-box-body">
                <div className="attend-person-group select-num-title">
                  <span>已选2个联系人</span>
                  <i className="demo-icon icon-glyph-167 pull-right"></i>
                </div>
                <div className="person-group">
                  <img src="./public/img/jinmuyan.jpg" alt="" width="30" height="30" />
                  <div className="person-group-detail">
                    <span>Bennet Wang</span>
                    <p className="team-name">Zeus</p>
                    <i className="demo-icon icon-glyph-194"></i>
                  </div>
                </div>
                <div className="person-group">
                  <img src="./public/img/jinmuyan.jpg" alt="" width="30" height="30" />
                  <div className="person-group-detail">
                    <span>Bennet Wang</span>
                    <p className="team-name">Zeus</p>
                    <i className="demo-icon icon-glyph-194"></i>
                  </div>
                </div>
                <div className="person-group">
                  <img src="./public/img/jinmuyan.jpg" alt="" width="30" height="30" />
                  <div className="person-group-detail">
                    <span>Bennet Wang</span>
                    <p className="team-name">Zeus</p>
                    <i className="demo-icon icon-glyph-194"></i>
                  </div>
                </div>
              </div>
              <div className="meeting-box-footer">
                <span className="btn-comfirm">确认</span>
                <span className="btn-cancle">取消</span>
              </div>
            </div>
          </div>

        </Modal>
      </div>
    );
  }

  closeSliderStart(){
    console.log('close start');
  }

  closeSliderEnd(){
    console.log('closed');
  }

  getChild(data){ //通过data 将数据传入子元素进行初始化
    return getSliderContent(data);
  }
}
