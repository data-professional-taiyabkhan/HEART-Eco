import { Fragment } from "react";

// Renders the assistant's light markdown safely (no HTML injection):
// **bold**, "# heading" lines, and "- " / "* " bullets. Newlines are kept by
// the parent's whitespace-pre-wrap.
function renderInline(text: string, keyPrefix: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
            <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
            </strong>
        ) : (
            <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>
        )
    );
}

export default function ChatText({ content }: { content: string }) {
    const lines = content.split("\n");
    return (
        <>
            {lines.map((line, i) => {
                const heading = line.match(/^#{1,6}\s+(.*)$/);
                const bullet = line.match(/^\s*[-*]\s+(.*)$/);
                let body;
                if (heading) body = <strong className="font-semibold text-slate-900">{heading[1].replace(/\*\*/g, "")}</strong>;
                else if (bullet) body = <>• {renderInline(bullet[1], `l${i}`)}</>;
                else body = renderInline(line, `l${i}`);
                return (
                    <Fragment key={i}>
                        {body}
                        {i < lines.length - 1 ? "\n" : null}
                    </Fragment>
                );
            })}
        </>
    );
}
