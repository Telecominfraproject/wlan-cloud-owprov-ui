import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Heading,
  IconButton,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import LiveView from './LiveView';
import StartAnalyticsModal from './StartAnalyticsModal';
import StopMonitoringButton from './StopMonitoringButton';
import VenueClientLifecycle from './VenueClientLifecycle';
import VenueDashboard from './VenueDashboard';
import ViewAnalyticsSettingsModal from './ViewAnalyticsSettingsModal';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { useGetAnalyticsBoardDevices } from 'hooks/Network/Analytics';
import { useGetVenue } from 'hooks/Network/Venues';
import { AxiosError } from 'models/Axios';

type Props = {
  id: string;
};

const VenueAnalyticsCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const getVenue = useGetVenue({ id });
  const boardId = getVenue.data?.boards[0];
  const getDashboard = useGetAnalyticsBoardDevices({ id: boardId });

  const body = React.useMemo(() => {
    if (!boardId)
      return (
        <Card>
          <CardHeader>
            <Heading size="md">{t('analytics.title')}</Heading>
          </CardHeader>
          <CardBody>
            <Center w="100%" mt={2}>
              <Alert status="info" w="unset" borderRadius="15px" onClick={onCreateOpen} cursor="pointer">
                <AlertIcon />
                <Box>
                  <AlertTitle>{t('analytics.no_board')}</AlertTitle>
                  <AlertDescription>{t('analytics.no_board_description')}</AlertDescription>
                </Box>
              </Alert>
            </Center>
          </CardBody>
        </Card>
      );

    if (getDashboard.error || getDashboard.isLoading || !getVenue.data)
      return (
        <Card>
          <CardHeader>
            <Heading size="md">{t('analytics.title')}</Heading>
          </CardHeader>
          <CardBody>
            {getDashboard.error ? (
              <Alert status="error" w="unset" borderRadius="15px" onClick={onCreateOpen} cursor="pointer">
                <AlertIcon />
                <Box>
                  <AlertTitle>{t('common.error')}</AlertTitle>
                  <AlertDescription>
                    {getDashboard.error.response?.status === 404
                      ? t('analytics.missing_board')
                      : (getDashboard.error as AxiosError).response?.data?.ErrorDescription}
                  </AlertDescription>
                </Box>
              </Alert>
            ) : (
              <Center my={6}>
                <Spinner size="xl" />
              </Center>
            )}
          </CardBody>
        </Card>
      );

    return (
      <Card p={0}>
        <Tabs variant="enclosed" isLazy>
          <TabList>
            <Tab>{t('analytics.dashboard')}</Tab>
            <Tab>{t('analytics.live_view')}</Tab>
            <Tab>{t('analytics.client_lifecycle')}</Tab>
            <Spacer />
            <StopMonitoringButton boardId={boardId} venueId={id} />
            <Tooltip label={t('common.view_details')} hasArrow>
              <IconButton
                aria-label={t('common.view_details')}
                icon={<MagnifyingGlass size={20} />}
                h="41px"
                borderTopLeftRadius={0}
                borderBottomRadius="0px"
                colorScheme="blue"
                onClick={onViewOpen}
              />
            </Tooltip>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Box
                borderLeft="1px solid"
                borderRight="1px solid"
                borderBottom="1px solid"
                borderColor="var(--chakra-colors-chakra-border-color)"
                borderBottomLeftRadius="15px"
                borderBottomRightRadius="15px"
              >
                <VenueDashboard boardId={boardId} />
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <Box
                borderLeft="1px solid"
                borderRight="1px solid"
                borderBottom="1px solid"
                borderColor="var(--chakra-colors-chakra-border-color)"
                borderBottomLeftRadius="15px"
                borderBottomRightRadius="15px"
              >
                <LiveView boardId={boardId} venue={getVenue.data} />
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <Box
                borderLeft="1px solid"
                borderRight="1px solid"
                borderBottom="1px solid"
                borderColor="var(--chakra-colors-chakra-border-color)"
                borderBottomLeftRadius="15px"
                borderBottomRightRadius="15px"
              >
                <VenueClientLifecycle venueId={id} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <ViewAnalyticsSettingsModal isOpen={isViewOpen} boardId={boardId} venueId={id} onClose={onViewClose} />
      </Card>
    );
  }, [boardId, getDashboard, getVenue]);

  return (
    <Box>
      {body}
      <StartAnalyticsModal isOpen={isCreateOpen} id={id} onClose={onCreateClose} />
    </Box>
  );
};

export default VenueAnalyticsCard;
