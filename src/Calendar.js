import React, { Component } from 'react';
import CalendarHeaderRow from './CalendarHeaderRow';
import CalendarGrid from './CalendarGrid';

import './Calendar.css';

class Calendar extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    // header - with the weekdays
    // grid - that includes columns
    //
    return (
      <table className='Calendar'>
        <CalendarHeaderRow />
        <CalendarGrid />
      </table>
    );
  }
}

export default Calendar;
