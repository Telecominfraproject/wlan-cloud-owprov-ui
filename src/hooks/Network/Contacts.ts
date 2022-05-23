import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { PageInfo } from 'models/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetContactCount = ({ enabled }: { enabled: boolean }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-contact-count'], () => axiosProv.get('contact?countOnly=true').then(({ data }) => data.count), {
    enabled,
    staleTime: 30000,
    onError: (e: AxiosError) => {
      if (!toast.isActive('contact-count-fetching-error'))
        toast({
          id: 'contact-count-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('contacts.other'),
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

export const useGetContacts = ({
  pageInfo,
  enabled,
  count,
}: {
  pageInfo: PageInfo;
  enabled?: boolean;
  count?: number;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-contacts-with-pagination', pageInfo, count],
    () =>
      axiosProv
        .get(`contact?withExtendedInfo=true&limit=${pageInfo.limit}&offset=${pageInfo.limit * pageInfo.index}`)
        .then(({ data }) => data.contacts),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('contacts-fetching-error'))
          toast({
            id: 'contacts-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('contacts.other'),
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

export const useGetSelectContacts = ({ select }: { select: string[] }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-contacts-select', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`contact?withExtendedInfo=true&select=${select}`).then(({ data }) => data.contacts),
    {
      staleTime: 100 * 1000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('contacts-fetching-error'))
          toast({
            id: 'contacts-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('contacts.other'),
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

export const useGetAllContacts = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-all-contacts'],
    () => axiosProv.get(`contact?withExtendedInfo=true&limit=500&offset=0`).then(({ data }) => data.contacts),
    {
      staleTime: 1000 * 1000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('contacts-fetching-error'))
          toast({
            id: 'contacts-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('contacts.other'),
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

export const useGetContact = ({ enabled, id }: { enabled: boolean; id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-contact', id], () => axiosProv.get(`contact/${id}`).then(({ data }) => data), {
    enabled,
    onError: (e: AxiosError) => {
      if (!toast.isActive('contact-fetching-error'))
        toast({
          id: 'contact-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('contacts.one'),
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

export const useCreateContact = () => useMutation((newContact) => axiosProv.post('contact/0', newContact));

export const useUpdateContact = ({ id }: { id: string }) =>
  useMutation((newContact) => axiosProv.put(`contact/${id}`, newContact));

const claimContacts = async (contactIds: string[], entity: string, venue: string) => {
  const addPromises = contactIds.map(async (id) =>
    axiosProv
      .put(`contact/${id}`, {
        entity,
        venue,
      })
      .then(() => ({
        id,
      }))
      .catch(() => ({ id, error: true })),
  );

  const claimResults = await Promise.all(addPromises);
  // @ts-ignore
  const claimErrors = claimResults.filter((res) => res.error).map((res) => res.id);

  return { claimErrors };
};

export const useClaimContacts = ({ entityId, venueId }: { entityId: string; venueId: string }) =>
  useMutation((contactIds: string[]) => claimContacts(contactIds, entityId, venueId));
