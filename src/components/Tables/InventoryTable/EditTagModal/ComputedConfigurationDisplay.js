import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Center,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

const propTypes = {
  computedConfig: PropTypes.shape({
    config: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
    explanation: PropTypes.instanceOf(Array),
  }),
};
const defaultProps = {
  computedConfig: null,
};

const ComputedConfigurationDisplay = ({ computedConfig }) => {
  const { t } = useTranslation();

  if (!computedConfig || computedConfig.config === 'none') {
    return (
      <Alert status="info">
        <AlertIcon />
        {t('inventory.no_computed')}
      </Alert>
    );
  }
  return (
    <>
      <Heading size="md">{t('configurations.one')}</Heading>
      <Box border="1px" borderRadius="5px" h="calc(30vh)" overflowY="auto">
        <pre>{JSON.stringify(computedConfig.config, null, 2)}</pre>
      </Box>
      <Heading mt={4} size="md">
        {t('configurations.explanation')}
      </Heading>
      <Box border="1px" borderRadius="5px" h="calc(30vh)" overflowY="auto">
        <Accordion allowMultiple>
          {computedConfig.explanation?.map((exp) => (
            <AccordionItem key={uuid()}>
              <AccordionButton
                bg={exp.action === 'added' ? 'var(--chakra-colors-green-500)' : 'var(--chakra-colors-yellow-200)'}
                _hover={{
                  bg: exp.action === 'added' ? 'var(--chakra-colors-green-700)' : 'var(--chakra-colors-yellow-300)',
                }}
                textColor={exp.action === 'added' ? null : 'black'}
              >
                <Center>
                  {exp['from-name']}
                  {exp.action === 'added' ? '' : `: ${exp.reason}`}
                </Center>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <pre>{JSON.stringify(exp, null, 2)}</pre>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};

ComputedConfigurationDisplay.propTypes = propTypes;
ComputedConfigurationDisplay.defaultProps = defaultProps;
export default ComputedConfigurationDisplay;
