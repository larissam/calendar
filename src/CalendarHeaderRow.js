import React, { Component } from 'react';

import { DaysOfWeek } from './enums';

import './CalendarHeaderRow.css';

class CalendarHeaderRow extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <th className='CalendarHeaderRow'>
        <td className='CalendarHeaderRowSpacer'></td>
        {
          // should we make a separate CalendarHeaderCol element?
          DaysOfWeek.map((day) => (
            <td className='CalendarHeaderCol'>{ day }</td>
          ))
        }
      </th>
    );
  }
}

export default CalendarHeaderRow;
