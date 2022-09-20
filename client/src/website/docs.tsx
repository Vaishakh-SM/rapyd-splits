import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import MD from "../assets/docs.md?raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export function Docs() {
  return (
    <Box m={5} p={5} border="1px" borderColor="gray.200" borderRadius={10}>
      <ReactMarkdown
        components={{
          ...ChakraUIRenderer(),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
				// @ts-ignore
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
        remarkRehypeOptions={{
          allowDangerousHtml: true,
        }}
      >
        {MD}
      </ReactMarkdown>
    </Box>
  );
}
