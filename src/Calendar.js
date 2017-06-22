import React, { Component } from 'react';
import Modal from 'react-modal';
import CalendarHeaderRow from './CalendarHeaderRow';
import CalendarGrid from './CalendarGrid';

import './Calendar.css';

import { events } from './events'; // mock data

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.onCellRangeSelect = this.onCellRangeSelect.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.createEvent = this.createEvent.bind(this);

    this.getFieldChangeHandler = fieldName => e => this.onFieldChange(fieldName, e);

    // should have start/end dates too
    this.state = {
      events: events,
      isEditEventModalOpen: false,
      selectedTimeRange: {},
      name: '',
      description: ''
    };
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.target.value
    });
  }

  onCellRangeSelect(selectedTimeRange) {
    this.setState({
      selectedTimeRange
    }, () => {
      this.showModal();
    })
  }

  // add event to state
  createEvent(){
    const {
      events,
      name,
      description,
      selectedTimeRange
    } = this.state;

    const { startMoment, endMoment } = selectedTimeRange;
    console.log('createEvent - day: ', startMoment.format('LLLL'));
    // console.log('endMoment: ', endMoment);

    const updatedEvents = [...events];
    updatedEvents.push({
      name,
      description,
      startDate: startMoment.valueOf(),
      endDate: endMoment.valueOf()
    });

    this.setState({
      events: updatedEvents
    }, () => {
      this.hideModal();
    });
  }

  showModal(){
    this.setState({
      isEditEventModalOpen: true
    });
  }

  hideModal(){
    this.setState({
      isEditEventModalOpen: false,
      name: '',
      description: ''
    });
  }

  maybeRenderModal(){
    const {
      selectedTimeRange,
      isEditEventModalOpen,
      name,
      description
    } = this.state;

    const { startMoment, endMoment } = selectedTimeRange;

    if(startMoment && endMoment) {
    console.log('mayberendermodal - day: ', startMoment.format('LLLL'));
      return (
        <Modal
          isOpen={ isEditEventModalOpen }
          onRequestClose={ this.hideModal }
          contentLabel='Edit Event'
          >
          <div>
            <span className='close-modal' onClick={ this.hideModal }>X</span>
            <p>Selected Time: { `${startMoment.format('LLLL')}-${endMoment.format('LLLL')}` }</p>
            <form>
              <label>
                Event name
                <input
                  type='text'
                  name='eventName'
                  value={ name }
                  onChange={ this.getFieldChangeHandler('name') }
                  />
              </label>
              <label>
                Event description
                <input
                  type='text'
                  name='eventDescription'
                  value={ description }
                  onChange={ this.getFieldChangeHandler('description') }
                  />
              </label>
            </form>
            <button onClick={ this.createEvent }>Submit</button>
          </div>
        </Modal>
      );
    }
  }

  render(){
    const {
      events,
      isEditEventModalOpen,
      selectedTimeRange
    } = this.state;

    return (
      <div>
        <table className='Calendar'>
          <CalendarHeaderRow />
          <CalendarGrid
            events={ events }
            onCellRangeSelect={ this.onCellRangeSelect }
            />
        </table>
        { this.maybeRenderModal() }
      </div>
    );
  }
}

export default Calendar;
