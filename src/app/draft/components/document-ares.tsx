/* eslint-disable @typescript-eslint/no-explicit-any */
// This is my Editorjs component, better if make a seperate component and use it

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Paragraph  from "@editorjs/Paragraph" ;
import Header from "@editorjs/header";
import Raw from "@editorjs/raw";

const EDITOR_TOOLS = {
  header: {
    class: Header,
    shortcut: "CMD+H",
    inlineToolbar: true,
    config: {
      placeholder: "Enter a Header",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  paragraph: {
    class: Paragraph,
    // shortcut: 'CMD+P',
    inlineToolbar: true,
  },
  checklist: CheckList,
  table: Table,
  list: List,
  quote: Quote,
  delimiter: Delimiter,
  raw: Raw,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Editor({ data, onChange, holder }:any) {
  //add a reference to editor
  const ref:any = useRef();
  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        placeholder: "Start writting here..",
        tools: EDITOR_TOOLS as any,
        data,
        async onChange(api:any) {
          const content = await api.saver.save();
          // console.log(content, "sdfb");
          onChange(content);
        },
      });
      ref.current = editor as any;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, [data, holder, onChange]);

  return (
    <>
      <div
        id={holder}
        style={{
          width: "100%",
          minHeight: 500,
          borderRadius: " 7px",
          background: "fff",
        }}
      />
    </>
  );
}

export default Editor;