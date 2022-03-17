import { useMutation, useQuery } from 'react-query';
import { axiosAnalytics } from 'utils/axiosInstances';

export const useGetAnalyticsBoard = ({ t, toast, id }) =>
  useQuery(['get-board', id], () => axiosAnalytics.get(`board/${id}`).then(({ data }) => data), {
    enabled: id !== null,
    onError: (e) => {
      if (!toast.isActive('board-fetching-error'))
        toast({
          id: 'board-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('analytics.board'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useGetAnalyticsBoardDevices = ({ t, toast, id }) =>
  useQuery(
    ['get-board-devices', id],
    () => axiosAnalytics.get(`board/${id}/devices`).then(({ data }) => data.devices),
    {
      enabled: id !== null,
      onError: (e) => {
        if (!toast.isActive('board-fetching-error'))
          toast({
            id: 'board-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('analytics.board'),
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

export const useCreateAnalyticsBoard = () => useMutation((newBoard) => axiosAnalytics.post('board/0', newBoard));

export const useUpdateAnalyticsBoard = () =>
  useMutation((newBoard) => axiosAnalytics.put(`board/${newBoard.id}`, newBoard));

export const useDeleteAnalyticsBoard = () => useMutation((id) => axiosAnalytics.delete(`board/${id}`, {}));
