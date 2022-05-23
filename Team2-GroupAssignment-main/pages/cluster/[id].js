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

import style from '../../styles/Offense.module.css'

import { useRouter } from 'next/router'
import { useState } from 'react'
import { Typography, Grid, Slider } from '@mui/material'

import BarChart from '../../components/chart/BarChart'
import LineChart from '../../components/chart/LineChart'
import DoughnutChart from '../../components/chart/DoughnutChart'
import { getChartData, sortByDate } from '../../lib/FilterData'
import ParseHour from '../../lib/ParseHour'

import Labels from '../../data/Labels.json'

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

export default function Cluster({ data, filtered }) {
  const router = useRouter()
  const id = router.query.id

  const [chartData, setChartData] = useState(filtered)

  const months_range = Labels.months_range

  const marks = []
  for (let i = 0; i < 25; i++) {
    if (i % 4 == 0) {
      marks.push({ value: i, label: months_range[i] })
    } else {
      marks.push({ value: i })
    }
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

  const { offenseTypeData, offenseGroupData, dateData, timeData } =
    getChartData(chartData, offenseTypeLabels, offenseGroupLabels)

  return (
    <main>
      <title>Cluster {id}</title>
      <div className={style.title}>
        <h1>Cluster {id}</h1>
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LineChart
              title={'# of Crimes per Month'}
              data={dateData}
              unit={'month'}
            />
          </Grid>
          <Grid item xs={6}>
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

Cluster.getInitialProps = async (ctx) => {
  const id = ctx.query.id
  const res = await fetch(`http://localhost:3000/api/cluster/${id}`)
  const json = await res.json()

  const filtered = sortByDate(json, Labels.months_range)

  return { data: json, filtered: filtered }
}
