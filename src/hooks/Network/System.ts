import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { System } from 'models/System';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { errorToast, successToast } from 'utils/toastHelper';
import * as axios from 'axios';

const axiosInstance = axios.default.create();

axiosInstance.defaults.timeout = 120000;
axiosInstance.defaults.headers.get.Accept = 'application/json';
axiosInstance.defaults.headers.post.Accept = 'application/json';

export const useGetSystemInfo = ({ endpoint, name, token }: { endpoint: string; name: string; token: string }) => {
  const { t } = useTranslation();
  const toast = useToast();
  return useQuery(
    ['get-system-info', name],
    () =>
      axiosInstance
        .get(`${endpoint}/api/v1/system?command=info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }: { data: System }) => data),
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
  endpoint,
  enabled,
  name,
  token,
}: {
  endpoint: string;
  enabled: boolean;
  name: string;
  token: string;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subsystems', name],
    () =>
      axiosInstance
        .post(
          `${endpoint}/api/v1/system`,
          { command: 'getsubsystemnames' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
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
  endpoint,
  resetSubs,
  token,
}: {
  endpoint: string;
  resetSubs: () => void;
  token: string;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(
    (subsToReload: string[]) =>
      axiosInstance.post(
        `${endpoint}/api/v1/system`,
        { command: 'reload', subsystems: subsToReload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
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
