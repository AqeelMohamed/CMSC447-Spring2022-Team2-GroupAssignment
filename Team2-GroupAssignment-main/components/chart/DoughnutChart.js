import { Doughnut } from 'react-chartjs-2'

export default function DoughnutChart({ labels, data }) {
  const options = {
    plugins: {
      title: {
        display: true,
        text: '# of Crimes by Group',
      },
    },
    aspectRatio: true,
  }
  const chartData = {
    labels,
    datasets: [
      {
        label: '# of crimes',
        data: data,
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }

  return <Doughnut data={chartData} options={options} />
}
