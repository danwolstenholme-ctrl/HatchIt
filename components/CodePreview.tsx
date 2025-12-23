interface CodePreviewProps {
  code: string
}

export default function CodePreview({ code }: CodePreviewProps) {
  return (
    <div className="flex-1 overflow-auto bg-zinc-900">
      {code ? (
        <pre className="p-4 text-sm text-zinc-300 font-mono whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      ) : (
        <div className="p-4 text-sm text-zinc-600">
          Generated code will appear here.
        </div>
      )}
    </div>
  )
}