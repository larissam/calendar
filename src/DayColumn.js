import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import './DayColumn.css';

const DayColumnCell = ({ moment, selected, onCellClick }) => (
  <div
    className={ classnames('DayColumnCell', { 'selected' : selected }) }
    onClick={ () => onCellClick(moment) }
    >
  </div>
);

class DayColumn extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render(){
    const {
      day,
      onCellClick,
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
            onCellClick={ onCellClick }
            />
        )) }
      </td>
    );
  }
}
export default DayColumn;
