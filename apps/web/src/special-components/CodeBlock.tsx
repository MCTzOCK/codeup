import {
  Box,
  Button,
  IconButton,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/vsDark";
import { FaCheck, FaCopy } from "react-icons/fa";
import styles from "./codeblock.module.css";

const CodeBlock = ({
  children,
  className,
  allowCopy,
  ...props
}: {
  children: any;
  className: any;
  allowCopy?: boolean;
  [key: string]: any;
}) => {
  if (allowCopy === undefined) {
    allowCopy = true;
  }

  const { hasCopied, onCopy } = useClipboard(children);

  const language = className.replace(/language-/, "");

  return (
    <Box
      pos="relative"
      marginTop="0.5rem"
      fontSize="1.2rem"
      rounded={"xl"}
      {...props}
    >
      {allowCopy ? (
        <IconButton
          variant={"brand"}
          pos="absolute"
          right="2"
          top="2"
          size="sm"
          onClick={onCopy}
          aria-label="Copy to clipboard"
          icon={hasCopied ? <FaCheck /> : <FaCopy />}
        />
      ) : null}

      <Highlight
        {...defaultProps}
        theme={theme}
        code={children}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} ${styles.wrapper}`}
            style={{ ...style }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                <span className={styles.lineNo}>{i + 1}</span>

                <span className={styles.lineContent}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  );
};

export default CodeBlock;

const theme: typeof darkTheme = {
  plain: {
    color: "#9CDCFE",
    backgroundColor: "#000000",
  },
  styles: [
    {
      types: ["prolog"],
      style: {
        color: "rgb(0, 0, 128)",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "rgb(106, 153, 85)",
      },
    },
    {
      types: ["builtin", "changed", "keyword", "interpolation-punctuation"],
      style: {
        color: "#F7DE1F",
      },
    },
    {
      types: ["number", "inserted"],
      style: {
        color: "rgb(181, 206, 168)",
      },
    },
    {
      types: ["constant"],
      style: {
        color: "rgb(100, 102, 149)",
      },
    },
    {
      types: ["attr-name", "variable"],
      style: {
        color: "rgb(86, 156, 214)",
      },
    },
    {
      types: ["deleted", "string", "attr-value", "template-punctuation"],
      style: {
        color: "rgb(206, 145, 120)",
      },
    },
    {
      types: ["selector"],
      style: {
        color: "rgb(215, 186, 125)",
      },
    },
    {
      // Fix tag color
      types: ["tag"],
      style: {
        color: "rgb(78, 201, 176)",
      },
    },
    {
      // Fix tag color for HTML
      types: ["tag"],
      languages: ["markup"],
      style: {
        color: "rgb(86, 156, 214)",
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "rgb(212, 212, 212)",
      },
    },
    {
      // Fix punctuation color for HTML
      types: ["punctuation"],
      languages: ["markup"],
      style: {
        color: "#808080",
      },
    },
    {
      types: ["function"],
      style: {
        color: "rgb(220, 220, 170)",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "rgb(78, 201, 176)",
      },
    },
    {
      types: ["char"],
      style: {
        color: "rgb(209, 105, 105)",
      },
    },
  ],
};
