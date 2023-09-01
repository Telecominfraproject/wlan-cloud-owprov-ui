import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Center,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Spinner,
  Tooltip,
  useBoolean,
} from '@chakra-ui/react';
import { ListBullets, Table } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import VenueConfigurationsTable from './ConfigurationsTable';
import SimpleConfigurationDisplay from './SimpleConfigurationDisplay';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CreateConfigurationModal from 'components/Tables/ConfigurationTable/CreateConfigurationModal';
import { useGetSelectConfigurations } from 'hooks/Network/Configurations';
import { useGetVenue } from 'hooks/Network/Venues';
import { Configuration } from 'models/Configuration';

type Props = {
  id: string;
};

const VenueConfigurationsCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const [isList, setIsList] = useBoolean(false);
  const getVenue = useGetVenue({ id });
  const getConfigurations = useGetSelectConfigurations({ select: getVenue.data?.configurations ?? [] });

  const configurations = React.useMemo(() => {
    if (!getConfigurations.data) return null;

    if (getConfigurations.data.length === 0 && isList) {
      return (
        <Alert my={4}>
          <AlertTitle>
            {t('common.no')} {t('configurations.title')}
          </AlertTitle>
          <AlertDescription>
            Add new configurations to this venue by clicking the &quot;Create&quot; button
          </AlertDescription>
        </Alert>
      );
    }

    if (isList)
      return (getConfigurations.data as Configuration[])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((config: Configuration, i) => (
          <>
            <SimpleConfigurationDisplay configuration={config as Configuration} />
            {i !== getConfigurations.data.length - 1 && <Box h="1px" bg="gray.200" w="100%" my={4} />}
          </>
        ));

    return <VenueConfigurationsTable id={id} />;
  }, [getVenue.data, getConfigurations, isList]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{t('configurations.title')}</Heading>
        <Spacer />
        <HStack>
          <Tooltip label="Table View">
            <IconButton
              aria-label="View as Table"
              colorScheme="teal"
              variant="ghost"
              isActive={!isList}
              icon={<Table size={20} />}
              onClick={setIsList.off}
            />
          </Tooltip>
          <Tooltip label="List View">
            <IconButton
              aria-label="View as List"
              colorScheme="teal"
              variant="ghost"
              isActive={isList}
              icon={<ListBullets size={20} />}
              onClick={setIsList.on}
            />
          </Tooltip>
          <CreateConfigurationModal entityId={`venue:${id}`} refresh={getVenue.refetch} />
        </HStack>
      </CardHeader>
      <CardBody>
        <Box w="100%">
          {!getVenue.data ? (
            <Center my={8}>
              <Spinner size="xl" />
            </Center>
          ) : (
            configurations
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default VenueConfigurationsCard;
