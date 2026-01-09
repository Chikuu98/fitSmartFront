import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
  yAxisLabel?: string;
  height?: number;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  labels,
  datasets,
  yAxisLabel,
  height = 300,
  stacked = false,
}) => {
  const options: ChartOptions<'bar'> = {
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
        stacked,
        beginAtZero: true,
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
        stacked,
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
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor:
        dataset.backgroundColor ||
        `rgba(255, 103, 35, ${0.8 - index * 0.2})`,
      borderColor: dataset.borderColor || 'rgb(255, 103, 35)',
      borderWidth: dataset.borderWidth !== undefined ? dataset.borderWidth : 1,
    })),
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};
