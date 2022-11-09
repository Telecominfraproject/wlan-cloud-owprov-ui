import React from 'react';
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
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import RefreshButton from 'components/Buttons/RefreshButton';
import { useGetComputedConfiguration } from 'hooks/Network/Inventory';

type Props = {
  serialNumber: string;
};

const ComputedConfigurationDisplay = ({ serialNumber }: Props) => {
  const { t } = useTranslation();
  const {
    data: computedConfig,
    isFetching,
    refetch,
  } = useGetComputedConfiguration({
    serialNumber,
    enabled: true,
  });

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
      <Flex mb={2}>
        <Heading size="md" my="auto">
          {t('configurations.one')}
        </Heading>
        <Spacer />
        <RefreshButton isCompact isFetching={isFetching} onClick={refetch} />
      </Flex>
      <Box border="1px" borderRadius="5px" h="calc(30vh)" overflowY="auto">
        <pre>{JSON.stringify(computedConfig.config, null, 2)}</pre>
      </Box>
      <Heading mt={4} size="md">
        {t('configurations.explanation')}
      </Heading>
      <Box border="1px" borderRadius="5px" h="calc(30vh)" overflowY="auto">
        <Accordion allowMultiple>
          {computedConfig.explanation?.map((exp) =>
            exp.action === 'added' || exp['from-name'] === 'overrides' ? (
              <AccordionItem key={uuid()}>
                <AccordionButton
                  bg="var(--chakra-colors-green-500)"
                  _hover={{
                    bg: 'var(--chakra-colors-green-700)',
                  }}
                >
                  <Center>{exp['from-name']}</Center>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <pre>{JSON.stringify(exp, null, 2)}</pre>
                </AccordionPanel>
              </AccordionItem>
            ) : (
              <AccordionItem key={uuid()}>
                <AccordionButton
                  bg="var(--chakra-colors-yellow-200)"
                  _hover={{
                    bg: 'var(--chakra-colors-yellow-300)',
                  }}
                  textColor="black"
                >
                  <Center>
                    {exp['from-name']}
                    {`: ${exp.reason}`}
                  </Center>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <pre>{JSON.stringify(exp, null, 2)}</pre>
                </AccordionPanel>
              </AccordionItem>
            ),
          )}
        </Accordion>
      </Box>
    </>
  );
};

export default ComputedConfigurationDisplay;
