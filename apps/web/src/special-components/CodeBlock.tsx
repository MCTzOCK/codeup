import {
  Box,
  Button,
  IconButton,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/dracula";
import { FaCheck, FaCopy } from "react-icons/fa";
import styles from "./codeblock.module.css";

const CodeBlock = ({
  children,
  className,
  allowCopy,
}: {
  children: any;
  className: any;
  allowCopy?: boolean;
}) => {
  if (allowCopy === undefined) {
    allowCopy = true;
  }

  const { hasCopied, onCopy } = useClipboard(children);

  const language = className.replace(/language-/, "");

  return (
    <Box pos="relative" marginTop="0.5rem" fontSize="1.2rem">
      {allowCopy ? (
        <IconButton
          colorScheme="messenger"
          pos="absolute"
          right="2"
          top="2"
          size="lg"
          onClick={onCopy}
          aria-label="Copy to clipboard"
          icon={hasCopied ? <FaCheck /> : <FaCopy />}
        />
      ) : null}

      <Highlight
        {...defaultProps}
        theme={darkTheme}
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
