import React, { Component } from 'react';
import classnames from 'classnames';

import { CELL_HEIGHT, DAY_COLUMN_HEIGHT, MS_IN_DAY } from './enums';

import './DayColumn.css';
import './EventOverlay.css';

const DayColumnCell = ({ moment, selected, onMouseDown }) => (
  <div
    className={ classnames('DayColumnCell', { 'selected' : selected }) }
    onMouseDown={ onMouseDown }
    >
  </div>
);

// style this
const EventOverlay = ({ name, description, styles }) => (
  <div
    className='EventOverlay'
    style={ styles }
    >
    { name }
  </div>
);

class DayColumn extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  // needs to be moved to a store
  // for each event, calculate - 'top' is based on startDate, 'height' is based on duration
  // also, for overlapping events, we need to adjust the 'left' based on the number of overlapping events (use percentage)
  styleEvents(events){
    const {
      day
    } = this.props;

    const columnEndTimes = [];

    return events.map((event) => {
      const { startDate, endDate } = event;

      const startOfDayUnix = day.startMoment.valueOf();
      const endOfDayUnix = day.endMoment.valueOf();

      let styles = {
        top:`${((startDate - startOfDayUnix)/(endOfDayUnix - startOfDayUnix))*100}%`,
        height: (DAY_COLUMN_HEIGHT/MS_IN_DAY)*(endDate-startDate)
      };

      // columns - this just offsets everything 45px*the col. We might want to change this to a percentage based on the total # of cols in the future.
      // loop through all the column event times and find the lowest column with no overlap
      for (let [idx, columnEndTime] of columnEndTimes.entries()) {
        if (startDate >= columnEndTime) {
          columnEndTimes[idx] = endDate;

          styles = {
            ...styles,
            left: `${idx*45}px`,
            zIndex: idx
          };

          break;
        }
      }

      // if there is STILL overlap, then we need to make a new column
      // with the current event's endTime there.
      if(!styles.left) {
        columnEndTimes.push(endDate);

        styles = {
          ...styles,
          left: `${(columnEndTimes.length - 1)*45}px`,
          zIndex: columnEndTimes.length - 1
        };

      }

      return {
        ...event,
        styles
      };
    });
  }

  render(){
    const {
      day,
      events,
      onMouseDown,
      onMouseUp,
      onMouseOver
    } = this.props;

    return (
      <td
        className='DayColumn'
        onMouseDown={ onMouseDown }
        onMouseUp={ onMouseUp }
        onMouseOver={ onMouseOver }
        >
        { day.timeslots.map(({ moment, selected }) => (
          <DayColumnCell
            selected={ selected }
            moment={ moment }
            onMouseDown={ onMouseDown }
            />
        )) }
        { this.styleEvents(events).map(({ name, description, styles }) => (
          <EventOverlay
            name={ name }
            description={ description }
            styles={ styles }
            />
        )) }
      </td>
    );
  }
}

DayColumn.props = {
  day: React.PropTypes.object,
  events: React.PropTypes.array,
  onMouseDown: React.PropTypes.func,
  onMouseUp: React.PropTypes.func,
  onMouseOver: React.PropTypes.func
}

export default DayColumn;
