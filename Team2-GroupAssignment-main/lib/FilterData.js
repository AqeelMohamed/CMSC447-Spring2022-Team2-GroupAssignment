import moment from 'moment'

import ParseHour from './ParseHour'

export function getChartData(data, typeLabels, groupLabels) {
  const offenseTypeData = typeLabels.map(() => 0)
  const offenseGroupData = groupLabels.map(() => 0)
  const dateData = []
  const timeData = []

  for (let i in data) {
    for (let j in data[i]) {
      offenseTypeData[typeLabels.indexOf(data[i][j].offense)]++
      offenseGroupData[groupLabels.indexOf(data[i][j].offense_group)]++

      if (data[i][j].start_date != '') {
        const split = data[i][j].start_date.split(', ')

        const date = split[0]
        const time = split[1]

        const formatDate = moment(new Date(date)).format('YYYY-MM')
        const dateIndex = dateData.findIndex(
          (element) => element.x === formatDate
        )
        if (dateIndex != -1) {
          dateData[dateIndex].y++
        } else {
          dateData.push({ x: formatDate, y: 1 })
        }

        const formatTime = moment(time, ['h:mm A']).format('HH')
        const timeIndex = timeData.findIndex(
          (element) => element.x._i === formatTime
        )
        if (timeIndex !== -1) {
          timeData[timeIndex].y++
        } else {
          timeData.push({ x: ParseHour(formatTime), y: 1 })
        }
      }
    }
  }
  timeData.sort((a, b) => (a.x._i > b.x._i ? 1 : -1))
  return { offenseTypeData, offenseGroupData, dateData, timeData }
}

export function sortByDate(data, dates) {
  const sorted = dates.map(() => [])

  for (let i in data) {
    const date = data[i].start_date.substr(0, data[i].start_date.indexOf(','))
    const formatDate = moment(date, 'MM/DD/YYYY')

    const index = dates.indexOf(formatDate.format('MMM YYYY'))
    if (index != -1) {
      sorted[index].push(data[i])
    }
  }
  return sorted
}
