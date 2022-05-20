import { useToast } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { AxiosError } from 'axios';
import useDefaultPage from 'hooks/useDefaultPage';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetVenues = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-venues'],
    () => axiosProv.get('venue?withExtendedInfo=true&offset=0&limit=500').then(({ data }) => data.venues),
    {
      staleTime: 30000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('venues-fetching-error'))
          toast({
            id: 'venues-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('venues.title'),
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

export const useGetSelectVenues = ({ select }: { select: string[] }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-venues', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`venue?withExtendedInfo=true&select=${select}`).then(({ data }) => data.venues),
    {
      staleTime: 100 * 1000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('venues-fetching-error'))
          toast({
            id: 'venues-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('venues.title'),
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

export const useGetVenue = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const goToDefaultPage = useDefaultPage();

  return useQuery(
    ['get-venue', id],
    () => axiosProv.get(`venue/${id}?withExtendedInfo=true`).then(({ data }) => data),
    {
      onError: (e: AxiosError) => {
        if (!toast.isActive('venue-fetching-error'))
          toast({
            id: 'venue-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('venues.one'),
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

export const useCreateVenue = () =>
  useMutation(({ params, createObjects }: { params: unknown; createObjects: unknown }) =>
    axiosProv.post(`venue/0${createObjects ? `?createObjects=${JSON.stringify(createObjects)}` : ''}`, params),
  );

export const useUpdateVenue = ({ id }: { id: string }) =>
  useMutation(({ params, createObjects }: { params: unknown; createObjects: unknown }) =>
    axiosProv.put(`venue/${id}${createObjects ? `?createObjects=${JSON.stringify(createObjects)}` : ''}`, params),
  );
export const useUpdateVenueDevices = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(() => axiosProv.put(`venue/${id}?updateAllDevices=true`, {}), {
    onSuccess: ({ data }) => {
      toast({
        id: 'venue-update-devices-success',
        title: t('common.success'),
        description: t('venues.successfully_update_devices', { num: data.serialNumbers.length }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e: AxiosError) => {
      toast({
        id: uuid(),
        title: t('common.error'),
        description: t('crud.error_create_obj', {
          obj: t('venues.error_update_devices'),
          e: e?.response?.data?.ErrorDescription,
        }),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });
};

export const useRebootVenueDevices = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(() => axiosProv.put(`venue/${id}?rebootAllDevices=true`, {}), {
    onSuccess: ({ data }) => {
      toast({
        id: 'venue-reboot-devices-success',
        title: t('common.success'),
        description: t('venues.successfully_reboot_devices', { num: data.serialNumbers.length }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e: AxiosError) => {
      toast({
        id: uuid(),
        title: t('common.error'),
        description: t('crud.error_create_obj', {
          obj: t('venues.error_update_devices'),
          e: e?.response?.data?.ErrorDescription,
        }),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });
};

export const useUpgradeVenueDevices = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(() => axiosProv.put(`venue/${id}?upgradeAllDevices=true`, {}), {
    onSuccess: () => {
      toast({
        id: 'venue-upgrade-devices-success',
        title: t('common.success'),
        description: t('venues.upgrade_all_devices_success'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e: AxiosError) => {
      toast({
        id: uuid(),
        title: t('common.error'),
        description: t('crud.upgrade_all_devices_error', {
          e: e?.response?.data?.ErrorDescription,
        }),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });
};

export const useDeleteVenue = () => useMutation((id) => axiosProv.delete(`venue/${id}`));

export const useAddVenueContact = ({ id, originalContacts = [] }: { id: string; originalContacts?: string[] }) =>
  useMutation((newContact: string) =>
    axiosProv.put(`venue/${id}`, {
      contacts: [...originalContacts, newContact],
    }),
  );
export const useRemoveVenueContact = ({
  id,
  originalContacts = [],
  refresh,
}: {
  id: string;
  originalContacts?: string[];
  refresh: () => void;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(
    (contactToRemove: string) =>
      axiosProv.put(`venue/${id}`, {
        contacts: originalContacts.filter((contact) => contact !== contactToRemove),
      }),
    {
      onSuccess: () => {
        refresh();
        toast({
          id: `contact-remove-success`,
          title: t('common.success'),
          description: t('venues.successfully_removed_contact'),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: (e: AxiosError) => {
        toast({
          id: 'contact-remove-error',
          title: t('common.error'),
          description: t('venues.error_remove_contact', {
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
