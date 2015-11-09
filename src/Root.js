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

           <Datepicker className="form-c" allDay={true} />
           <p></p>

           <Datepicker className="border form-c" />
           <p></p>

           <Datepicker dateFormatAllDay="DD-MM-YYYY" />
           <p></p>

           <Datepicker dateFormatNotAllDay="H:mm YYYY-MM-DD" />
           <p></p>
           <Datepicker date="07-25-2015" />
           <p></p>

           <Datepicker
               date="07-25-2015"
               minDate={new Date(2015, 6, 9)}
           />
           <p></p>
           <Datepicker
               date="07-25-2015"
               maxDate={new Date(2015, 7, 20)}
           />
           <p></p>

           <Datepicker
               date="07-25-2015"
               minDate={new Date(2015, 6, 9)}
               maxDate={new Date(2015, 7, 20)} />
           <p></p>

           <Datepicker
               date="07-25-2015"
               minDate={new Date(2015, 6, 9)}
               maxDate={new Date(2015, 7, 20)}
               disabledDates={[new Date(2015, 7, 2), new Date(2015, 6, 11)]}
           />

           <p></p>

           <Datepicker
               date="2015-10-9"
               initShowDate={false}
               minDate={new Date(2015, 10, 9)}
               maxDate={new Date(2015, 11, 20)}
               disabledDates={[new Date(2015, 10, 22), new Date(2015, 11, 7)]}
           />

       </div>
    );
  }

}

