/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import SocialItem from './SocialItem.js'
import Logo from './Logo.js'

const list = [
  {link:'#', text: 'facebook'},
  {link:'#', text: 'twitter'},
  {link:'#', text: 'google+'},
  {link:'#', text: 'weibo'}
];

export default class Footer extends React.Component {

  render(){
    return (
      <footer className="site-footer">
        <div className="footer-wrapper">
          <div className="footer-inner">
            {this.renderLogo()}
            {this.renderSocial()}
          </div>

        </div>

      </footer>
    );

  }

  renderLogo(){
    return (
      <Logo />
    );
  }

  renderSocial(){
    var socialList = list.map((item, i) => {
      return <SocialItem key={i} {...item} />
    });

    return (
      <div className="social">
        <ul className="social-items">
          {socialList}

        </ul>

      </div>
    );
  }
}