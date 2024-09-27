// src/App.js
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ChartNode from './ChartNode';

function App() {
  const editor = useEditor({
    extensions: [StarterKit, ChartNode],
    content: '<p>Click the button to insert a chart.</p>',
  });

  const insertChart = () => {
    editor.chain().focus().insertContent({ type: 'chart' }).run();
  };

  return (
    <div>
      <button onClick={insertChart}>Insert Chart</button>
      <EditorContent editor={editor} />
    </div>
  );
}

export default App;
