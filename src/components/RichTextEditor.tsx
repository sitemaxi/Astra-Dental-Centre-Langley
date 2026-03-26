import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import {
  Bold, Italic, Underline, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Image as ImageIcon
} from "lucide-react";

export interface RichTextEditorRef {
  insertImage: (url: string, alt: string) => void;
  setContent: (html: string) => void;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageInsert: () => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, title, active, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ content, onChange, onImageInsert, placeholder = "Start writing..." }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalUpdate = useRef(false);

    useImperativeHandle(ref, () => ({
      insertImage(url: string, alt: string) {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const img = `<img src="${url}" alt="${alt}" class="max-w-full rounded-lg my-4" />`;
        document.execCommand("insertHTML", false, img);
        onChange(editor.innerHTML);
      },
      setContent(html: string) {
        const editor = editorRef.current;
        if (!editor) return;
        isInternalUpdate.current = true;
        editor.innerHTML = html;
        isInternalUpdate.current = false;
      },
    }));

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;
      if (editor.innerHTML !== content && !isInternalUpdate.current) {
        isInternalUpdate.current = true;
        editor.innerHTML = content;
        isInternalUpdate.current = false;
      }
    }, [content]);

    const handleInput = useCallback(() => {
      if (editorRef.current && !isInternalUpdate.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, [onChange]);

    const exec = (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    };

    const insertLink = () => {
      const url = prompt("Enter URL:");
      if (url) exec("createLink", url);
    };

    const formatBlock = (tag: string) => exec("formatBlock", tag);

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
          <ToolbarButton onClick={() => exec("bold")} title="Bold">
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("italic")} title="Italic">
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("underline")} title="Underline">
            <Underline size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarButton onClick={() => formatBlock("h2")} title="Heading 2">
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock("h3")} title="Heading 3">
            <Heading3 size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Bullet List">
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("insertOrderedList")} title="Numbered List">
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock("blockquote")} title="Blockquote">
            <Quote size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <Link2 size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={onImageInsert} title="Insert Image">
            <ImageIcon size={15} />
          </ToolbarButton>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className="
            min-h-[400px] p-4 text-sm text-gray-800 leading-relaxed focus:outline-none
            prose prose-sm max-w-none
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2
            [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
            [&_a]:text-blue-600 [&_a]:underline
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400
          "
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
