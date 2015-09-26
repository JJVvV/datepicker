/**
 * Created by RichardJi on 2015/9/14.
 */

import React from 'react';

import PubSub from 'pubsub-js';
import Treeview from './tree/TreeView.js';
import buildTreeView from './tree/buildTreeView.js';
import {getSectionPersionTree, loopTreeForLaunchr} from '../services/sectionPeopleTree.js';
import TreeForLaunchr from './tree/TreeForLaunchr.js';
import {FadeModal as Modal} from './boron/Boron.js';
import {CHANGE_SLIDER,SLIEDER_ACTIVE, S, SHOW_TREE_RESULT} from '../constants/launchr.js';
import AvatarComponent from './AvatarComponent.js';

export default class SelectUserArea extends React.Component{

    static defaultProps = {
        getKey: (t) => (t.U_NAME),
        getSelectKeys:() => ([])
    }

    constructor(props){
        super(props);
        this.state = {
            selectKeys : props.selectKeys || [],
            responseType:'',
            tree: []
        }
    }

    componentWillReceiveProps(props){
        //let tree = this.getSelectKeysObj(...args);
        this.setState({
            selectKeys: props.selectKeys || []
        });
    }

    //componentWillUpdate(props){
    //    this.state.selectKeys = props.selectKeys;
    //}


    render(){
        return (

            <Modal ref="modal">

                <div className="choose-people-box clearfix" style={{boxShadow: 'none'}}>
                    <div className="half-box">
                        <div className="form-feedback left input-whole-width">
                            <input type="search" className="form-c" placeholder="搜索" />
                            <span className="feedback  demo-icon icon-glyph-115"></span>
                        </div>

                        <div className="approval-handle-title clearfix">
                            <div className="choose-people-title-item ">
                                <span>按姓名</span>
                            </div>
                            <div className="choose-people-title-item active">
                                <span>按部门</span>
                            </div>
                        </div>
                        <TreeForLaunchr multiple={this.props.multiple} didMount={::this.treeDidMount} onCheck={::this.handleCheck} getKey={::this.props.getKey} defaultCheckedKeys={this.state.selectKeys}  />



                    </div>
                    <div className="half-box">
                        <div className="meeting-box-body">
                            <div className="attend-person-group select-num-title">
                                <span>已选{this.state.tree.length}个联系人</span>
                                <i className="demo-icon icon-glyph-167 pull-right" onClick={::this.hide}></i>
                            </div>
                            {
                                this.state.tree.length > 0 && this.state.tree.map((item, index)=>{
                                    return (
                                        <div className="person-group">
                                            <AvatarComponent userName={item.name} trueName={item.trueName} width={30} height={30}/>
                                            <div className="person-group-detail">
                                                <span>{item.trueName}</span>
                                                <p className="team-name">{item.deptName}</p>
                                                <i className="demo-icon icon-glyph-194" onClick={::this.removeUser.bind(this, index)}></i>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="meeting-box-footer">
                            <span className="btn-comfirm" onClick={::this.sureClick}>确认</span>
                            <span className="btn-cancle" onClick={::this.hide}>取消</span>
                        </div>
                    </div>
                </div>

            </Modal>
        );
    }

    getSelectKeysObj(tree){
        let selectedKeys = [];


        let {
            selectKeys
            } = this.state;
        loopTreeForLaunchr(tree, (item) => {
            selectKeys.forEach((k) => {
                if(k === item.U_NAME){
                    selectedKeys.push({
                        name: item.U_NAME,
                        trueName: item.U_TRUE_NAME,
                        url: '../../../redux-launchr/public/img/jinmuyan.jpg',
                        deptName: item.D_NAME
                    });
                }
            });
        })

        return selectKeys;
    }
    treeDidMount(tree){
        //let tree = this.getSelectKeysObj(...args);
        let selectedKeys = [];


        let {
            selectKeys
            } = this.state;
        loopTreeForLaunchr(tree, (item) => {
            selectKeys.forEach((k) => {
                if(k === item.U_NAME){
                    selectedKeys.push({
                        name: item.U_NAME,
                        trueName: item.U_TRUE_NAME,
                        url: '../../../redux-launchr/public/img/jinmuyan.jpg',
                        deptName: item.D_NAME
                    });
                }
            });
        })
        this.setState({
            tree: selectedKeys
        });

    }

    sureClick(){
        this.props.onCheck && this.props.onCheck(this.state.tree);
        this.hide();
    }

    handleCheck(result){
        let list = [];
        let keys = [];
        result.data.map((item, index) =>{
           let user = {};
            user.id=item.SHOW_ID;
            user.name = item.U_NAME;
            user.trueName = item.U_TRUE_NAME;
            user.url = '../../../redux-launchr/public/img/jinmuyan.jpg';
            user.deptName = item.D_NAME;
            list.push(user);
            keys.push(item.U_NAME);
        });
        this.setState({
            tree:list,
            selectKeys: keys
        });
    }




    removeUser(index){
        let selectUser = this.state.tree;
        selectUser.splice(index, 1);
        let selectKeys = selectUser.map((i) => i.name);
        this.setState({
            tree:selectUser,
            selectKeys
        });
    }

    show(){

        this.refs.modal.show();
        this.setState({})
    }

    hide(){
        this.refs.modal.hide();
        this.setState({})
    }
}