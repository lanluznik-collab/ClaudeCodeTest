import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
  // Ids for the H2 headings that appear in `content`, in document order —
  // computed once (via extractH2Headings on the full post body) so the
  // anchors here match the "Na tej strani" TOC exactly, even when the body
  // is rendered in two chunks (main content / references) around a CTA box.
  headingIds: string[];
}

export function MarkdownBody({ content, headingIds }: Props) {
  let h2Index = 0;

  return (
    <div className="blog-article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: (props) => {
            const id = headingIds[h2Index];
            h2Index += 1;
            return <h2 id={id} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
