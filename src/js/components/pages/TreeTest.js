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
//import Tree, {TreeNode} from '../tree_absolute';
import Tree, {TreeNode} from '../tree';

const RENDER_TREE = 'RENDER_TREE';

function handleCheck(info) {
    console.log('check: ', info);
}




export default class ApplicationPage extends React.Component{

  constructor(){
    super();

  }

  componentDidMount(){
    //getSectionPersionTree().then((sectionList) => {
    //  this.renderTree(sectionList);
    //});

    //actionContainer.get().loadThreadList();
  }


  render(){



    //const {chatMessages, chatRoomName} = this.props.chatData;


    return (
        <section className="page-container" style={{marginLeft: 200, width: 300}}>
            <TreeForLaunchr multiple={true} onCheck={handleCheck} getKey={(t) => {return t.U_NAME || t.SHOW_ID}} defaultCheckedKeys={['robinlin']}  />
        </section>
    );
  }

}


function handleCheck(info) {
    console.log('check: ', info);
}

