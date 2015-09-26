/**
 * Created by Administrator on 2015/7/10.
 */

import React from 'react';






import ApplicationList from '../ApplicationList.js';

import actionContainer from '../../services/actionContainer.js';
import PubSub from 'pubsub-js';
import Treeview from '../tree/TreeView.js';
import buildTreeView from '../tree/buildTreeView.js';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';
import TreeForLaunchr from '../tree/TreeForLaunchr.js';

const RENDER_TREE = 'RENDER_TREE';

export default class UserList extends React.Component{

  constructor(){
    super();
    this.state = {
      tree : []
    }
  }

  componentDidMount(){
    //getSectionPersionTree().then((sectionList) => {
    //  this.renderTree(sectionList);
    //});
    this.unbindRenderTree = PubSub.subscribe(RENDER_TREE, ::this.renderTree);
    //actionContainer.get().loadThreadList();
  }

  componentWillUnMount(){
    PubSub.unsubscribe(this.unbindRenderTree);
  }

  renderTree(type, sectionTree){
    this.setState({
      tree: sectionTree
    });
  }

  render(){



    //const {chatMessages, chatRoomName} = this.props.chatData;


    return (
        <section className="page-container" style={{marginLeft: 200, width: 300}}>
          <TreeForLaunchr />
          <div>
            {this.state.tree.map((item) => (
                <div>{item}</div>
            ))}
          </div>
        </section>
    );
  }

  clickItem(id){
    //actionContainer.get().loadChatMessages(id);
    console.log('thread-item\'s id:', id);
  }
}
//<div className="sub-panel">
//  <div className="sub-panel-content">
//    <ApplicationList items={items} />
//  </div>
//</div>
//{this.props.children}