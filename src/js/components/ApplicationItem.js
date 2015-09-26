/**
 * Created by Administrator on 2015/7/10.
 */
/*
* application list item or people list item used in .sub-panel
 */
// 暂时没用，直接写在 <ApplicationList /> 里面
import React, {Link, PropTypes} from 'react';

export default class ApplicationItem extends React.Component{


  render(){
    const {avator, title, id} = this.props.item;


     return (
         <div className="thread-item">
           <div className="thread-item-avator avator">
             <img src={avator} alt="" width="40" height="40" />
           </div>
           <div className="thread-item-info">
             <h3>{title}</h3>
           </div>
         </div>
     )
  }

}



