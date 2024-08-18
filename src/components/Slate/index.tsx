"use client";

import React, { useState } from "react";
import { Descendant, createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ];

  return (
    <Slate editor={editor} initialValue={initialValue as Descendant[]}>
      <Editable />
    </Slate>
  );
};

export default TextEditor;
