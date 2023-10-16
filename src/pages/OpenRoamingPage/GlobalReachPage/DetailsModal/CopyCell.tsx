import * as React from 'react';
import { CopyIcon } from '@chakra-ui/icons';
import { Button, Center, IconButton, Tooltip, useClipboard } from '@chakra-ui/react';

type Props = {
  value: string;
  isCompact?: boolean;
};

const CopyCell = ({ value, isCompact }: Props) => {
  const copy = useClipboard(value);

  if (isCompact) {
    return (
      <Tooltip label={copy.hasCopied ? 'Copied!' : 'Copy'} placement="top" closeOnClick={false}>
        <IconButton
          aria-label="Copy"
          size="sm"
          onClick={copy.onCopy}
          isDisabled={value.length === 0}
          colorScheme="teal"
          icon={<CopyIcon />}
        />
      </Tooltip>
    );
  }

  return (
    <Center>
      <Button size="sm" onClick={copy.onCopy} isDisabled={value.length === 0}>
        {copy.hasCopied ? 'Copied!' : 'Copy'}
      </Button>
    </Center>
  );
};

export default CopyCell;
