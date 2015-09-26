/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import classnames  from 'classnames';





export default class Dropdown extends React.Component {

  constructor(props){
    super();


    this.state = {
      on: props.on
    }
  }


  render(){
    const {on} = this.state;
    let classname = this.props.className + ' ' + classnames({"icon-toggle-off": !on, "icon-toggle-on": on});
    return(
        <i className={classname} style={this.props.style} onClick={::this._onClick}></i>
    );

  }

  _onClick(){
    let on = !this.state.on;
    this.setState({
      on
    });

    typeof this.props.onToggleBtnChange === 'function' && this.props.onToggleBtnChange(on);
  }


}