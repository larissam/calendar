import moment from 'moment';

export const events = [{
  name: 'Meeting @ 3:15pm - 5pm',
  description: '2 hour long meeting',
  startDate: moment({ year: 2017, month: 5, day: 20, hour: 15, minute: 15 }).valueOf(),
  endDate: moment({ year: 2017, month: 5, day: 20, hour: 17, minute: 0 }).valueOf(),
}, {
  name: 'Meeting @ 4pm - 6pm',
  description: '1 hour long meeting',
  startDate: moment({ year: 2017, month: 5, day: 20, hour: 16, minute: 0 }).valueOf(),
  endDate: moment({ year: 2017, month: 5, day: 20, hour: 18, minute: 0 }).valueOf(),
}, {
  name: 'Meeting @ 5pm - 6pm',
  description: '1 hour long meeting',
  startDate: moment({ year: 2017, month: 5, day: 20, hour: 17, minute: 0 }).valueOf(),
  endDate: moment({ year: 2017, month: 5, day: 20, hour: 18, minute: 0 }).valueOf(),
}, {
  name: 'Meeting @ 5pm - 5:30pm',
  description: '1 hour long meeting',
  startDate: moment({ year: 2017, month: 5, day: 20, hour: 17, minute: 0 }).valueOf(),
  endDate: moment({ year: 2017, month: 5, day: 20, hour: 17, minute: 30 }).valueOf(),
}, {
  name: 'Breakfast',
  description: 'Eating good food',
  startDate: moment({ year: 2017, month: 5, day: 20, hour: 9, minute: 0 }).valueOf(),
  endDate: moment({ year: 2017, month: 5, day: 20, hour: 9, minute: 30 }).valueOf(),
}, {
  name: 'Dinner',
  description: 'Moar good food',
  startDate: moment({ year: 2017, month: 5, day: 20, hour: 18, minute: 30 }).valueOf(),
  endDate: moment({ year: 2017, month: 5, day: 20, hour: 19, minute: 0 }).valueOf(),
}];
