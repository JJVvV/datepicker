/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import actionContainer from '../services/actionContainer.js';
//import shallowEqualScalar from 'redux/lib/utils/shallowEqualScalar'

export default class GlobalPanel extends React.Component{
  //componentWillMount(){
  //  const {params} = this.props;
  //  this.props.action.loadArticle(params.id);
  //}
  //
  //componentDidUpdate(preProps){
  //  this.getDetail(preProps);
  //}
  //
  //getDetail(preProps){
  //  const {params} = this.props;
  //  const preParams = preProps.params;
  //  if(!shallowEqualScalar(params, preParams)){
  //    this.props.action.loadArticle(params.id);
  //  }
  //}

  _linkClick(){
      let action = actionContainer.get();
      action.changeThread("", "");
  }
 _exitClick(){
    window.location.href="/redux-launchr/login.html";
 }
  render(){
    //const {article, user} = this.props.blog;
      let  count=0;
      this.props.chatData.threadList.map(function(item,index){
          item.count>0?count=count+item.count:'';
      });

    return (
        <div className="global-panel">
          <div className="global-panel-logo"><img src="/redux-launchr/public/img/launchr-logo.png" width="100%" /></div>
          <Link to="chat" className="global-panel-item icon-chat"><i className="circle-tip">{count>0?count:''}</i></Link>
          <Link to="address" className="global-panel-item icon-contacts" onClick={this._linkClick}></Link>
          <Link to="/application" className="global-panel-item icon-app" onClick={this._linkClick}></Link>
          <span className="global-panel-exit" onClick={this._exitClick}>退出</span>
        </div>
    );
  }
}



