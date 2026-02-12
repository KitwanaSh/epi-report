"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownBlockProps {
  content: string;
}

export default function MarkdownBlock({ content }: MarkdownBlockProps) {
  return (
    <div className="report-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[28px] font-bold text-text-primary mt-8 mb-4 pb-3 border-b-2 border-primary">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[22px] font-bold text-text-primary mt-6 mb-3 pb-2 border-b border-surface-border">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[18px] font-bold text-primary-dark mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[15px] leading-relaxed text-text-primary mb-3">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-text-primary">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] leading-relaxed text-text-primary pl-1">
              {children}
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}