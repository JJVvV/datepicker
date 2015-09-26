/**
 * Created by Administrator on 2015/7/10.
 */
/*
* application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import ChatRoom from './ChatRoom.js';

export default class ChatTitle extends React.Component{

  constructor(){
    super();
    this.state = {

    }
  }

  render(){
    const {name, toggle, show} = this.props;
    return (
        <div className="chat-title" onClick={toggle}>
          <span className="chat-title-name">{name}</span>
          <i className={classnames({'icon-glyph-142': !show, 'icon-glyph-141': show})}></i>
        </div>

    );
  }
}



