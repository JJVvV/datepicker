/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';

export default class Logo{

  static propTypes = {
    text: PropTypes.string.isRequired
  }

  static defaultProps = {
    text: 'Alex'
  }

  render(){
    return(
      <div className="logo">
        {this.props.text}
      </div>
    );
  }

}