/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import {getPositionByID} from '../../services/sectionPeopleTree.js';
import TreeView from './TreeView.js';
import $ from 'jquery';

export default function buildTreeView(tree){
    return tree.map((t, i) => {

        let hasChildren = t.children && t.children.length > 0;
        let isUser= !!t.U_NAME;
        let label = t.D_NAME;
        let child;

        if(isUser){
            child = generateUser({name:t.U_NAME, url: '/redux-launchr/public/img/jinmuyan.jpg'});
        }else{
            child = (
                <TreeView parent={t.parent} id={t.SHOW_ID} key={i} defaultCollapsed={false} label={label} onClick={getRelationship} onChange={checkGroup}>
                    {hasChildren && buildTreeView(t.children)}
                </TreeView>
            );
        }
        return child;
    });
}

function checkGroup(data, e){
    findChild($(e.target).closest('.treeview'), e.target.checked);
    findParent($(e.target).closest('.treeview'), e.target.checked);
}
function clickUser(data, e){
    findParent($(e.target).closest('.treeview'), e.target.checked);
}
function getRelationship(id, e){

    findChild();
    findParent();
}

function findChild($treeview, checked){
    let input;
    //toArray(li.children).forEach((item) => {
    //    input = item.querySelector('input');
    //
    //});
    $treeview.find('input').prop('checked', checked);
    //let $treeview = $(treeviewChildren).children('.treeview');
    //if($treeview.length){
    //    findChild($treeview.children('.treeview-children'), checked);
    //}
    //var user = $(treeviewChildren).children(':not(.treeview)').find('input').prop('checked', checked);


}

function toArray(likeArray){
    return Array.prototype.slice.apply()
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
    //let childrenAllChecked = $children.find('.treeview-item input').prop('checked');
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



function generateUser(user){
    const {
        url,
        name
    } = user;
    return (
        <div class="select-member-group" style={{marginBottom: 12}}>
            <img style={{marginRight:10, verticalAlign:'middle'}} src={url} alt="" width="30" height="30" />
            <span>{name}</span>
            <input style={{float:'right'}} type="checkbox" class="pull-right member-check-box" onClick={clickUser.bind(this, user)} />
        </div>
    );
}

