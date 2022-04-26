import { useToast } from '@chakra-ui/react';
import { AxiosError, AxiosInstance } from 'axios';
import { System } from 'models/System';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { errorToast, successToast } from 'utils/toastHelper';

export const useGetSystemInfo = ({ axiosInstance, name }: { axiosInstance: AxiosInstance; name: string }) => {
  const { t } = useTranslation();
  const toast = useToast();
  return useQuery(
    ['get-system-info', name],
    () => axiosInstance.get('/system?command=info').then(({ data }: { data: System }) => data),
    {
      staleTime: 60000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('system-fetching-error'))
          toast({
            id: 'system-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('system.title'),
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    },
  );
};

export const useGetSubsystems = ({
  enabled,
  axiosInstance,
  name,
}: {
  enabled: boolean;
  axiosInstance: AxiosInstance;
  name: string;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subsystems', name],
    () =>
      axiosInstance
        .post('/system', { command: 'getsubsystemnames' })
        .then(({ data }: { data: { list: string[] } }) => data.list),
    {
      staleTime: 60000,
      enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('subsystems-fetching-error'))
          toast({
            id: 'subsystems-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('system.title'),
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    },
  );
};

export const useReloadSubsystems = ({
  axiosInstance,
  resetSubs,
}: {
  axiosInstance: AxiosInstance;
  resetSubs: () => void;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(
    (subsToReload: string[]) => axiosInstance.post(`system`, { command: 'reload', subsystems: subsToReload }),
    {
      onSuccess: () => {
        toast(
          successToast({
            t,
            id: 'system-fetching-error',
            description: t('system.success_reload'),
          }),
        );
        resetSubs();
      },
      onError: (e: AxiosError) => {
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
    },
  );
};
