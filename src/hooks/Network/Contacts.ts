import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'models/Axios';
import { ContactObj, CreateContactObj } from 'models/Contact';
import { PageInfo } from 'models/Table';
import { axiosProv } from 'utils/axiosInstances';

export const useGetContactCount = ({ enabled }: { enabled: boolean }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-contact-count'],
    () => axiosProv.get('contact?countOnly=true').then(({ data }) => data.count as number),
    {
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
    },
  );
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
        .then(({ data }) => data.contacts as ContactObj[]),
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
        ? ([] as ContactObj[])
        : axiosProv
            .get(`contact?withExtendedInfo=true&select=${select}`)
            .then(({ data }) => data.contacts as ContactObj[]),
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

const getContactsBatch = async (limit: number, offset: number) =>
  axiosProv
    .get(`contact?withExtendedInfo=true&limit=${limit}&offset=${offset}`)
    .then(({ data }) => data.contacts as ContactObj[]);

const getAllContacts = async () => {
  const limit = 500;
  let offset = 0;
  let data: ContactObj[] = [];
  let lastResponse: ContactObj[] = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    lastResponse = await getContactsBatch(limit, offset);
    data = data.concat(lastResponse);
    offset += 500;
  } while (lastResponse.length === 500);
  return data;
};

export const useGetAllContacts = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-all-contacts'], () => getAllContacts(), {
    staleTime: 60 * 1000,
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
  });
};

export const useGetContact = ({ enabled, id }: { enabled: boolean; id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-contact', id], () => axiosProv.get(`contact/${id}`).then(({ data }) => data as ContactObj), {
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

export const useCreateContact = () =>
  useMutation((newContact: CreateContactObj) =>
    axiosProv.post('contact/0', newContact).then(({ data }) => data as ContactObj),
  );

export const useUpdateContact = ({ id }: { id: string }) =>
  useMutation((newContact: CreateContactObj) =>
    axiosProv.put(`contact/${id}`, newContact).then(({ data }) => data as ContactObj),
  );

export const useDeleteContact = ({ id }: { id: string }) => useMutation(() => axiosProv.delete(`contact/${id}`));

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
