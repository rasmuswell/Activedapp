import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { StatsChartProps } from "../Interfaces/types";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const labels = data.map((item) => new Date(item.timestamp).toLocaleString());

  const chartData = {
    labels,
    datasets: [
      {
        label: "CPU Usage (%)",
        data: data.map((item) => parseFloat(item.cpuUsage)),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Memory Usage (GB)",
        data: data.map((item) => item.memoryUsage / 1024),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Actions",
        data: data.map((item) => item.actions),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#fff", // White text for the legend
        },
      },
      title: {
        display: true,
        text: "System Statistics Over Time",
        color: "#fff", // White text for the title
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // White text for x-axis labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Optional: white-ish grid lines
        },
      },
      y: {
        ticks: {
          color: "#fff", // White text for y-axis labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Optional: white-ish grid lines
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default StatsChart;
