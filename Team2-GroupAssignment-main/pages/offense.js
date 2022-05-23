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

import style from '../styles/Offense.module.css'

import { useState } from 'react'
import { Typography, Slider, Grid } from '@mui/material'

import BarChart from '../components/chart/BarChart'
import DoughnutChart from '../components/chart/DoughnutChart'
import { getChartData, sortByDate } from '../lib/FilterData'

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

export default function Offense({ data, filtered }) {
  const offenseTypeLabels = Labels.offense_types
  const offenseGroupLabels = Labels.offense_group

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

  const { offenseTypeData, offenseGroupData } = getChartData(
    chartData,
    offenseTypeLabels,
    offenseGroupLabels
  )

  return (
    <main>
      <title>Offense Type</title>
      <div className={style.title}>
        <h1>Distribution of Crimes by Offense</h1>
      </div>
      <div>
        <Typography align="right" variant="body2">
          Filter Crime Data Based on Start and End Dates
        </Typography>
        <Slider
          getAriaLabel={() => 'Select Range of Dates'}
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
          <Grid item xs={8}>
            <BarChart labels={offenseTypeLabels} data={offenseTypeData} />
          </Grid>
          <Grid item xs={4}>
            <DoughnutChart
              labels={offenseGroupLabels}
              data={offenseGroupData}
            />
          </Grid>
        </Grid>
      </div>
    </main>
  )
}

Offense.getInitialProps = async (ctx) => {
  const id = ctx.query.id
  const res = await fetch(`http://localhost:3000/api/cluster/`)
  const json = await res.json()

  const filtered = sortByDate(json, Labels.months_range)

  return { data: json, filtered: filtered }
}
