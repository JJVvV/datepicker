/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class NavItem{

  static propTypes = {
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render(){
    return(
      <Link to={this.props.link}>
        {this.props.children || this.props.text}
      </Link>
    );
  }

}