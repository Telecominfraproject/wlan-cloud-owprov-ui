import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { MultiValue, Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import SystemLoggingButton from './LoggingButton';
import SystemCertificatesTable from './SystemCertificatesTable';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import FormattedDate from 'components/FormattedDate';
import { Modal } from 'components/Modals/Modal';
import { EndpointApiResponse } from 'hooks/Network/Endpoints';
import { useGetSubsystems, useGetSystemInfo, useReloadSubsystems } from 'hooks/Network/System';
import { compactSecondsToDetailed } from 'utils/dateFormatting';

interface Props {
  endpoint: EndpointApiResponse;
  token: string;
}

const SystemTile = ({ endpoint, token }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subs, setSubs] = useState<{ value: string; label: string }[]>([]);
  const {
    data: system,
    refetch: refreshSystem,
    isFetching: isFetchingSystem,
  } = useGetSystemInfo({ endpoint: endpoint.uri, name: endpoint.type, token });
  const {
    data: subsystems,
    refetch: refreshSubsystems,
    isFetching: isFetchingSubsystems,
  } = useGetSubsystems({ enabled: true, endpoint: endpoint.uri, name: endpoint.type, token });
  const resetSubs = () => setSubs([]);
  const { mutateAsync: reloadSubsystems, isLoading: isReloading } = useReloadSubsystems({
    endpoint: endpoint.uri,
    resetSubs,
    token,
  });

  const handleReloadClick = () => {
    reloadSubsystems(subs.map((sub) => sub.value));
  };

  const refresh = () => {
    refreshSystem();
    refreshSubsystems();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Heading pt={0}>{endpoint.type}</Heading>
          <Spacer />
          <SystemLoggingButton endpoint={endpoint} token={token} />
          <RefreshButton onClick={refresh} isFetching={isFetchingSystem || isFetchingSubsystems} />
        </CardHeader>
        <CardBody>
          <VStack w="100%">
            <SimpleGrid minChildWidth="500px" w="100%">
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.endpoint')}:
                </Heading>
                {endpoint.uri}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.hostname')}:
                </Heading>
                {system?.hostname}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.os')}:
                </Heading>
                {system?.os}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.processors')}:
                </Heading>
                {system?.processors}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.start')}:
                </Heading>
                {system?.start ? <FormattedDate date={system?.start} /> : '-'}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.uptime')}:
                </Heading>
                {system?.uptime ? compactSecondsToDetailed(system.uptime, t) : '-'}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.version')}:
                </Heading>
                {system?.version}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('certificates.title')}:
                </Heading>
                {system?.certificates && system.certificates?.length > 0 ? (
                  <Button variant="link" onClick={onOpen} p={0} m={0} maxH={7}>
                    {t('common.details')} {system.certificates.length}
                  </Button>
                ) : (
                  t('common.unknown')
                )}
              </Flex>
            </SimpleGrid>
            <Flex w="100%">
              <Heading size="sm" w="150px" my="auto">
                {t('system.subsystems')}:
              </Heading>
              <Box w="400px">
                <Select
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '15px',
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      backgroundColor: 'unset',
                      border: 'unset',
                    }),
                  }}
                  isMulti
                  closeMenuOnSelect={false}
                  options={
                    subsystems && subsystems?.length > 0 ? subsystems.map((sys) => ({ value: sys, label: sys })) : []
                  }
                  onChange={
                    setSubs as (
                      newValue: MultiValue<{
                        value: string;
                        label: string;
                      }>,
                    ) => void
                  }
                  value={subs}
                  placeholder={t('system.systems_to_reload')}
                />
              </Box>
              <Tooltip hasArrow label={t('system.reload_chosen_subsystems')}>
                <IconButton
                  aria-label="Reload subsystems"
                  ml={2}
                  onClick={handleReloadClick}
                  icon={<ArrowsClockwise size={20} />}
                  colorScheme="blue"
                  isLoading={isReloading}
                  isDisabled={subs.length === 0}
                />
              </Tooltip>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('certificates.title')}
        options={{
          modalSize: 'sm',
        }}
      >
        <SystemCertificatesTable certificates={system?.certificates} />
      </Modal>
    </>
  );
};

export default SystemTile;
