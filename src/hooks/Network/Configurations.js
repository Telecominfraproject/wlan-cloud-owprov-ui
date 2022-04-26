import { useToast } from '@chakra-ui/react';
import useDefaultPage from 'hooks/useDefaultPage';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetConfigurations = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-configurations'],
    () =>
      axiosProv.get('configuration?withExtendedInfo=true&offset=0, limit=500').then(({ data }) => data.configurations),
    {
      staleTime: 200 * 1000,
      onError: (e) => {
        if (!toast.isActive('configurations-fetching-error'))
          toast({
            id: 'configurations-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('configurations.title'),
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

export const useGetSelectConfigurations = ({ select }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-configurations', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`configuration?withExtendedInfo=true&select=${select}`).then(({ data }) => data.configurations),
    {
      staleTime: 100 * 1000,
      onError: (e) => {
        if (!toast.isActive('configurations-fetching-error'))
          toast({
            id: 'configurations-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('configurations.title'),
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

export const useGetAvailableConfigurations = ({ tagId }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-available-configurations', tagId],
    () => axiosProv.get(`configuration?tagId=${tagId}`).then(({ data }) => data.configurations),
    {
      onError: (e) => {
        if (!toast.isActive('configurations-fetching-error'))
          toast({
            id: 'configurations-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('configurations.title'),
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

export const useGetConfiguration = ({ id = null, onSuccess = () => {} }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const goToDefaultPage = useDefaultPage();

  return useQuery(
    ['get-configuration', id],
    () => axiosProv.get(`configuration/${id}?withExtendedInfo=true`).then(({ data }) => data),
    {
      enabled: id !== null && id !== '',
      onSuccess,
      onError: (e) => {
        if (!toast.isActive('configuration-fetching-error'))
          toast({
            id: 'configuration-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('configuration.one'),
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        goToDefaultPage();
      },
    },
  );
};

export const useGetConfigurationInUse = ({ id, enabled }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-config-in-use', id],
    () => axiosProv.get(`/configuration/${id}?expandInUse=true`).then(({ data }) => data.entries),
    {
      enabled,
      onError: (e) => {
        toast({
          id: 'config-in-use-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            e: e?.response?.data?.ErrorDescription,
            obj: t('configurations.one'),
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

export const useGetConfigurationAffected = ({ id, enabled }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-config-affected', id],
    () => axiosProv.get(`/configuration/${id}?computedAffected=true`).then(({ data }) => data.affectedDevices),
    {
      enabled,
      onError: (e) => {
        toast({
          id: 'config-in-use-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            e: e?.response?.data?.ErrorDescription,
            obj: t('configurations.one'),
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

export const useDeleteConfiguration = () => useMutation((id) => axiosProv.delete(`configuration/${id}`));

export const useUpdateConfiguration = ({ id }) =>
  useMutation((newConf) => axiosProv.put(`configuration/${id}`, newConf));
