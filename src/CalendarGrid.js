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

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);

    const startOfWeek = moment().startOf('week');

    this.state = {
      startDate: startOfWeek,
      days: getCalendarDays(startOfWeek),
      selecting: false,
      selectStartHeight: 0,
      selectEndHeight: 0
    };
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
      this.props.onCellRangeSelect(selectStartCell, selectEndCell);
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

  // convert the bind to arrow functions
  render() {
    const { events } = this.props;
    const { days } = this.state;

    const processedEvents = this.splitEvents(events); // should be in a store

    // reconsider how we map events to days...
    return (
      <tr className='CalendarGrid'>
        <TimeColumn />
        { days.map((day, idx) => (
          <DayColumn
            day={ day }
            events={ processedEvents[idx] }
            onCellClick={ this.props.onCellClick }
            onMouseDown={ this.onMouseDown.bind(null, day) }
            onMouseUp={ this.onMouseUp.bind(null, day) }
            onMouseOver={ this.onMouseOver.bind(null, day) }
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
