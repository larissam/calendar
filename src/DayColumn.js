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
  // i think we can use the unix timestamps to calculate the position...and the height
  styleEvents(events){
    const {
      day
    } = this.props;

    // stores columnEndTimes
    // can we assume one event for now?
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
          // console.log('found lowest column at: ', idx);
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
        // console.log('creating new column');
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

    // console.log('DayColumn - day: ', day.startMoment.format('LLLL'));

    // we need to render a certain style based on the events
    // but shouldn't events be an overlay? because they don't have to be on the exact increments
    // but it should be on this level - since events are on a day basis
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
