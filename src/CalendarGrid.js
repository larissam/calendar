import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import { TimeColumn } from './TimeColumn';
import DayColumn from './DayColumn';

import './CalendarGrid.css';

// creates an array of 7 days, each with 48 timeslots
// each timeslot has a moment object reflecting that time
const getCalendarDays = (startDate) => {
  // start with 7 days
  const days = [...Array(7)].map((day) => {
    const timeslots = [];

    // each timeslot will have a moment object
    [...Array(48)].map(() => {
      timeslots.push({
        moment: startDate.clone(),
        selected: false
      });
      startDate.add(30, 'minutes');
    });

    return {
      timeslots
    };
  });

  return days;
};

const CELL_HEIGHT = 19; // px

class CalendarGrid extends Component {
  constructor(props) {
    super(props);

    this.onCellClick = this.onCellClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onCellRangeSelect = this.onCellRangeSelect.bind(this);

    const startOfWeek = moment().startOf('week');

    this.state = {
      startDate: startOfWeek,
      days: getCalendarDays(startOfWeek),
      selecting: false,
      selectStartHeight: 0,
      selectEndHeight: 0
    };
  }

  onCellClick(moment) {
    alert(`clicked cell: ${moment.format('LLL')}`);
  }

  onCellRangeSelect(startCell, endCell) {
    alert(`selected cells: ${startCell.moment.format('LLL')} - ${endCell.moment.format('LLL')}`);
  }

  // need to make sure this is for left click only!
  onMouseDown(day, e) {
    console.log('mousedown e:')

    // i want to save the moment/or the day cell here.
    // const { days } = this.state;
    const selectStartHeight = e.target.offsetTop;
    const selectStartCell = day.timeslots[Math.floor(selectStartHeight/CELL_HEIGHT) + 1];
    this.setState({
      selecting: true,
      selectStartHeight,
      selectStartCell
    });
  }

  onMouseUp(day, e) {
    const {
      days,
      selectEndHeight,
      selectStartCell
    } = this.state;

    const selectEndCell = day.timeslots[Math.floor(selectEndHeight/CELL_HEIGHT) + 1];

    // side effect - altering "days"
    day.timeslots.forEach((timeslot) => {
      timeslot.selected = false;
    });

    this.setState({
      selecting: false,
      selectStartHeight: 0,
      selectEndHeight: 0,
      days
    }, () => {
      this.onCellRangeSelect(selectStartCell, selectEndCell);
    });
  }

  onMouseOver(day, e) {
    const {
      selectStartHeight,
      selecting,
      days
    } = this.state;

    if(selecting) {
      const selectEndHeight = e.target.offsetTop;

      // side effect - altering "days"
      day.timeslots.forEach((timeslot, idx) => {
        const height = idx*CELL_HEIGHT;

        if(height > selectStartHeight && height < selectEndHeight) {
          timeslot.selected = true;
        }
      });

      this.setState({
        selectEndHeight,
        days
      });
    }
  }

  // convert the bind to arrow functions
  render() {
    const { days } = this.state;

    return (
      <tr className='CalendarGrid'>
        <TimeColumn />
        { days.map((day) => (
          <DayColumn
            day={ day }
            onCellClick={ this.onCellClick }
            onMouseDown={ this.onMouseDown.bind(null, day) }
            onMouseUp={ this.onMouseUp.bind(null, day) }
            onMouseOver={ this.onMouseOver.bind(null, day) }
            />
        ))}
      </tr>
    );
  }
}

export default CalendarGrid;
