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

    static defaultProps = {
        defaultCheckedKeys:[],
        multiple:true
    }

    constructor(props){
        super(props);

        this.state = {
            collapsed:props.defaultCollapsed,
            checkedKeys: this.props.multiple ? this.props.defaultCheckedKeys : [this.props.defaultCheckedKeys[0]]
        }
    }



   componentWillReceiveProps(props){
        this.setState({
            collapsed:props.defaultCollapsed,
            checkedKeys: props.multiple ?props.defaultCheckedKeys : [props.defaultCheckedKeys[0]]
        });
    }

    renderTreeNode(child, index, level=0){
        const pos = child.key || `${level}-${index}`;
        const key = pos;
        let cloneProps = {
            className: 'woqu',
            root:this,
            pos,
            eventKey:pos,
            checked: this.checkedKeys.indexOf(key) !== -1,
            checkPart: this.checkPartKeys.indexOf(key) !== -1,
            multiple:this.props.multiple
        }
        return React.cloneElement(child, cloneProps);
    }

    loopChildren(children, callback){
        const loop = (children, level) => {
            Children.forEach(children, (item, index) => {
                const pos = `${level}-${index}`;
                const newChildren = item.props.children;
                if(newChildren){
                    loop(newChildren, pos);
                }
                callback(item, index, pos);
            });

        }
        loop(children, 0);
    }

    handleCheckState(obj, checkedArr, multiple, event){
        let eve = false;
        if(typeof event === 'boolean'){
            eve = true;
        }
        checkedArr.forEach((pos) => {
            Object.keys(obj).forEach((k) => {
                if(multiple){
                    if(posLength(k) > posLength(pos) && k.indexOf(pos) === 0){
                        if(eve){
                            obj[k].checked = event;
                        }else{
                            obj[k].checked = true;
                        }
                    }
                }else{
                    if(posLength(k) === posLength(pos) && k.indexOf(pos) === 0){
                        if(eve){
                            obj[k].checked = event;
                        }else{
                            obj[k].checked = true;
                        }
                    }else{
                        obj[k].checked = false;
                    }
                }

            });

            const loop = (_pos) => {
                const pPos = parentPos(_pos);
                const parentLen = posLength(pPos);
                let siblings = 0;
                let siblingsChecked = 0;
                if(parentLen < 2){
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

    handleCheck(treeNode){
        let tProps = treeNode.props;
        let checked = !tProps.checked;

        if(tProps.checkPart){
            checked = true;
        }

        let pos;

        Object.keys(this.treeNodes).forEach((k) => {
            const item = this.treeNodes[k];
            if(item.key === (tProps.pos)){
                item.checked = checked;
                pos = k;
            }
        });

        this.handleCheckState(this.treeNodes, [pos], this.props.multiple, checked);
        let keys = this.getCheckKeys();

        this.checkedKeys = keys.checkedKeys;
        this.checkPartKeys = keys.checkPartKeys;

        this.setState({
            checkedKeys: keys.checkedKeys
        });

        if(typeof this.props.onCheck === 'function'){
            this.props.onCheck({
                checked,
                node: treeNode,
                checkedKeys: keys.checkedChildrenKeys,
                data: keys.checkedChildrenData
            });
        }
    }

    getCheckKeys(){
        const checkedKeys = [];
        const checkPartKeys = [];
        const checkedChildrenKeys = [];
        const checkPartChildrenKeys = [];
        const checkedChildrenData = [];
        Object.keys(this.treeNodes).forEach((k) => {
            const item = this.treeNodes[k];
            if(item.checked){
                checkedKeys.push(item.key);
                item.section || (checkedChildrenKeys.push(item.key), checkedChildrenData.push(item));
            }else if(item.checkPart){
                checkPartKeys.push(item.key);
                item.section || checkPartChildrenKeys.push(item.key);
            }



        });

        return {
            checkedKeys,
            checkPartKeys,
            checkedChildrenKeys,
            checkPartChildrenKeys,
            checkedChildrenData
        }

    }

    componentDidMount(){
        this.setState({});
    }

    render(){
        //console.log('this.props.children', this.props.children);

        const {
            multiple
        } = this.props;

        this.treeNodes = {};
        let checkedKeys = this.state.checkedKeys;

        const checkedPos = [];
        this.loopChildren(this.props.children, (item, index, pos) => {
            const {
                ...userfulItem,
                children,
                } = item.props.data;
            let key = item.key || pos;
            let checked = false;


            if(checkedKeys.indexOf(key) !== -1){
                checked = true;
                checkedPos.push(pos);
            }
            this.treeNodes[pos] = {
                checked,
                key,
                checkPart: false,
                section: !!children,
                ...userfulItem
            }
        });

        this.handleCheckState(this.treeNodes, getTopNode(checkedPos), multiple);
        let keys = this.getCheckKeys();

        this.checkedKeys = keys.checkedKeys;
        this.checkPartKeys = keys.checkPartKeys;

        this.newChildren = React.Children.map(this.props.children, this.renderTreeNode, this);

        return (
            <div className="tree">
                {this.newChildren}
            </div>
        );
    }




}

