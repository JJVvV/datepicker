/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react/addons.js';
import {Link} from 'react-router';

//import shallowEqualScalar from 'redux/lib/utils/shallowEqualScalar'

export default class LoginForm extends React.Component{

  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  render(){
    //const {article} = this.props;

    return (
      <form action="/url" method="post" className="form form-horizontal">
        <div className="form-group">
          <label htmlFor="username" className="control-label col-3">姓名</label>

          <div className="col-9">
            <input id="username" valueLink={this.linkState('username')} type="text" required className="form-control"/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="control-label col-3">密码</label>
          <div className="col-9">
            <input id="password" valueLink={this.linkState('password')} type="password" required className="form-control"/>
          </div>
        </div>

        <div className="form-group col-offset-3">
          <div className="col-9">
            <button className="btn btn-primary" onClick={::this.onLogin}>提交</button>
          </div>
        </div>
      </form>
    );
  }

  onLogin(e){
    e.preventDefault();
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    if(username.length === 0 || password.length == 0){
      alert('username or password can\'t be empty');
      return;
    }
    this.props.onLogin(username, password);
  }

}

Object.assign(LoginForm.prototype, React.addons.LinkedStateMixin);



