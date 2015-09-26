/**
 * Created by BennetWang on 2015/9/22.
 */
import React, {PropTypes} from 'react';
import {AvatarUrlDomain} from '../constants/launchr.js';
import reduxContainer from '../services/reduxContainer.js';
export default class AvatarComponent extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let width=this.props.width || 40;
        let height=this.props.height || 40;
        let style=this.props.style || {};
        let className=this.props.className || {};
        let avatarUrl=AvatarUrlDomain+"?width="+width+"&height="+height+"&companyCode="+reduxContainer.me().companyCode+"&loginName="+this.props.userName;
        return(
            <img alt="" width={width} height={height}  src={avatarUrl} style={style} className={className} title={this.props.trueName}/>
        )
    }
}
