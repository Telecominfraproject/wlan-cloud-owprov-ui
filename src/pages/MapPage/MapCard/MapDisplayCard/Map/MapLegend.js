import { Box, Flex, Heading, Spacer, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MapLegend = () => {
  const { t } = useTranslation();
  const entityBg = useColorModeValue('teal.200', 'teal.400');
  const venueBg = useColorModeValue('cyan.200', 'cyan.400');
  const deviceBg = useColorModeValue('blue.200', 'blue.200');

  return (
    <Box w="140px" position="absolute" boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)" borderRadius="5px" px={2}>
      <Flex mt={1}>
        <Heading size="sm" sm="6">
          {t('map.root')}
        </Heading>
        <Spacer />
        <Box w="68px" bgColor="black" />
      </Flex>
      <Flex mt={1}>
        <Heading size="sm" sm="6">
          {t('entities.one')}
        </Heading>
        <Spacer />
        <Box w="68px" bgColor={entityBg} />
      </Flex>
      <Flex mt={1}>
        <Heading size="sm" sm="6">
          {t('venues.one')}
        </Heading>
        <Spacer />
        <Box w="68px" bgColor={venueBg} />
      </Flex>
      <Flex my={1}>
        <Heading size="sm" sm="6">
          {t('certificates.device')}
        </Heading>
        <Spacer />
        <Box w="68px" bgColor={deviceBg} />
      </Flex>
    </Box>
  );
};

export default React.memo(MapLegend);
