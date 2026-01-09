import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  height?: number;
  centerText?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  title,
  labels,
  data,
  backgroundColor,
  height = 300,
  centerText,
}) => {
  const defaultColors = [
    'rgba(255, 103, 35, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(245, 158, 11, 0.8)',
  ];

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(107, 114, 128)',
          padding: 15,
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
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: centerText ? '70%' : '50%',
  };

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColor || defaultColors.slice(0, labels.length),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <Doughnut options={options} data={chartData} />
      {centerText && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {centerText}
          </div>
        </div>
      )}
    </div>
  );
};
