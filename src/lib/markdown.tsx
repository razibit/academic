import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { publicAssetUrl, routeUrl } from "./routes";

export function Markdown({ content, className = "markdown" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, title }) => (
            <a href={href?.startsWith("/") ? routeUrl(href) : href} title={title} target={href?.startsWith("/") ? undefined : "_blank"} rel={href?.startsWith("/") ? undefined : "noreferrer"}>
              {children}
            </a>
          ),
          img: ({ src, alt, title }) => <img src={typeof src === "string" ? publicAssetUrl(src) : undefined} alt={alt ?? ""} title={title} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
