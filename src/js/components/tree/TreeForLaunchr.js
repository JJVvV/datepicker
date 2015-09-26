/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import PubSub from 'pubsub-js';

import TreeView from './TreeView.js';
import Tree from '../tree/Tree.js';
import TreeNode from '../tree/TreeNode.js';

import $ from 'jquery';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';



const RENDER_TREE = 'RENDER_TREE';
const REFRESH_TREE = 'REFRESH_TREE';



export default class TreeForLaunchr extends React.Component{

    static defaultProps = {
        getKey: (t) =>(t.SHOW_ID),
        defaultCheckedKeys: [],
        onCheck: () => {},
        multiple:true

    }
    constructor(props){
        super(props);
        this.state = {
            tree : []
        }

    }

    componentDidMount(){
        getSectionPersionTree().then((...args) => {
            this.renderTree(...args);
            this.props.didMount && this.props.didMount(...args);
        });

    }

/*    componentWillMount(){
        debugger;
    }

    componentWillUnmount(){
        debugger;
    }

    componentWillUpdate(){
        debugger;
    }

    componentWillReceiveProps(props){

        console.log(props);
        debugger;
    }

    componentDidUpdate(){
        debugger;
    }*/

    renderTree(sectionTree){
        this.setState({
            tree: sectionTree
        });
    }

    render(){
        //const {
        //    defaultCheckedKeys,
        //    onCheck,
        //    multiple
        //} = this.props;



//
        return (


            <section className="launchr-tree" ref="tree">

                <Tree {...this.props}>
                    {this.buildTreeView(this.state.tree)}
                </Tree>

            </section>
        );
    }

     buildTreeView(tree){

        return tree.map((t, i) => {

            let hasChildren = t.children && t.children.length > 0;
            let isUser= !!t.U_NAME;
            let label = t.D_NAME;
            let child;
            return (
                <TreeNode isUser={isUser} key={this.props.getKey(t)} data={t}  title={label}  defaultCollapsed={false} label={label}>
                    {hasChildren && ::this.buildTreeView(t.children)}
                </TreeNode>
            );
        });
    }


}










