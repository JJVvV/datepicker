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
       <div className="test" style={{marginLeft: '200px', width: 800}}>
           <p>default</p>
           <Datepicker />

           <p>className: border</p>
           <Datepicker className="border form-c" />

           <p>dateFormat="DD-MM-YYYY"</p>
           <Datepicker dateFormat="DD-MM-YYYY" />

           <p>dateFormat="H:mm YYYY-MM-DD"</p>
           <Datepicker dateFormat="H:mm YYYY-MM-DD" />

           <p>date="07-25-2015"</p>
           <Datepicker date="07-25-2015" />

           <p>date="new Date()"</p>
           <Datepicker date={new Date()} />

           <p>minDate=new Date(2015, 6, 9)</p>
           <Datepicker
               date="07-25-2015"
               minDate={new Date(2015, 6, 9)}
           />

           <p>maxDate=new Date(2015, 7, 20)</p>
           <Datepicker
               date="07-25-2015"
               maxDate={new Date(2015, 7, 20)}
           />


           <pre>minDate=new Date(2015, 6, 9)<br />
                 maxDate=new Date(2015, 7, 20)</pre>
           <Datepicker
               date="07-25-2015"
               minDate={new Date(2015, 6, 9)}
               maxDate={new Date(2015, 7, 20)} />


           <pre>
               date="07-25-2015"<br />
               minDate=new Date(2015, 6, 9)<br />
               maxDate=new Date(2015, 7, 20)<br />
               disabledDates=[new Date(2015, 7, 2), new Date(2015, 6, 11)]
           </pre>
           <Datepicker
               date="07-25-2015"
               minDate={new Date(2015, 6, 9)}
               maxDate={new Date(2015, 7, 20)}
               disabledDates={[new Date(2015, 7, 2), new Date(2015, 6, 11)]}
           />

           <p>
               initShowDate: false
           </p>
           <Datepicker
               date="2015-10-9"
               initShowDate={false}
               minDate={new Date(2015, 10, 9)}
               maxDate={new Date(2015, 11, 20)}
               disabledDates={[new Date(2015, 10, 22), new Date(2015, 11, 7)]}
           />

           <p>icon: false</p>

           <Datepicker
               date="2015-10-9"
               initShowDate={false}
               minDate={new Date(2015, 10, 9)}
               maxDate={new Date(2015, 11, 20)}
               disabledDates={[new Date(2015, 10, 22), new Date(2015, 11, 7)]}
               icon={false}
           />

       </div>
    );
  }

}

