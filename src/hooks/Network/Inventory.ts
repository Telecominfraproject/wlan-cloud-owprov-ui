import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { PageInfo, SortInfo } from 'models/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';
import { v4 as uuid } from 'uuid';

export const useGetInventoryTableSpecs = () =>
  useQuery(
    ['get-inventory-table-spec'],
    () => axiosProv.get(`inventory?orderSpec=true`).then(({ data }) => data.list),
    {
      staleTime: Infinity,
    },
  );

export const useGetInventoryCount = ({
  enabled,
  onlyUnassigned = false,
  isSubscribersOnly = false,
}: {
  enabled: boolean;
  onlyUnassigned?: boolean;
  isSubscribersOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-inventory-count', onlyUnassigned],
    () =>
      axiosProv
        .get(
          `inventory?countOnly=true${onlyUnassigned ? '&unassigned=true' : ''}${
            isSubscribersOnly ? '&subscribersOnly=true' : ''
          }`,
        )
        .then(({ data }) => data.count),
    {
      enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('inventory-fetching-error'))
          toast({
            id: 'inventory-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('inventory.one'),
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

export const useGetInventoryTags = ({
  pageInfo,
  sortInfo,
  owner,
  tagSelect,
  enabled,
  count,
  onlyUnassigned = false,
  isSubscribersOnly = false,
}: {
  pageInfo?: PageInfo;
  sortInfo?: SortInfo;
  owner?: string;
  tagSelect?: string[];
  enabled: boolean;
  count?: number;
  onlyUnassigned?: boolean;
  isSubscribersOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  let sortString = '';
  if (sortInfo && sortInfo.length > 0) {
    sortString = `&orderBy=${sortInfo.map((info) => `${info.id}:${info.sort.charAt(0)}`).join(',')}`;
  }

  if (tagSelect !== undefined && tagSelect !== null) {
    return useQuery(
      ['get-inventory-with-select', tagSelect],
      () =>
        tagSelect.length > 0
          ? axiosProv
              .get(
                `inventory?withExtendedInfo=true&select=${tagSelect}${
                  isSubscribersOnly ? '&subscribersOnly=true' : ''
                }${sortString}`,
              )
              .then(({ data }) => data.taglist)
          : [],
      {
        enabled,
        staleTime: 30000,
        keepPreviousData: true,
        onError: (e: AxiosError) => {
          if (!toast.isActive('get-inventory-tags-fetching-error'))
            toast({
              id: 'get-inventory-tags-fetching-error',
              title: t('common.error'),
              description: t('crud.error_fetching_obj', {
                obj: t('inventory.tags'),
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
  }
  if (owner !== undefined && owner !== null) {
    return useQuery(
      ['get-inventory-with-owner', owner],
      () =>
        axiosProv
          .get(`inventory?serialOnly=true&subscriber=${owner}${sortString}`)
          .then(({ data }) => data.serialNumbers),
      {
        enabled,
        onError: (e: AxiosError) => {
          if (!toast.isActive('get-inventory-tags-fetching-error'))
            toast({
              id: 'get-inventory-tags-fetching-error',
              title: t('common.error'),
              description: t('crud.error_fetching_obj', {
                obj: t('inventory.tags'),
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
  }

  return useQuery(
    ['get-inventory-with-pagination', pageInfo, count, onlyUnassigned, sortInfo],
    () =>
      axiosProv
        .get(
          `inventory?withExtendedInfo=true&limit=${pageInfo?.limit ?? 10}&offset=${
            (pageInfo?.limit ?? 10) * (pageInfo?.index ?? 1)
          }${onlyUnassigned ? '&unassigned=true' : ''}${isSubscribersOnly ? '&subscribersOnly=true' : ''}${sortString}`,
        )
        .then(({ data }) => data.taglist),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e: AxiosError) => {
        if (!toast.isActive('get-inventory-tags-fetching-error'))
          toast({
            id: 'get-inventory-tags-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('inventory.tags'),
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

export const useGetTag = ({ enabled, serialNumber }: { enabled: boolean; serialNumber: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-inventory-tag', serialNumber],
    () => axiosProv.get(`inventory/${serialNumber}`).then(({ data }) => data),
    {
      enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('tag-fetching-error'))
          toast({
            id: 'tag-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('inventory.tag_one'),
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

export const useGetComputedConfiguration = ({ enabled, serialNumber }: { enabled: boolean; serialNumber: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-tag-computed-configuration', serialNumber],
    () => axiosProv.get(`inventory/${serialNumber}?config=true&explain=true`).then(({ data }) => data),
    {
      enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('tag-computed-configuration-fetching-error'))
          toast({
            id: 'tag-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('inventory.computed_configuration'),
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

export const usePushConfig = ({
  onSuccess,
}: {
  onSuccess: (data?: unknown, variables?: void, context?: unknown) => void;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(
    ['apply-tag-configuration'],
    (serialNumber) => axiosProv.get(`inventory/${serialNumber}?applyConfiguration=true`).then(({ data }) => data),
    {
      onSuccess,
      onError: (e: AxiosError) => {
        if (!toast.isActive('apply-tag-configuration'))
          toast({
            id: 'apply-tag-configuration-error',
            title: t('common.error'),
            description: t('configurations.push_configuration_error', {
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

export const useDeleteTag = ({
  name,
  onClose,
  refreshTable,
}: {
  name: string;
  onClose?: () => void;
  refreshTable?: () => void;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation((id: string) => axiosProv.delete(`/inventory/${id}`), {
    onSuccess: () => {
      if (onClose) onClose();
      if (refreshTable) refreshTable();
      toast({
        id: `tag-delete-success${uuid()}`,
        title: t('common.success'),
        description: t('crud.success_delete_obj', {
          obj: name,
        }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e: AxiosError) => {
      toast({
        id: 'tag-delete-error',
        title: t('common.error'),
        description: t('crud.error_delete_obj', {
          obj: name,
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
