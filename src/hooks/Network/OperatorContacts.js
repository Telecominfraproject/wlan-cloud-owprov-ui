import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetOperatorContacts = ({ operatorId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  return useQuery(
    ['get-operator-contacts', operatorId],
    () =>
      !operatorId
        ? []
        : axiosProv
            .get(`operatorContact?withExtendedInfo=true&operatorId=${operatorId}`)
            .then(({ data }) => data.contacts),
    {
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
};

export const useGetOperatorContact = ({ enabled, id }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-operator-contact', id], () => axiosProv.get(`operatorContact/${id}`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
      if (!toast.isActive('contact-fetching-error'))
        toast({
          id: 'operator-contact-fetching-error',
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

export const useCreateOperatorContact = () =>
  useMutation((newContact) => axiosProv.post('operatorContact/0', newContact));

export const useUpdateOperatorContact = ({ id }) =>
  useMutation((newContact) => axiosProv.put(`operatorContact/${id}`, newContact));

export const useDeleteOperatorContact = ({ id }) => useMutation(() => axiosProv.delete(`operatorContact/${id}`, {}));
