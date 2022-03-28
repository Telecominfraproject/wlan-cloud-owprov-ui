import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetContactCount = ({ t, toast, enabled }) =>
  useQuery(['get-contact-count'], () => axiosProv.get('contact?countOnly=true').then(({ data }) => data.count), {
    enabled,
    staleTime: 30000,
    onError: (e) => {
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

export const useGetContacts = ({ t, toast, pageInfo, enabled, count }) =>
  useQuery(
    ['get-contacts-with-pagination', pageInfo, count],
    () =>
      axiosProv
        .get(`contact?withExtendedInfo=true&limit=${pageInfo.limit}&offset=${pageInfo.limit * pageInfo.index}`)
        .then(({ data }) => data.contacts),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e) => {
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

export const useGetSelectContacts = ({ t, toast, select }) =>
  useQuery(
    ['get-contacts-select', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`contact?withExtendedInfo=true&select=${select}`).then(({ data }) => data.contacts),
    {
      staleTime: 100 * 1000,
      onError: (e) => {
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

export const useGetAllContacts = ({ t, toast }) =>
  useQuery(
    ['get-all-contacts'],
    () => axiosProv.get(`contact?withExtendedInfo=true&limit=500&offset=0`).then(({ data }) => data.contacts),
    {
      staleTime: 1000 * 1000,
      onError: (e) => {
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

export const useGetContact = ({ t, toast, enabled, id }) =>
  useQuery(['get-contact', id], () => axiosProv.get(`contact/${id}`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
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

export const useCreateContact = () => useMutation((newContact) => axiosProv.post('contact/0', newContact));

export const useUpdateContact = ({ id }) => useMutation((newContact) => axiosProv.put(`contact/${id}`, newContact));

const claimContacts = async (contactIds, entity, venue) => {
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
  const claimErrors = claimResults.filter((res) => res.error).map((res) => res.id);

  return { claimErrors };
};

export const useClaimContacts = ({ entityId, venueId }) =>
  useMutation((contactIds) => claimContacts(contactIds, entityId, venueId));
