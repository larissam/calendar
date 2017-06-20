import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import './TimeColumn.css';

export const TimeColumn = () => (
  <td className='TimeColumn'>
    { [...Array(24).keys()].map((key) => (
      <TimeColumnCell
        value={ moment({ hour: key }).format('LT') }
        />
    )) }
  </td>
);

const TimeColumnCell = ({ value }) => (
  <div className='TimeColumnCell'>
  { value }
  </div>
);
