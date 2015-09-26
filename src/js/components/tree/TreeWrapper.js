/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes , Children} from 'react'
import classnames  from 'classnames';
import request from 'reqwest';
import {Promise} from 'es6-promise';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';
import getTopNode from './utils/getTopNode.js';
import {posLength, parentPos} from './utils/pos.js';




export default class Tree extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            collapsed:props.defaultCollapsed
        }
    }


    componentDidMount(){

    }

    renderTreeNode(child, index, level=0){

        const key = child.key || `${level}-${index}`;
        let cloneProps = {
            className: 'woqu',
            root:this,
            checked: this.checkedKeys.indexOf(key) !== -1,
            checkPart: this.checkPartKeys.indexOf(key) !== -1
        }
        return React.cloneElement(child, cloneProps);
    }

    loopChildren(children, callback){
        const loop = (children, level) => {
            if(Array.isArray(children)){
                Children.forEach(children, (item, index) => {
                    const pos = `${level}-${index}`;
                    const newChildren = item.props.children;
                    if(newChildren){
                        loop(newChildren, pos);
                    }
                    callback(item, index, pos);
                });
            }
        }
        loop(children, 0);
    }

    handleCheckState(obj, checkedArr, event){
        let eve = false;
        if(typeof event === 'boolean'){
            eve = true;
        }
        checkedArr.forEach((pos) => {
            Object.keys(obj).forEach((k) => {
                if(posLength(k) > posLength(pos) && k.indexOf(pos) === 0){
                    if(eve){
                        obj[k].checked = event;
                    }else{
                        obj[k].checked = true;
                    }
                }
            });

            const loop = (_pos) => {
                const pPos = parentPos(_pos);
                const parentLen = posLength(parentPos);
                let siblings = 0;
                let siblingsChecked = 0;
                if(parentLen < 3){
                    return;
                }
                Object.keys(obj).forEach((k) => {
                    if(posLength(k) === posLength(_pos) && parentPos(k) === pPos){
                        siblings++;
                        if(obj[k].checked){
                            siblingsChecked++
                        }else if(obj[k].checkPart){
                            siblingsChecked += 0.5;
                        }
                    }

                });
                let parentObj = obj[pPos];
                if(siblingsChecked === 0){
                    parentObj.checked = false;
                    parentObj.checkPart= false;
                }else if(siblingsChecked === siblings){
                    parentObj.checked = true;
                    parentObj.checkPart = false;
                }else{
                    parentObj.checked = false;
                    parentObj.checkPart = true;
                }

                loop(pPos);
            }
            loop(pos);
        });

    }
    getCheckKeys(){
        const checkedKeys = [];
        const checkPartKeys = [];

        Object.keys(this.treeNodes).forEach((k) => {
            const item = this.treeNodes[k];
            if(item.checked){
                checkedKeys.push(k);
            }else if(item.checkPart){
                checkPartKeys.push(k);
            }
        });

        return {
            checkedKeys,
            checkPartKeys
        }

    }


    render(){
        let newChildren = React.Children.map(this.props.children, this.renderTreeNode, this);
        this.treeNodes = {};
        let checkedKeys = this.state.checkedKeys;
        const checkedPos = [];
        this.loopChildren(this.props.children, (item, index, pos) => {
            let key = item.key || pos;
            let checked = false;
            if(checkedKeys.indexOf(key) !== 0){
                checked = true;
                checkedPos.push(key);
            }
            this.treeNodes[pos] = {
                checked,
                key,
                checkPart: false
            }
        });

        this.handleCheckState(this.treeNodes, getTopNode(checkedPos));
        let keys = this.getCheckKeys();

        this.checkedKeys = keys.checkedKeys;
        this.checkedKeys = keys.checkPartKeys;

        this.newChildren = React.Children.map(props.children, this.renderTreeNode, this);

        return (
            <div className="tree">
                {this.newChildren}
            </div>
        );
    }




}

