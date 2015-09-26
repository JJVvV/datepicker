/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import request from 'reqwest';
import {Promise} from 'es6-promise';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';
import AvatarComponent from '../AvatarComponent.js';



export default class TreeNode extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            collapsed:props.defaultCollapsed
        }
    }

    componentDidMount(){

    }

    render(){
        const {
            children,
            label,
            title,
            id,
            parent,
            root,
            pos,
            checked,
            isUser,
            data,
            multiple
            } = this.props;
        const {
            collapsed
            } = this.state;


        let user = {};
        if(isUser){
            return this.generateUser({name:data.U_NAME || 'U_NAME', url: '/redux-launchr/public/img/jinmuyan.jpg', id:data.SHOW_ID, trueName:data.U_TRUE_NAME || 'U_TRUE_NAME', deptName:data.D_NAME || 'D_NAME'})
        }
        return(
            <div className="treeview">
                <div className="treeview-item" style={{marginBottom:0}}>
                    <p className="dashed-line">
                        <span className="title" onClick={this.handleClick.bind(this, id)}><i className={classnames({"demo-icon": true, 'icon-glyph-165': !collapsed, 'icon-glyph-166': collapsed})} ></i>{title}</span>
                        {multiple && <input style={{float: 'right'}} type="checkbox" checked={checked} className="pull-right title-check-box" onClick={this._check.bind(this, parent)} />}
                    </p>
                </div>
                {children &&
                <div className={classnames({'treeview-children': true, collapsed: collapsed})}>
                    {React.Children.map(children, (item, index) => {
                        return root.renderTreeNode(item, index, pos);
                    }, root)}
                </div>
                }

            </div>

        );

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
                <AvatarComponent userName={name} trueName={trueName}  width={30} height={30} style={{marginRight:10, verticalAlign:'middle'}}/>
                <span>{trueName}</span>
                <input value={id} className="treeview-user-check" style={{float:'right'}} checked={this.props.checked} type="checkbox" onClick={::this._check} />
            </div>
        );
    }

    handleClick(...args){
        let {
            onClick
            } = this.props;

        let {
            collapsed
            } = this.state;

        this.setState({
            collapsed: !collapsed
        });

        if(typeof onClick === 'function'){
            onClick(...args);
        }
    }

    _check(...args){
        let {
            onChange
            } = this.props;
        this.props.root.handleCheck(this);
        //if(typeof onChange === 'function'){
        //    onChange(...args);
        //}
    }

}

