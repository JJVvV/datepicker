/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import classnames  from 'classnames';






export default class Dropdown {



  render(){
    const {right, info} = this.props;
    return(
        <div className={classnames({bubble: true, left: !right, right: right})}>
          <pre>{info}</pre>
          <img src="" alt="" className="message-loading" />
          <i className="icon-star"></i>
          <i className="icon-fail"></i>
        </div>
    );

  }


}