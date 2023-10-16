/* eslint-disable no-await-in-loop */
import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Note } from 'models/Note';
import { axiosProv } from 'utils/axiosInstances';

export type GlobalReachAccount = {
  id: string;
  created: number;
  modified: number;
  name: string;
  description: string;
  notes: Note[];
  privateKey: string;
  country: string;
  province: string;
  city: string;
  organization: string;
  commonName: string;
  CSR: string;
  GlobalReachAcctId: string;
};

const ACCOUNT_QUERY_KEY_PREFIX = 'globalReach';
const ACCOUNT_PATH = '/openroaming/globalreach/account';
const ACCOUNTS_PATH = '/openroaming/globalreach/accounts';

const getGlobalReachAccounts = async (limit: number, offset: number) =>
  axiosProv.get(`${ACCOUNTS_PATH}?limit=${limit}&offset=${offset}`).then(({ data }) => data as GlobalReachAccount[]);

const getAllGlobalReachAccounts = async () => {
  const batchSize = 500;
  let offset = 0;
  let accounts: GlobalReachAccount[] = [];
  let lastBatchSize = 0;

  do {
    const batch = await getGlobalReachAccounts(batchSize, offset);
    lastBatchSize = batch.length;
    accounts = accounts.concat(batch);
    offset += batchSize;
  } while (lastBatchSize === batchSize);

  return accounts;
};

export const useGetGlobalReachAccounts = () =>
  useQuery({
    queryKey: [ACCOUNT_QUERY_KEY_PREFIX, 'all'],
    queryFn: getAllGlobalReachAccounts,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

const getGlobalReachAccount = async (context: QueryFunctionContext<[string, { id: string }]>) =>
  axiosProv.get(`${ACCOUNT_PATH}/${context.queryKey[1].id}`).then(({ data }) => data as GlobalReachAccount);

export const useGetGlobalReachAccount = (id: string) =>
  useQuery({
    queryKey: [ACCOUNT_QUERY_KEY_PREFIX, { id }],
    queryFn: getGlobalReachAccount,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

export type CreateGlobalReachAccountRequest = {
  name: string;
  description?: string;
  notes?: Note[];
  privateKey: string;
  country: string;
  province: string;
  city: string;
  organization: string;
  commonName: string;
  GlobalReachAcctId: string;
};
const createGlobalReachAccount = async (req: CreateGlobalReachAccountRequest) =>
  axiosProv.post(`${ACCOUNT_PATH}/0`, req).then(({ data }) => data as GlobalReachAccount);

export const useCreateGlobalReachAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGlobalReachAccount,
    onSuccess: () => {
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY_PREFIX]);
    },
  });
};

export type UpdateGlobalReachAccountRequest = {
  id: string;
  name?: string;
  description?: string;
  notes?: Note[];
  privateKey?: string;
  country?: string;
  province?: string;
  city?: string;
  organization?: string;
  commonName?: string;
};

const updateGlobalReachAccount = async (req: UpdateGlobalReachAccountRequest) =>
  axiosProv.put(`${ACCOUNT_PATH}/${req.id}`, req).then(({ data }) => data as GlobalReachAccount);

export const useUpdateGlobalReachAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGlobalReachAccount,
    onSuccess: () => {
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY_PREFIX]);
    },
  });
};

const deleteGlobalReachAccount = async (id: string) => axiosProv.delete(`${ACCOUNT_PATH}/${id}`);

export const useDeleteGlobalReachAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGlobalReachAccount,
    onSuccess: () => {
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY_PREFIX]);
    },
  });
};

export type GlobalReachCertificate = {
  id: string;
  name: string;
  accountId: string;
  csr: string;
  certificate: string;
  certificateChain: string;
  certificateId: string;
  expiresAt: number;
  created: number;
};

const CERTIFICATE_QUERY_KEY_PREFIX = 'globalReachCertificate';
const CERTIFICATE_PATH = '/openroaming/globalreach/certificate';
const CERTIFICATES_PATH = '/openroaming/globalreach/certificates';

const getGlobalReachCertificatesBatch = async (accountId: string, limit: number, offset: number) =>
  axiosProv
    .get(`${CERTIFICATES_PATH}/${accountId}?limit=${limit}&offset=${offset}`)
    .then(({ data }) => data as GlobalReachCertificate[]);

const getGlobalReachCertificates = async (context: QueryFunctionContext<[string, { accountId: string }]>) => {
  const { accountId } = context.queryKey[1];
  const batchSize = 500;
  let offset = 0;
  let certificates: GlobalReachCertificate[] = [];
  let lastBatchSize = 0;

  do {
    const batch = await getGlobalReachCertificatesBatch(accountId, batchSize, offset);
    lastBatchSize = batch.length;
    certificates = certificates.concat(batch);
    offset += batchSize;
  } while (lastBatchSize === batchSize);

  return certificates;
};

export const useGetGlobalReachCertificates = (accountId: string) =>
  useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, { accountId }],
    queryFn: getGlobalReachCertificates,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

const getSelectedGlobalReachCertificates = async (context: QueryFunctionContext<[string, { certIds: string[] }]>) =>
  axiosProv
    .get(`${CERTIFICATES_PATH}/*?select=${context.queryKey[1].certIds.join(',')}`)
    .then(({ data }) => data as GlobalReachCertificate[]);

export const useGetSelectedGlobalReachCertificates = ({ certIds }: { certIds: string[] }) =>
  useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, { certIds }],
    queryFn: getSelectedGlobalReachCertificates,
    staleTime: 1000 * 60,
    enabled: certIds.length > 0,
    keepPreviousData: true,
  });

const getGlobalReachCertificate = async (context: QueryFunctionContext<[string, { accountId: string; id: string }]>) =>
  axiosProv
    .get(`${CERTIFICATE_PATH}/${context.queryKey[1].accountId}/${context.queryKey[1].id}`)
    .then(({ data }) => data as GlobalReachCertificate);

export const useGetGlobalReachCertificate = (accountId: string, id: string) =>
  useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY_PREFIX, { accountId, id }],
    queryFn: getGlobalReachCertificate,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

export type CreateGlobalReachCertificateRequest = {
  accountId: string;
  name: string;
};

const createGlobalReachCertificate = async (req: CreateGlobalReachCertificateRequest) =>
  axiosProv.post(`${CERTIFICATE_PATH}/${req.accountId}/0`, req).then(({ data }) => data as GlobalReachCertificate);

export const useCreateGlobalReachCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGlobalReachCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries([CERTIFICATE_QUERY_KEY_PREFIX]);
    },
  });
};

const renewGlobalReachCertificate = async ({ accountId, id }: { accountId: string; id: string }) =>
  axiosProv
    .put(`${CERTIFICATE_PATH}/${accountId}/${id}?updateCertificate=true`, {})
    .then(({ data }) => data as GlobalReachCertificate);

export const useRenewGlobalReachCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: renewGlobalReachCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries([CERTIFICATE_QUERY_KEY_PREFIX]);
    },
  });
};

const deleteGlobalReachCertificate = async ({ accountId, id }: { accountId: string; id: string }) =>
  axiosProv.delete(`${CERTIFICATE_PATH}/${accountId}/${id}`);

export const useDeleteGlobalReachCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGlobalReachCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries([CERTIFICATE_QUERY_KEY_PREFIX]);
    },
  });
};
