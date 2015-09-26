/**
 * Created by Administrator on 2015/7/10.
 */

import React from 'react';
import LoginForm from '../LoginForm.js';
import RouterContainer from '../../services/routerContainer.js';
import {Navigation} from 'react-router';
export default class Login{
  render(){

    return (
      <section className="wrapper">
        <div className="wrapper-inner">
          <LoginForm onLogin={::this.onLogin} />
        </div>
      </section>
    );
  }

  onLogin(username, password){
    this.props.action.login(username, password);
  }
}