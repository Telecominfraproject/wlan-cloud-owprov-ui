import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Flex, useClipboard } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  value: PropTypes.string.isRequired,
};

const CopyTableCell = ({ value }) => {
  const { t } = useTranslation();
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Flex>
      <Box>{value}</Box>
      <Button size="xs" ml={2} onClick={onCopy}>
        {hasCopied ? t('common.copied') : t('common.copy')}
      </Button>
    </Flex>
  );
};

CopyTableCell.propTypes = propTypes;

export default React.memo(CopyTableCell);
