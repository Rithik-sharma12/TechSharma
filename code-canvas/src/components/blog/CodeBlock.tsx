import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = "typescript" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden bg-card border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
