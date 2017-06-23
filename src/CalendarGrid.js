import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import { TimeColumn } from './TimeColumn';
import DayColumn from './DayColumn';

import { CELL_HEIGHT } from './enums';

import { getCalendarDays } from './utils/getCalendarDays';

import './CalendarGrid.css';


class CalendarGrid extends Component {
  constructor(props) {
    super(props);

    this.getMouseDownHandler = day => e => this.onMouseDown(day, e);
    this.getMouseUpHandler = day => e => this.onMouseUp(day, e);
    this.getMouseOverHandler = day => e => this.onMouseOver(day, e);

    const startOfWeek = moment().startOf('week');

    this.state = {
      startDate: startOfWeek,
      days: getCalendarDays(startOfWeek),
      selecting: false,
      selectingDay: null,
      selectStartHeight: 0,
      selectEndHeight: 0
    };
  }

  // the day this is selecting is fine.
  // need to make sure this is for left click only!
  onMouseDown(day, e) {
    // i want to save the moment/or the day cell here.
    // const { days } = this.state;
    const selectStartHeight = e.target.offsetTop;
    const selectStartCell = day.timeslots[Math.floor(selectStartHeight/CELL_HEIGHT) + 1];
    this.setState({
      selecting: true,
      selectingDay: day,
      selectStartHeight,
      selectStartCell
    });
  }

  onMouseUp(day, e) {
    const {
      selectingDay,
      days,
      selectStartHeight,
      selectEndHeight,
      selectStartCell
    } = this.state;

    if(day === selectingDay) {
      // if there's no endCell, then we just want one cell over
      const selectEndCell = selectEndHeight ? day.timeslots[Math.floor(selectEndHeight/CELL_HEIGHT) + 1] : day.timeslots[Math.floor(selectStartHeight/CELL_HEIGHT) + 2];

      // move to separate "modifiers" object
      day.timeslots.forEach((timeslot, idx, timeslots) => {
        timeslots[idx] = {
          ...timeslot,
          selected: false
        };
      });

      this.setState({
        selecting: false,
        selectStartHeight: 0,
        selectEndHeight: 0,
      }, () => {
        this.props.onCellRangeSelect({
          startMoment: selectStartCell.moment,
          endMoment: selectEndCell.moment
        });
      });
    }
  }

  onMouseOver(day, e) {
    const {
      selectingDay,
      selectStartHeight,
      selecting,
      days
    } = this.state;

    if(day === selectingDay && selecting) {
      const selectEndHeight = e.target.offsetTop;

      // move to separate "modifiers" object
      day.timeslots.forEach((timeslot, idx, timeslots) => {
        const height = idx*CELL_HEIGHT;
        const selected = height > selectStartHeight && height < selectEndHeight;

        timeslots[idx] = {
          ...timeslot,
          selected
        };
      });

      this.setState({
        selectEndHeight,
        days
      });
    }
  }

  // this data transformation should go into a store
  // take in the event props, sort them
  // and split them out by day
  splitEvents(){
    const { events } = this.props;
    const { days } = this.state;
    const sortedEvents = events.sort((firstEvent, secondEvent) => {
      const firstStartDate = moment(firstEvent.startDate);
      const secondStartDate = moment(secondEvent.startDate);

      if(firstStartDate.isBefore(secondStartDate)) {
        return -1;
      } else if (firstStartDate.isSame(secondStartDate)) {
        return 0;
      } else {
        return 1;
      }
    });

    // what if the dates are out of range?
    // i should be able to query the dates out of the BE
    // for now we can assume within range
    const result = [...Array(7)].map(el => new Array());
    sortedEvents.forEach((event) => {
      const startDate = moment(event.startDate);

      days.forEach((day, idx) => {
        if(startDate.isBetween(day.startMoment, day.endMoment)) {
          result[idx].push(event);
        }
      });
    });

    return result;
  }

  render() {
    const { events } = this.props;
    const { days } = this.state;

    const processedEvents = this.splitEvents(events); // should be in a store

    // reconsider how we map events to days...
    // this doesn't seem to be passing in the right day?
    return (
      <tr className='CalendarGrid'>
        <TimeColumn />
        { days.map((day, idx) => (
          <DayColumn
            day={ day }
            events={ processedEvents[idx] }
            onMouseDown={ this.getMouseDownHandler(day) }
            onMouseUp={ this.getMouseUpHandler(day) }
            onMouseOver={ this.getMouseOverHandler(day) }
            />
        ))}
      </tr>
    );
  }
}

CalendarGrid.props = {
  events: React.PropTypes.array
};

export default CalendarGrid;
