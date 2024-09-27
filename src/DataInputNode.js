// src/DataInputNode.js
import React, { useState } from 'react';
import {
  Node,
  mergeAttributes,
  ReactNodeViewRenderer,
  NodeViewWrapper,
} from '@tiptap/react';
import chroma from 'chroma-js';

const DataInputNode = Node.create({
  name: 'dataInput',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      rawData: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="data-input"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'data-input' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DataInputComponent);
  },
});

const DataInputComponent = ({ node, editor, getPos, updateAttributes }) => {
  const [value, setValue] = useState(node.attrs.rawData || '');

  const addChart = () => {
    const currentPos = getPos();
    const rawData = value;
    console.log('Data captured from DataInputNode:', rawData);

    const parsedData = parseCSVData(rawData);

    if (parsedData) {
      editor
        .chain()
        .focus()
        .insertContentAt(currentPos + node.nodeSize, [
          { type: 'chart', attrs: { data: parsedData } },
          { type: 'paragraph' },
        ])
        .deleteRange({ from: currentPos, to: currentPos + node.nodeSize })
        .setTextSelection(currentPos + 1)
        .run();
    } else {
      alert('Error parsing data. Please check your data format.');
    }
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    updateAttributes({ rawData: inputValue });
  };

  const parseCSVData = (rawData) => {
    console.log('Raw data received in parseCSVData:', rawData);
    try {
      const lines = rawData.trim().split('\n');
      console.log('Lines after splitting:', lines);
      const labels = [];
      const values = [];

      lines.forEach((line, index) => {
        const [label, value] = line.split(',');
        console.log(`Line ${index}: label="${label}", value="${value}"`);
        if (label !== undefined && value !== undefined) {
          labels.push(label.trim());
          values.push(parseFloat(value.trim()));
        } else {
          console.warn(`Line ${index} is invalid and will be skipped.`);
        }
      });

      if (labels.length === 0 || values.length === 0) {
        throw new Error('No valid data found.');
      }

      const colorScale = chroma.scale('Set2').colors(labels.length);

      return {
        labels,
        datasets: [
          {
            label: 'Dataset',
            data: values,
            backgroundColor: colorScale,
          },
        ],
      };
    } catch (error) {
      console.error('Error parsing CSV data:', error);
      return null;
    }
  };

  return (
    <NodeViewWrapper>
      <div className="data-input-container">
        <h3>Enter CSV Data:</h3>
        <textarea
          className="data-input-content"
          value={value}
          onChange={handleChange}
          placeholder="e.g., January, 100"
        />
      </div>
      <button onClick={addChart}>Add Chart</button>
    </NodeViewWrapper>
  );
};

export default DataInputNode;
