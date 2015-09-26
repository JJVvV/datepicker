/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react';
import { Redirect, Router, Route , Navigation, TransitionHook } from 'react-router';
import { Provider } from 'react-redux';
import PubSub from 'pubsub-js';
import RouterContainer from '../services/routerContainer.js';
import {SLIDER_ACTIVE,SLIDER_ON_CLOSE, SLIDER_CLOSE} from '../constants/launchr.js';

import Application from '../components/Application.js'



import Login from '../components/pages/login.js'
import ChatPage from '../components/pages/chat.js'
import AddressPage from '../components/pages/address.js'
import ApplicationPage from '../components/pages/application.js'
import reducers from '../reducers';
import CalendarArea from '../components/CalendarArea.js';
import ApprovalArea from '../components/ApprovalArea.js';
import TreeTest from '../components/pages/TreeTest.js';
import TaskArea from '../components/TaskArea.js';
import TaskList from '../components/TaskList.js';
import ProjectManage from '../components/ProjectManage.js';

import ReduxContainer from '../services/reduxContainer.js';
import after from '../common/after.js';

import configStore from '../store/configureStore.js';

const store = configStore();

ReduxContainer.set(store);


export default class Root {
  render(){
    const {history} = this.props;

    return(
      <Provider store={store}>
        {renderRoutes.bind(null, history)}
      </Provider>
    );
  }
}
  //<Route name="detail" path="detail/:id" component={Detail} onEnter={setLoading}></Route>
  //<Route name="post" path="admin/post/:id" component={Post} onEnter={onNotLogined.after(setLoading)}></Route>
  //<Route name="post" path="admin/login" component={Login} onEnter={onLogined}></Route>
  function renderRoutes (history) {
    return (
      <Router history={history} onUpdate={hideSlider}>
        <Route component={Application}>
          <Route path="chat" component={ChatPage}  />
          <Route path="tree" component={TreeTest}  />
          <Route path="address" component={AddressPage}  />
          <Route path="application" component={ApplicationPage}>
            <Route path="approval" component={ApprovalArea} />
            <Route path="calendar" component={CalendarArea} />
            <Route path="task" component={TaskArea}>
              <Route path="ProjectManage" component={ProjectManage} />
              <Route path="taskList/:pId" component={TaskList} />
            </Route>
          </Route>
          <Redirect from="/" to="/chat" />
          <Redirect from="/calendar" to="/application/calendar" />
          <Redirect from="/approval" to="/application/approval" />
          <Redirect from="/task" to="/application/task" />
          <Redirect from="/application/task" to="/application/task/ProjectManage" />
        </Route>
      </Router>
    )
  }

function hideSlider(){
  PubSub.publish(SLIDER_CLOSE, {});
}

function onNotLogined(nextState, transition){

  const state = redux.getState();
  if(!state.article.user.isLogin){
    transition.to('/admin/login');
    return false;
  }
  return true;
}


function onLogined(nextState, transition){

  const state = redux.getState();
  if(state.article.user.isLogin){
    transition.to('/index');
  }
  return true;
}

function setLoading(nextState, transition){
  //redux.getState().article.loading = true;
}



var jwt = localStorage.getItem('jwt');
if(jwt){
  //redux.getState().article.user.jwt = jwt;
  redux.dispatch({type:'USER', user:{jwt:jwt}});
}