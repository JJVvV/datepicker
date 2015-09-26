/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import NavItem from './NavItem.js'
import Logo from './Logo.js'


const list = [
  {link:'admin/login', text: '登录'},
  {link:'index', text: '博客'}
];

export default class Header extends React.Component {

  render(){
    return(
      <header className="site-header">
        {this.renderLogo()}

        {::this.renderNav()}
      </header>
    );

  }

  renderLogo(){
    return (
      <Logo />
    );
  }

  renderNav(){
    var navList = list.map((item, i) => {
      if(item.link == 'admin/login' && this.props.isLogin){
        return <a key={i} className="nav-item" href="javascript:;"  onClick={::this.logout}>logout</a>

      }
      return <NavItem key={i} {...item} />
    });

    return (
      <nav className="nav">
        {navList}
      </nav>
    );
  }

  logout(e){
    e.preventDefault();
    this.props.action.logout();
  }
}