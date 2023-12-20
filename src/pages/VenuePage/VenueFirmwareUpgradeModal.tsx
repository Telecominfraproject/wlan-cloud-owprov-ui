import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  ListItem,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import FormattedDate from 'components/FormattedDate';
import { Modal } from 'components/Modals/Modal';
import { useGetVenueUpgradeAvailableFirmware, useUpgradeVenueDevices } from 'hooks/Network/Venues';
import { AxiosError } from 'models/Axios';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
};

const VenueFirmwareUpgradeModal = ({ isOpen, onClose, venueId }: Props) => {
  const { t } = useTranslation();
  const getAvailableFirmware = useGetVenueUpgradeAvailableFirmware({ id: venueId, enabled: isOpen });
  const upgrade = useUpgradeVenueDevices();
  const [selectedRevision, setSelectedRevision] = React.useState<string>();

  const onRevisionSelect = (revision: string) => () => {
    setSelectedRevision(revision);
  };

  const onUpgradeClick = () => {
    if (selectedRevision) {
      upgrade.mutateAsync(
        { revision: selectedRevision, id: venueId },
        {
          onSuccess: () => {
            setSelectedRevision(undefined);
            onClose();
          },
        },
      );
    }
  };

  const inactiveBg = useColorModeValue('white', 'gray.700');
  const activeBg = useColorModeValue('gray.200', 'gray.600');

  const listItemStyle = (revision: string) => ({
    cursor: 'pointer',
    backgroundColor: revision === selectedRevision ? activeBg : inactiveBg,
  });

  const displayRevision = (release: { date: number; revision: string }) => (
    <ListItem key={release.revision} onClick={onRevisionSelect(release.revision)} {...listItemStyle(release.revision)}>
      <FormattedDate date={release.date} />
      <Text>{release.revision}</Text>
    </ListItem>
  );

  const placeholder = React.useMemo(() => {
    if (getAvailableFirmware.isFetching) {
      return (
        <Center my={6}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (getAvailableFirmware.isError) {
      return (
        <Center my={6}>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>
              {(getAvailableFirmware.error as AxiosError).response?.data?.ErrorDescription}
            </AlertDescription>
          </Alert>
        </Center>
      );
    }

    return null;
  }, [getAvailableFirmware]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedRevision(undefined);
      getAvailableFirmware.refetch();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('venues.upgrade_all_devices')}>
      <Box>
        {placeholder || !getAvailableFirmware.data ? (
          placeholder
        ) : (
          <>
            <Text fontWeight="bold">{t('venues.upgrade_options_available')}</Text>
            <Center my={2}>
              <Button
                colorScheme="yellow"
                onClick={onUpgradeClick}
                isDisabled={!selectedRevision}
                isLoading={upgrade.isLoading}
                display="block"
              >
                <Text>{selectedRevision ? `Upgrade to ` : 'Select a revision to upgrade'}</Text>
                {selectedRevision ? <Text mt={1}>{selectedRevision}</Text> : null}
              </Button>
            </Center>
            <Tabs>
              <TabList>
                <Tab>Official Releases</Tab>
                <Tab>Release Candidates</Tab>
                <Tab>Dev Releases</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Text fontWeight="bold" textDecor="underline">
                    Official Releases
                  </Text>
                  <UnorderedList>
                    {getAvailableFirmware.data?.releases
                      .sort((a, b) => b.date - a.date)
                      .map((release) => displayRevision(release))}
                  </UnorderedList>
                </TabPanel>
                <TabPanel>
                  <Text fontWeight="bold" textDecor="underline">
                    Release Candidates
                  </Text>
                  <UnorderedList>
                    {getAvailableFirmware.data?.releasesCandidates
                      .sort((a, b) => b.date - a.date)
                      .map((release) => displayRevision(release))}
                  </UnorderedList>
                </TabPanel>
                <TabPanel>
                  <Text fontWeight="bold" textDecor="underline">
                    Dev Releases
                  </Text>
                  <UnorderedList>
                    {getAvailableFirmware.data?.developmentReleases
                      .sort((a, b) => b.date - a.date)
                      .map((release) => displayRevision(release))}
                  </UnorderedList>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default VenueFirmwareUpgradeModal;
