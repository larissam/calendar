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

class CalendarGrid extends Component {
  constructor(props) {
    super(props);

    this.onCellClick = this.onCellClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);

    const startOfWeek = moment().startOf('week');

    // needs something to indicate where it's selected
    // maybe cell height is 18.5?
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

  onMouseDown(day, e) {
    console.log('mousedown day: ', day);
    console.log('mousedown e: ', e.target);
    console.log('mousedown e offsetTop: ', e.target.offsetTop);
    // console.log('mousedown e: ', e.target.getBoundingClientRect());
    // console.log('mousedown e pageX: ', e.pageX);
    // should set the events that are selected
    //
    // update the "days" to reflect which ones are selected
    //
    // how do we get the correct "day"? - got it through bind
    this.setState({
      selecting: true,
      selectStartHeight: e.target.offsetTop
    });
  }

  onMouseUp(day, e) {
    console.log('mouseup e: ', e.target);
    console.log('mouseup e: ', e.pageX);
    // should call "onselectevent" afterwards
    this.setState({
      selecting: false
    });
  }

  onMouseOver(day, e) {
    console.log('mouseover e: ', e);
    console.log('mouseover day: ', day);
    console.log('mouseover e: ', e.target);
    console.log('mouseover e height: ', e.target.offsetHeight);
    console.log('mouseover e offsetParent: ', e.target.offsetParent);
    console.log('mouseover e offsetLeft: ', e.target.offsetLeft);
    console.log('mouseover e offsetTop: ', e.target.offsetTop);
    // console.log('mouseover e clientX: ', e.clientX);
    // console.log('mouseover e screenX: ', e.screenX);
    // console.log('mouseover e: ', e.pageX);
    //
    // update the "days" to reflect which ones are selected
    // the days are all of the ones between selectStartHeight and e.target.offsetHeight
    // we need to update the days...but it's only one day at a time!
    const {
      selectStartHeight,
      selectEndHeight
    } = this.state;
    const updatedDay = [...day];

    day.timeslots.forEach((timeslot, idx) => {
      if(idx*19 > selectStartHeight && idx*19 < selectEndHeight) {
        updatedDay.idx.selected = true;
      }
    });

    if(this.state.selecting) {
      this.setState({
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
