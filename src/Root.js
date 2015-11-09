/**
 * Created by Alex Liu on 2015/7/10.
 */

import React from 'react';

import Datepicker from './datepicker/Datepicker';







export default class ApplicationPage extends React.Component{

  constructor(){
    super();

  }



  render(){
    return (
       <div style={{marginLeft: '200px', width: 300}}>
           <p>
             <Datepicker className="form-c" />
           </p>
           <p>
               <Datepicker className="form-c" />
           </p>
       </div>
    );
  }

}

