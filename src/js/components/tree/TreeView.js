/**
 * Created by AlexLiu on 2015/9/7.
 */


import React, { PropTypes } from 'react'
import classnames  from 'classnames';
import request from 'reqwest';
import {Promise} from 'es6-promise';
import {getSectionPersionTree} from '../../services/sectionPeopleTree.js';




export default class TreeView extends React.Component {

    constructor(props){
        super();
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
            id,
            parent
        } = this.props;

        const {
            collapsed
        } = this.state;

        return(
            <div className="treeview">
                <div className="treeview-item" style={{marginBottom:0}}>
                    <p className="dashed-line">
                        <span className="title" onClick={this.handleClick.bind(this, id)}><i className={classnames({"demo-icon": true, 'icon-glyph-165': !collapsed, 'icon-glyph-166': collapsed})} ></i>{label}</span>
                        <input style={{float: 'right'}} type="checkbox" className="pull-right title-check-box" onClick={this._checkGroup.bind(this, parent)} />
                    </p>
                </div>
                {children &&
                    <div className={classnames({'treeview-children': true, collapsed: collapsed})}>
                        {children}
                    </div>
                }

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

    _checkGroup(...args){
        let {
            onChange
        } = this.props;

        if(typeof onChange === 'function'){
            onChange(...args);
        }
    }

}

