import React, { useState } from 'react';
import { AxiosInstance } from 'axios';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import { ArrowsClockwise } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { axiosSec } from 'utils/axiosInstances';
import { useGetSubsystems, useGetSystemInfo, useReloadSubsystems } from 'hooks/Network/System';
import FormattedDate from 'components/FormattedDate';
import { compactSecondsToDetailed } from 'utils/dateFormatting';
import { MultiValue, Select } from 'chakra-react-select';
import SystemCertificatesTable from './SystemCertificatesTable';

interface Props {
  axiosInstance: AxiosInstance;
  name: string;
}

const SystemTile: React.FC<Props> = ({ axiosInstance, name }) => {
  if (name !== 'owsec' && axiosSec.defaults.baseURL === axiosInstance.defaults.baseURL) {
    return null;
  }
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subs, setSubs] = useState<{ value: string; label: string }[]>([]);
  const {
    data: system,
    refetch: refreshSystem,
    isFetching: isFetchingSystem,
  } = useGetSystemInfo({ axiosInstance, name });
  const {
    data: subsystems,
    refetch: refreshSubsystems,
    isFetching: isFetchingSubsystems,
  } = useGetSubsystems({ enabled: true, axiosInstance, name });
  const resetSubs = () => setSubs([]);
  const { mutateAsync: reloadSubsystems, isLoading: isReloading } = useReloadSubsystems({ axiosInstance, resetSubs });

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
        <Box display="flex" mb={2}>
          <Heading pt={0}>{name}</Heading>
          <Spacer />
          <Button
            mt={1}
            minWidth="112px"
            colorScheme="gray"
            rightIcon={<ArrowsClockwise />}
            onClick={refresh}
            isLoading={isFetchingSystem || isFetchingSubsystems}
          >
            {t('common.refresh')}
          </Button>
        </Box>
        <CardBody>
          <VStack w="100%">
            <SimpleGrid minChildWidth="500px" w="100%">
              <Flex>
                <Box w="150px">{t('system.endpoint')}:</Box>
                {axiosInstance.defaults.baseURL}
              </Flex>
              <Flex>
                <Box w="150px">{t('system.hostname')}:</Box>
                {system?.hostname}
              </Flex>
              <Flex>
                <Box w="150px">{t('system.os')}:</Box>
                {system?.os}
              </Flex>
              <Flex>
                <Box w="150px">{t('system.processors')}:</Box>
                {system?.processors}
              </Flex>
              <Flex>
                <Box w="150px">{t('system.start')}:</Box>
                {system?.start ? <FormattedDate date={system?.start} /> : '-'}
              </Flex>
              <Flex>
                <Box w="150px">{t('system.uptime')}:</Box>
                {system?.uptime ? compactSecondsToDetailed(system.uptime, t) : '-'}
              </Flex>
              <Flex>
                <Box w="150px">{t('system.version')}:</Box>
                {system?.version}
              </Flex>
              <Flex>
                <Box w="150px">{t('certificates.title')}:</Box>
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
              <Box w="150px">{t('system.subsystems')}:</Box>
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
                  colorScheme="gray"
                  isLoading={isReloading}
                  isDisabled={subs.length === 0}
                />
              </Tooltip>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
      <AlertDialog leastDestructiveRef={undefined} isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{t('certificates.title')}</AlertDialogHeader>
            <AlertDialogBody pb={6}>
              <SystemCertificatesTable certificates={system?.certificates} />
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SystemTile;
