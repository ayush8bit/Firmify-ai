import { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import type { GeneratedFile } from "../types";

type FirmwareViewerProps = {
  files: GeneratedFile[];
};

export function FirmwareViewer({ files }: FirmwareViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string>(files[0]?.filename ?? "");

  const activeFile = useMemo(
    () => files.find((file) => file.filename === selectedFile) ?? files[0],
    [files, selectedFile],
  );

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Firmware Preview</p>
          <h3 className="mt-2 font-display text-xl text-white">Generated project files</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-stone-300">{files.length} files</div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {files.map((file) => (
          <button
            type="button"
            key={file.filename}
            onClick={() => setSelectedFile(file.filename)}
            className={`rounded-full px-3 py-2 text-sm transition ${
              activeFile?.filename === file.filename ? "bg-accent text-stone-950" : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            {file.filename}
          </button>
        ))}
      </div>

      {activeFile ? (
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
          <SyntaxHighlighter
            language={activeFile.language === "makefile" ? "makefile" : activeFile.language}
            style={oneDark}
            customStyle={{ margin: 0, minHeight: "28rem", background: "#09090b", fontSize: "0.9rem" }}
            showLineNumbers
          >
            {activeFile.content}
          </SyntaxHighlighter>
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-white/15 p-12 text-center text-stone-400">
          Generate firmware to inspect the project files here.
        </div>
      )}
    </section>
  );
}
