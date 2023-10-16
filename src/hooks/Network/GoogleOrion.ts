/* eslint-disable no-await-in-loop */
import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Note } from 'models/Note';
import { axiosProv } from 'utils/axiosInstances';

export type GoogleOrionAccount = {
  name: string;
  description: string;
  notes: Note[];
  created: number;
  modified: number;
  id: string;
  privateKey: string;
  certificate: string;
  cacerts: string[];
};

const ACCOUNT_QUERY_KEY_PREFIX = 'googleOrion';
const ACCOUNT_PATH = '/openroaming/orion/account';
const ACCOUNTS_PATH = '/openroaming/orion/accounts';

const getGoogleOrionAccounts = async (limit: number, offset: number) =>
  axiosProv.get(`${ACCOUNTS_PATH}?limit=${limit}&offset=${offset}`).then(({ data }) => data as GoogleOrionAccount[]);

const getAllGoogleOrionAccounts = async () => {
  const batchSize = 500;
  let offset = 0;
  let accounts: GoogleOrionAccount[] = [];
  let lastBatchSize = 0;

  do {
    const batch = await getGoogleOrionAccounts(batchSize, offset);
    lastBatchSize = batch.length;
    accounts = accounts.concat(batch);
    offset += batchSize;
  } while (lastBatchSize === batchSize);

  return accounts;
};

export const useGetGoogleOrionAccounts = () =>
  useQuery({
    queryKey: [ACCOUNT_QUERY_KEY_PREFIX, 'all'],
    queryFn: getAllGoogleOrionAccounts,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

const getGoogleOrionAccount = async (context: QueryFunctionContext<[string, { id: string }]>) =>
  axiosProv.get(`${ACCOUNT_PATH}/${context.queryKey[1].id}`).then(({ data }) => data as GoogleOrionAccount);

export const useGetGoogleOrionAccount = (id: string) =>
  useQuery({
    queryKey: [ACCOUNT_QUERY_KEY_PREFIX, { id }],
    queryFn: getGoogleOrionAccount,
    staleTime: 1000 * 60,
  });

export type CreateGoogleOrionAccountRequest = {
  name: string;
  description?: string;
  notes?: Note[];
  privateKey: string;
  certificate: string;
  cacerts: string[];
};

const createGoogleOrionAccount = async (request: CreateGoogleOrionAccountRequest) =>
  axiosProv.post(`${ACCOUNT_PATH}/0`, request).then(({ data }) => data as GoogleOrionAccount);

export const useCreateGoogleOrionAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoogleOrionAccount,
    onSuccess: () => {
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY_PREFIX]);
    },
  });
};

export type UpdateGoogleOrionAccountRequest = {
  id: string;
  name?: string;
  description?: string;
  notes?: Note[];
};

const updateGoogleOrionAccount = async (request: UpdateGoogleOrionAccountRequest) =>
  axiosProv
    .put(`${ACCOUNT_PATH}/${request.id}`, {
      name: request.name,
      description: request.description,
      notes: request.notes,
    })
    .then(({ data }) => data as GoogleOrionAccount);

export const useUpdateGoogleOrionAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGoogleOrionAccount,
    onSuccess: () => {
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY_PREFIX]);
    },
  });
};

export const useDeleteGoogleOrionAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => axiosProv.delete(`${ACCOUNT_PATH}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY_PREFIX]);
    },
  });
};
