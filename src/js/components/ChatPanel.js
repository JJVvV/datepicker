/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import ChatMessage from './chatapp/ChatMessage.js';
import ThreadList from '../ThreadList.js';
import SubPanelHeader from '../SubPanelHeader.js';

export default class ChatPanel extends React.Component{

  render(){
    const {messages} = this.props;
    
    return (
        <div className="sub-panel">
            <SubPanelHeader />
            <div className="sub-panel-content">
                <ThreadList items={items} />
            </div>

        </div>
    );
  }



}



