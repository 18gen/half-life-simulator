import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type ChartData = {
    times: number[]
    concentrations: number[]
}

export default function DrugChart({ data }: { data: ChartData }) {
    const chartData = {
        labels: data.times.map(t => `${t.toFixed(1)}h`),
        datasets: [
            {
                label: '薬物濃度 (ng/mL)',
                data: data.concentrations,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '時間 (h)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: '濃度 (ng/mL)',
                },
            },
        },
    }

    return <Line data={chartData} options={options} />
}
