import styles from '../styles/Time.module.css'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { useState } from 'react'
import { Grid, Typography, Slider } from '@mui/material'

import LineChart from '../components/chart/LineChart'
import { getChartData, sortByDate } from '../lib/FilterData'
import ParseHour from '../lib/ParseHour'

import Labels from '../data/Labels.json'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

export default function Time({ data, filtered }) {
  const [chartData, setChartData] = useState(filtered)

  const months_range = Labels.months_range

  const marks = []
  for (let i = 0; i < 25; i += 4) {
    marks.push({ value: i, label: months_range[i] })
  }

  const [value, setValue] = useState([0, 24])

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return
    }

    setValue(newValue)

    const slice = filtered.slice(value[0], value[1] + 1)
    setChartData(slice)
  }

  const offenseTypeLabels = Labels.offense_types
  const offenseGroupLabels = Labels.offense_group

  const { dateData, timeData } = getChartData(
    chartData,
    offenseTypeLabels,
    offenseGroupLabels
  )
  return (
    <main>
      <title>Time of Crimes</title>
      <div className={styles.title}>
        <h1>Distribution of Crimes by Time</h1>
      </div>
      <div>
        <Typography align="right" variant="body2">
          Filter Crime Data Based on Start and End Dates
        </Typography>
        <Slider
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => months_range[v]}
          marks={marks}
          min={0}
          max={24}
        />
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs>
            <LineChart
              title={'# of Crimes per Month'}
              data={dateData}
              unit={'month'}
            />
          </Grid>
          <Grid item xs>
            <LineChart
              title={'# of Crimes per Hour'}
              data={timeData}
              unit={'hour'}
              minUnit={ParseHour(0)}
            />
          </Grid>
        </Grid>
      </div>
    </main>
  )
}

Time.getInitialProps = async (ctx) => {
  // console.log('Initial props')
  const id = ctx.query.id
  const res = await fetch(`http://localhost:3000/api/cluster/`)
  const json = await res.json()

  const filtered = sortByDate(json, Labels.months_range)
  // console.log(filtered)

  return { data: json, filtered: filtered }
}
