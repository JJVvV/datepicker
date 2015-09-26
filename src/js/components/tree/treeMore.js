/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import request from 'reqwest';
import {Promise} from 'es6-promise';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';
import tree from './Tree.js';



export default class TreeView extends React.Component {

    constructor(props){
        super();

    }

    componentDidMount(){

    }


    render(){
        let newChildren = React.Children.map(props.children, this.renderTreeNode, this);
        <tree>
            <div className="haha"></div>
            <div className="haha">
                <div className="hahaha"></div>
            </div>
        </tree>
    }



}

