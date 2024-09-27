// src/App.js
import './App.css';
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ChartNode from './ChartNode';
import DataInputNode from './DataInputNode';

function App() {
  const editor = useEditor({
    extensions: [StarterKit, DataInputNode, ChartNode],
    content: '',
  });

  const insertDataInput = () => {
    editor.chain().focus().insertContent({ type: 'dataInput' }).run();
  };

  return (
    <div>
      <button onClick={insertDataInput}>Insert Data Input</button>
      <EditorContent editor={editor} />
    </div>
  );
}

export default App;
