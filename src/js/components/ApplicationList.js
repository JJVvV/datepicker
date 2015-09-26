/**
 * Created by Administrator on 2015/7/10.
 */
// 应用列表
import React, {PropTypes} from 'react';
import ApplicationItem from './ApplicationItem.js';
import {Link} from 'react-router';

export default class ApplicationList extends React.Component{

  render(){
    const {items} = this.props;
    return (
        <div className="thread-list">
          {this.renderItems(items)}
        </div>
    );
  }


  renderItems(items){
    return items.map(item =>(
        <Link to={item.link} key={item.id} className="thread-item">
            <div className="thread-item-avator avator">
                <img src={item.avator} alt="" width="40" height="40" />
            </div>
            <div className="thread-item-info">
                <h3>{item.title}</h3>
            </div>
        </Link>
    ));
  }
}



