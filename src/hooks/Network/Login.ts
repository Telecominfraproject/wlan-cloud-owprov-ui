import { useMutation } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

interface ChangePassword {
  userId: string;
  password: string;
  newPassword: string;
}

export const useChangePassword = () => useMutation((loginInfo: ChangePassword) => axiosSec.post(`oauth2`, loginInfo));
export const useForgotPassword = () =>
  useMutation((info: { userId: string }) => axiosSec.post(`oauth2?forgotPassword=true`, info));
