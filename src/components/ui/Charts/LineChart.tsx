import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }>;
  yAxisLabel?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  labels,
  datasets,
  yAxisLabel,
  height = 300,
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(107, 114, 128)',
        },
      },
      title: {
        display: true,
        text: title,
        color: 'rgb(31, 41, 55)',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
          color: 'rgb(107, 114, 128)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || 'rgb(255, 103, 35)',
      backgroundColor: dataset.backgroundColor || 'rgba(255, 103, 35, 0.1)',
      tension: dataset.tension !== undefined ? dataset.tension : 0.3,
    })),
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line options={options} data={chartData} />
    </div>
  );
};
