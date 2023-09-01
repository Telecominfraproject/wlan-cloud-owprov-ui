import * as React from 'react';
import { Box, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConfigurationsTable from 'components/Tables/ConfigurationTable';
import DeleteConfigurationButton from 'components/Tables/ConfigurationTable/DeleteConfigurationButton';
import { useGetVenue } from 'hooks/Network/Venues';
import { Configuration } from 'models/Configuration';

type Props = {
  id: string;
};

const VenueConfigurationsTable = ({ id }: Props) => {
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
    <Box w="100%" overflowX="auto">
      <ConfigurationsTable select={getVenue.data?.configurations ?? []} actions={actions} />
    </Box>
  );
};

export default VenueConfigurationsTable;
