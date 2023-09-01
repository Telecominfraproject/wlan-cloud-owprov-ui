import * as React from 'react';
import { Box, Flex, HStack, Heading, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteConfigurationButton from 'components/Tables/ConfigurationTable/DeleteConfigurationButton';
import { Configuration } from 'models/Configuration';

type Props = {
  configuration: Configuration;
};

const SimpleResourceDisplay = ({ configuration }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToPage = () => navigate(`/configuration/${configuration.id}`);

  const deviceTypes = () => {
    if (configuration.deviceTypes[0] === '*') {
      return 'All device types';
    }

    return configuration.deviceTypes.join(', ');
  };

  return (
    <Box>
      <Flex mb={1}>
        <HStack>
          <Heading size="md" my="auto">
            {configuration.name}
          </Heading>
          <DeleteConfigurationButton configuration={configuration} />
          <Tooltip hasArrow label={t('common.view_details')} placement="top" ml={2}>
            <IconButton
              aria-label={t('common.view_details')}
              colorScheme="blue"
              icon={<MagnifyingGlass size={20} />}
              size="sm"
              onClick={handleGoToPage}
            />
          </Tooltip>
        </HStack>
      </Flex>
      <Text fontStyle="italic">{configuration.description}</Text>
      <Flex>
        <Text>Supports: {deviceTypes()}</Text>
      </Flex>
    </Box>
  );
};

export default SimpleResourceDisplay;
