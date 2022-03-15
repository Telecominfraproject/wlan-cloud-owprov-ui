import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetInventoryCount = ({ t, toast, enabled, onlyUnassigned = false }) =>
  useQuery(
    ['get-inventory-count', onlyUnassigned],
    () =>
      axiosProv
        .get(`inventory?countOnly=true${onlyUnassigned ? '&unassigned=true' : ''}`)
        .then(({ data }) => data.count),
    {
      enabled,
      staleTime: 30000,
      onError: (e) => {
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

export const useGetInventoryTags = ({
  t,
  toast,
  pageInfo,
  owner,
  tagSelect,
  enabled,
  count,
  onlyUnassigned = false,
}) => {
  if (tagSelect !== undefined && tagSelect !== null) {
    return useQuery(
      ['get-inventory-with-select', tagSelect],
      () =>
        tagSelect.length > 0
          ? axiosProv
              .get(`inventory?withExtendedInfo=true&select=${tagSelect}`)
              .then(({ data }) => data.taglist)
          : [],
      {
        enabled,
        staleTime: 30000,
        keepPreviousData: true,
        onError: (e) => {
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
          .get(`inventory?serialOnly=true&subscriber=${owner}`)
          .then(({ data }) => data.serialNumbers),
      {
        enabled,
        onError: (e) => {
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
    ['get-inventory-with-pagination', pageInfo, count, onlyUnassigned],
    () =>
      axiosProv
        .get(
          `inventory?withExtendedInfo=true&limit=${pageInfo?.limit ?? 10}&offset=${
            (pageInfo?.limit ?? 10) * (pageInfo?.index ?? 1)
          }${onlyUnassigned ? '&unassigned=true' : ''}`,
        )
        .then(({ data }) => data.taglist),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e) => {
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

export const useGetTag = ({ t, toast, enabled, serialNumber }) =>
  useQuery(
    ['get-inventory-tag', serialNumber],
    () => axiosProv.get(`inventory/${serialNumber}`).then(({ data }) => data),
    {
      enabled,
      onError: (e) => {
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

export const useGetComputedConfiguration = ({ t, toast, enabled, serialNumber }) =>
  useQuery(
    ['get-tag-computed-configuration', serialNumber],
    () =>
      axiosProv.get(`inventory/${serialNumber}?config=true&explain=true`).then(({ data }) => data),
    {
      enabled,
      onError: (e) => {
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

export const usePushConfig = ({ t, toast, onSuccess }) =>
  useMutation(
    ['apply-tag-configuration'],
    (serialNumber) =>
      axiosProv.get(`inventory/${serialNumber}?applyConfiguration=true`).then(({ data }) => data),
    {
      onSuccess,
      onError: (e) => {
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

const claimDevices = async (serialNumbers, entity, isVenue) => {
  const unassignPromises = serialNumbers.map(async (serialNumber) =>
    axiosProv
      .put(`inventory/${serialNumber}?unassign=true`, {})
      .then(() => ({
        serialNumber,
      }))
      .catch(() => ({ serialNumber, error: true })),
  );

  const addPromises = serialNumbers.map(async (serialNumber) =>
    axiosProv
      .put(`inventory/${serialNumber}`, {
        entity: !isVenue ? entity : undefined,
        venue: isVenue ? entity : undefined,
      })
      .then(() => ({
        serialNumber,
      }))
      .catch(() => ({ serialNumber, error: true })),
  );

  const unassignResults = await Promise.all(unassignPromises);
  const unassignErrors = await unassignResults
    .filter((res) => res.error)
    .map((res) => res.serialNumber);

  const claimResults = await Promise.all(addPromises);
  const claimErrors = claimResults.filter((res) => res.error).map((res) => res.serialNumber);

  return { claimErrors, unassignErrors };
};

export const useClaimInventory = ({ entity, isVenue }) =>
  useMutation((serialNumbers) => claimDevices(serialNumbers, entity, isVenue));

export const useRemoveClaim = () =>
  useMutation((serialNumber) => axiosProv.put(`inventory/${serialNumber}?unassign=true`, {}));
