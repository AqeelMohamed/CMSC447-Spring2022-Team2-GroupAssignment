import moment from 'moment'

export default function ParseHour(hour) {
  return moment(hour, 'HH')
}
