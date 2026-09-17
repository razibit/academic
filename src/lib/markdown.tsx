import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { publicAssetUrl } from "./routes";

export function Markdown({ content, className = "markdown" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} {...props} target={href?.startsWith("/") ? undefined : "_blank"} rel={href?.startsWith("/") ? undefined : "noreferrer"}>
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => <img src={typeof src === "string" ? publicAssetUrl(src) : undefined} alt={alt ?? ""} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}


