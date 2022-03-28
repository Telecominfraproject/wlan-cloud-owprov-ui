import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import { ArrowsClockwise } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { axiosSec } from 'utils/axiosInstances';
import { errorToast, successToast } from 'utils/toastHelper';
import { useGetSubsystems, useGetSystemInfo } from 'hooks/Network/System';
import { useMutation } from 'react-query';
import FormattedDate from 'components/FormattedDate';
import { compactSecondsToDetailed } from 'utils/dateFormatting';
import MultiSelect from 'components/MultiSelect';
import SystemCertificatesTable from './SystemCertificatesTable';

const propTypes = {
  axiosInstance: PropTypes.instanceOf(Object).isRequired,
  name: PropTypes.string.isRequired,
};

const SystemTile = ({ axiosInstance, name }) => {
  if (name !== 'owsec' && axiosSec.defaults.baseURL === axiosInstance.defaults.baseURL) {
    return null;
  }
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subs, setSubs] = useState([]);
  const {
    data: system,
    refetch: refreshSystem,
    isFetching: isFetchingSystem,
  } = useGetSystemInfo({ t, toast, axiosInstance, name });
  const {
    data: subsystems,
    refetch: refreshSubsystems,
    isFetching: isFetchingSubsystems,
  } = useGetSubsystems({ t, toast, axiosInstance, name });

  const reloadSubsystems = useMutation((subsToReload) =>
    axiosSec.post('/system', {
      command: 'reload',
      subsystems: subsToReload.map((sub) => sub.value),
    }),
  );

  const handleReloadClick = () => {
    reloadSubsystems.mutateAsync(subs, {
      onSuccess: () => {
        toast(
          successToast({
            t,
            id: 'system-fetching-error',
            description: t('system.success_reload'),
          }),
        );
        setSubs([]);
      },
      onError: (e) => {
        toast(
          errorToast({
            t,
            id: 'system-fetching-error',
            description: t('crud.error_fetching_obj', {
              e: e?.response?.data?.ErrorDescription,
              obj: t('system.title'),
            }),
          }),
        );
      },
    });
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
                {system?.certificates.length > 0 ? (
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
                <MultiSelect
                  options={
                    subsystems?.list?.length > 0 ? subsystems.list.map((sys) => ({ value: sys, label: sys })) : []
                  }
                  onChange={setSubs}
                  value={subs}
                />
              </Box>
              <Tooltip position="top" hasArrow label={t('system.reload_chosen_subsystems')}>
                <IconButton
                  ml={2}
                  onClick={handleReloadClick}
                  icon={<ArrowsClockwise size={20} />}
                  colorScheme="gray"
                  isLoading={reloadSubsystems.isLoading}
                  isDisabled={subs.length === 0}
                />
              </Tooltip>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
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

SystemTile.propTypes = propTypes;
export default SystemTile;
