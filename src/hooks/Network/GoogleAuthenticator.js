import { useMutation, useQuery } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';
import { Buffer } from 'buffer';

export const useGetGoogleAuthenticatorQrCode = ({ t, toast }) =>
  useQuery(
    ['get-authenticator-qr'],
    () =>
      axiosSec
        .get('totp?reset=true', { responseType: 'arraybuffer' })
        .then(({ data }) => Buffer.from(data, 'binary').toString()),
    {
      onError: (e) => {
        if (!toast.isActive('get-authenticator-qr'))
          toast({
            id: 'get-authenticator-qr-error',
            title: t('common.error'),
            description: t('account.error_fetching_qr', {
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

export const useVerifyAuthenticator = () =>
  useMutation(({ code, index }) => axiosSec.put(`totp?index=${index}&value=${code}`, {}));
