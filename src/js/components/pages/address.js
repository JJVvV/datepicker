/**
 * Created by Administrator on 2015/7/10.
 */

import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//@connect(state => ({
//  blog: state.article
//}))
export default class AddressPage extends React.Component{
  render(){
    //const { dispatch } = this.props
    //const actions = bindActionCreators(articleAction, dispatch);
    return (
      <section>
        <div style={{marginLeft: '200px'}}>
          hello address!
        </div>
      </section>
    );
  }
}