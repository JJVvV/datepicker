/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import NavItem from './NavItem.js'
import Logo from './Logo.js'



export default class Loading {

  render(){
    return(
      <div className="loading">
        <div className="loading-inner">
          <div><span></span></div>
          <div><span></span></div>
          <div><span></span></div>
        </div>
      </div>
    );
  }
}