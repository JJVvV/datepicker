/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import PubSub from 'pubsub-js';

import TreeView from './TreeView.js';
import $ from 'jquery';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';
const RENDER_TREE = 'RENDER_TREE';
const REFRESH_TREE = 'REFRESH_TREE';

let $tree;

let checkedUserList = [];

export default class TreeForLaunchr extends React.Component{

    constructor(){
        super();
        this.state = {
            tree : []
        }
        this.checkedUserList = [];
    }

    componentDidMount(){
        getSectionPersionTree().then((...args) => {
            this.renderTree(...args);
        });
        $tree = $(React.findDOMNode(this.refs.tree));
        this.unbindRenderTree = PubSub.subscribe(REFRESH_TREE, ::this.renderTree);
        //actionContainer.get().loadThreadList();
    }

    componentWillUnMount(){
        PubSub.unsubscribe(this.unbindRenderTree);
        $tree = null;
    }

    renderTree(sectionTree){
        this.setState({
            tree: sectionTree
        });
    }

    render(){



        //const {chatMessages, chatRoomName} = this.props.chatData;


        return (
            <section className="launchr-tree" ref="tree">
                {::this.buildTreeView(this.state.tree)}
            </section>
        );
    }

     buildTreeView(tree){

        return tree.map((t, i) => {

            let hasChildren = t.children && t.children.length > 0;
            let isUser= !!t.U_NAME;
            let label = t.D_NAME;
            let child;

            if(isUser){
                child = this.generateUser({name:t.U_NAME, url: '/redux-launchr/public/img/jinmuyan.jpg', id:t.SHOW_ID, trueName:t.U_TRUE_NAME, deptName:t.D_NAME});
            }else{
                child = (
                    <TreeView parent={t.parent} id={t.SHOW_ID} key={i} defaultCollapsed={false} label={label} onChange={::this.checkGroup}>
                        {hasChildren && ::this.buildTreeView(t.children)}
                    </TreeView>
                );
            }
            return child;
        });
    }

    checkGroup(data, e){
        findChild($(e.target).closest('.treeview'), e.target.checked);
        findParent($(e.target).closest('.treeview'), e.target.checked);
        //$(this.refs.tree);
        //PubSub.publish(RENDER_TREE, this.getIDList());
        //console.log(this.getIDList());
    }

    clickUser(data, e){
        findParent($(e.target).closest('.treeview'), e.target.checked);
        e.target.checked ? this.addUser(data) : this.removeUser(data);
        PubSub.publish(RENDER_TREE, this.checkedUserList);
        //console.log(this.getIDList());
    }

    getIDList(){
        return $tree.find('.treeview-user-check:checked').toArray().map((input) => input.value)
    }
    generateUser(user){
        const {
            url,
            name,
            id,
            trueName,
            deptName
            } = user;
        return (
            <div className="treeview-user" style={{marginBottom: 12}}>
                <img style={{marginRight:10, verticalAlign:'middle'}} src={url} alt="" width="30" height="30" />
                <span>{name}</span>
                <input value={id} className="treeview-user-check" style={{float:'right'}} type="checkbox" onClick={this.clickUser.bind(this, user)} />
            </div>
        );
    }

    addUser(data){
        this.checkedUserList.push(data);
    }

    removeUser(data){
        this.checkedUserList = this.checkedUserList.filter((user) => {
            return user.id !== data.id
        });
    }
}






function findChild($treeview, checked){
    let input;
    //$treeview.find('input').prop('checked', checked);
    //var childrenAllChecked = $treeview.children('.treeview-item').find('input').prop('checked') === true;
    //var userAllChecked = $treeview.children()
    $treeview.find('.treeview-user input').toArray().forEach((input) => {
        input.checked !== checked && input.click();
    });
}


function findParent($treeview, checked){

    if(!$treeview || $treeview.length === 0){
        return ;
    }
    let allChecked = false;
    //let $treeview = $(treeview);
    let $treeviewChildren = $treeview.children('.treeview-children');
    let treeviewAllChecked = $treeviewChildren.children('.treeview').find('.treeview-item input').prop('checked') !== false;
    let $user = $treeviewChildren.children().not('.treeview');

    let userAllChecked = $user.find('input').not(':checked').length === 0;

    if(checked){
        if(treeviewAllChecked && userAllChecked){
            //$treeview.parent().closest('.treeview').children('.treeview-item').find('input').prop('checked', checked);
            $treeview.children('.treeview-item').find('input').prop('checked', checked);
            findParent($treeview.parent().closest('.treeview'), checked);
        }
    }else{
        $treeview.children('.treeview-item').find('input').prop('checked', checked);
        findParent($treeview.parent().closest('.treeview'), checked);
    }

}



