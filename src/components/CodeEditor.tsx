import CodeMirror from "@uiw/react-codemirror";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { useStore } from "../store";
export default function CodeEditor({
  value,
  onChange,
  label = "Python source code",
  disabled = false,
}: {
  value: string;
  onChange: (s: string) => void;
  label?: string;
  disabled?: boolean;
}) {
  const { data } = useStore();
  return (
    <CodeMirror
      value={value}
      editable={!disabled}
      height="340px"
      extensions={[
        python(),
        ...(data.theme === "dark"
          ? [
              EditorView.theme({
                ".cm-content": { color: "#e3eafa" },
                ".cm-activeLine": { backgroundColor: "#28354b" },
              }),
              syntaxHighlighting(
                HighlightStyle.define([
                  { tag: tags.keyword, color: "#cdbdff" },
                  {
                    tag: [tags.variableName, tags.function(tags.variableName)],
                    color: "#dce8ff",
                  },
                  { tag: tags.number, color: "#ffd4a6" },
                  { tag: tags.string, color: "#b9e5c5" },
                  { tag: tags.comment, color: "#b0bfd4" },
                  { tag: [tags.operator, tags.punctuation], color: "#c7d9f6" },
                ]),
              ),
            ]
          : []),
        EditorView.contentAttributes.of({ "aria-label": label }),
      ]}
      onChange={onChange}
      theme={
        data.theme === "dark"
          ? EditorView.theme(
              {
                "&": { backgroundColor: "#1c2433", color: "#e3eafa" },
                ".cm-gutters": {
                  backgroundColor: "#182131",
                  color: "#a1b2cb",
                  border: "none",
                },
                ".cm-cursor": { borderLeftColor: "#ffffff" },
                ".cm-activeLineGutter": { backgroundColor: "#28354b" },
              },
              { dark: true },
            )
          : "light"
      }
      aria-label={label}
      basicSetup={{ tabSize: 4 }}
    />
  );
}
