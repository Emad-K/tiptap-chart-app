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

const ChartNode = Node.create({
  name: 'chart',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      data: {
        default: null,
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
  console.log('ChartComponent node.attrs:', node.attrs);

  const handleChartTypeChange = (event) => {
    updateAttributes({ chartType: event.target.value });
  };

  const ChartMap = {
    bar: Bar,
    pie: Pie,
    line: Line,
  };

  const ChartComponentToRender = ChartMap[chartType] || Bar;

  return (
    <NodeViewWrapper>
      {!data ? (
        <div>Error loading chart. Please check your data format.</div>
      ) : (
        <>
          {console.log('Data available for chart rendering:', data)}
          <ChartComponentToRender data={data} />
          <select value={chartType} onChange={handleChartTypeChange}>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </>
      )}
    </NodeViewWrapper>
  );
};

export default ChartNode;
