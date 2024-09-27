// src/ChartNode.js
import React from 'react';
import { Node, mergeAttributes, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default Node.create({
  name: 'chart',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      data: {
        default: {
          labels: ['January', 'February', 'March'],
          datasets: [
            {
              label: 'Sample Data',
              data: [65, 59, 80],
              backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
            },
          ],
        },
      },
      chartType: {
        default: 'bar',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="chart"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'chart' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartComponent);
  },
});

const ChartComponent = ({ node, updateAttributes }) => {
  const { data, chartType } = node.attrs;

  const handleDataChange = (event) => {
    const newData = {
      ...data,
      datasets: [
        {
          ...data.datasets[0],
          data: event.target.value.split(',').map(Number),
        },
      ],
    };
    updateAttributes({ data: newData });
  };

  const handleLabelsChange = (event) => {
    const newLabels = event.target.value.split(',');
    const newData = {
      ...data,
      labels: newLabels,
    };
    updateAttributes({ data: newData });
  };

  const handleChartTypeChange = (event) => {
    updateAttributes({ chartType: event.target.value });
  };

  const ChartMap = {
    bar: Bar,
    pie: Pie,
    line: Line,
  };

  const Chart = ChartMap[chartType] || Bar;

  return (
    <NodeViewWrapper>
      <Chart data={data} />
      <input
        type="text"
        value={data.labels.join(',')}
        onChange={handleLabelsChange}
        placeholder="Enter labels separated by commas"
      />
      <input
        type="text"
        value={data.datasets[0].data.join(',')}
        onChange={handleDataChange}
        placeholder="Enter data separated by commas"
      />
      <select value={chartType} onChange={handleChartTypeChange}>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="line">Line Chart</option>
      </select>
    </NodeViewWrapper>
  );
};
