import * as React from 'react';
import { Box, Flex, HStack, IconButton, Spacer, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CardBody from 'components/Card/CardBody';
import ConfigurationsTable from 'components/Tables/ConfigurationTable';
import CreateConfigurationModal from 'components/Tables/ConfigurationTable/CreateConfigurationModal';
import DeleteConfigurationButton from 'components/Tables/ConfigurationTable/DeleteConfigurationButton';
import { useGetVenue } from 'hooks/Network/Venues';
import { Configuration } from 'models/Configuration';

type Props = {
  id: string;
};

const VenueConfigurations = ({ id }: Props) => {
  const { t } = useTranslation();
  const getVenue = useGetVenue({ id });
  const navigate = useNavigate();

  const handleGoToPage = (configId: string) => () => navigate(`/configuration/${configId}`);

  const actions = React.useCallback(
    (cell: { row: { original: Configuration } }) => (
      <HStack spacing={2}>
        <DeleteConfigurationButton configuration={cell.row.original} />
        <Tooltip hasArrow label={t('common.view_details')} placement="top">
          <IconButton
            aria-label={t('common.view_details')}
            colorScheme="blue"
            icon={<MagnifyingGlass size={20} />}
            size="sm"
            onClick={handleGoToPage(cell.row.original.id)}
          />
        </Tooltip>
      </HStack>
    ),
    [t],
  );

  return (
    <>
      <Flex px={2} pt={2}>
        <Spacer />
        <CreateConfigurationModal entityId={`venue:${id}`} refresh={getVenue.refetch} />
      </Flex>
      <CardBody p={4}>
        <Box w="100%" overflowX="auto">
          <ConfigurationsTable select={getVenue.data?.configurations ?? []} actions={actions} />
        </Box>
      </CardBody>
    </>
  );
};

export default VenueConfigurations;
