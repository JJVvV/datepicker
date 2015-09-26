/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class SocialItem{

  static propTypes = {
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render(){
    return(
      <li className="social-item">
        {this.renderLink()}
      </li>
    );
  }

  renderLink(){
    return(
      <Link to={this.props.link}>
        {this.props.text}
      </Link>
    );
  }
}