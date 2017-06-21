import React, { Component } from 'react';
import CalendarHeaderRow from './CalendarHeaderRow';
import CalendarGrid from './CalendarGrid';

import './Calendar.css';

import { events } from './events'; // mock data

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.onCellClick = this.onCellClick.bind(this);
    this.onCellRangeSelect = this.onCellRangeSelect.bind(this);

    // should have start/end dates too
    this.state = {
      events: events
    };
  }

  onCellClick(moment) {
    alert(`clicked cell: ${moment.format('LLL')}`);
  }

  onCellRangeSelect(startCell, endCell) {
    alert(`selected cells: ${startCell.moment.format('LLL')} - ${endCell.moment.format('LLL')}`);
  }

  render(){
    const {
      events
    } = this.state;

    return (
      <table className='Calendar'>
        <CalendarHeaderRow />
        <CalendarGrid
          events={ events }
          onCellClick={ this.onCellClick }
          onCellRangeSelect={ this.onCellRangeSelect }
          />
      </table>
    );
  }
}

export default Calendar;
