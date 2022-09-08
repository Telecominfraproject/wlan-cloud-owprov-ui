import React, { useState, useMemo, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import { useQuery } from 'react-query';
import {
  axiosAnalytics,
  axiosFms,
  axiosGw,
  axiosInstaller,
  axiosOwls,
  axiosProv,
  axiosSec,
  axiosSub,
  axiosRrm,
} from 'utils/axiosInstances';
import { useGetEndpoints } from 'hooks/Network/Endpoints';
import axios from 'axios';
import { Endpoint } from 'models/Endpoint';
import {
  useDeleteAccountToken,
  useGetAvatar,
  useGetPreferences,
  useGetProfile,
  useUpdatePreferences,
} from 'hooks/Network/Account';
import { Preference } from 'models/Preference';
import { User } from 'models/User';

const getConfigDescriptions = async (baseUrl: string) =>
  axios.get(`${baseUrl.split('/api')[0]}/wwwassets/ucentral.schema.pretty.json`).then(({ data }) => data.$defs);

interface Props {
  token?: string;
  children: React.ReactNode;
}

interface AuthProviderReturn {
  avatar: string;
  refetchUser: () => void;
  refetchAvatar: () => void;
  user?: User;
  token?: string;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  logout: () => void;
  getPref: (preference: string) => string | null;
  setPref: ({ preference, value }: { preference: string; value: string }) => void;
  deletePref: (preference: string) => void;
  ref: React.MutableRefObject<undefined>;
  endpoints: { [key: string]: string } | null;
  configurationDescriptions: Record<string, unknown>;
  isUserLoaded: boolean;
}

const AuthContext = React.createContext({} as AuthProviderReturn);

export const AuthProvider = ({ token, children }: Props) => {
  const ref = useRef();
  const [loadedEndpoints, setLoadedEndpoints] = useState(false);
  const [currentToken, setCurrentToken] = useState(token);
  const [endpoints, setEndpoints] = useState<{ [key: string]: string } | null>(null);
  const { data: configurationDescriptions } = useQuery(
    ['get-configuration-descriptions'],
    () => getConfigDescriptions(axiosProv.defaults.baseURL ?? ''),
    {
      staleTime: Infinity,
      enabled: loadedEndpoints,
    },
  );
  const { data: user, refetch: refetchUser } = useGetProfile();
  const { refetch: refetchEndpoints } = useGetEndpoints({
    onSuccess: (newEndpoints: Endpoint[]) => {
      const foundEndpoints: { [key: string]: string } = {};
      for (const endpoint of newEndpoints) {
        foundEndpoints[endpoint.type] = endpoint.uri;
        switch (endpoint.type) {
          case 'owprov':
            axiosProv.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owfms':
            axiosFms.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owgw':
            axiosGw.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owsub':
            axiosSub.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owls':
            axiosOwls.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owanalytics':
            axiosAnalytics.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owinstaller':
            axiosInstaller.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          case 'owrrm':
            axiosRrm.defaults.baseURL = `${endpoint.uri}/api/v1`;
            break;
          default:
            break;
        }
      }
      setEndpoints(foundEndpoints);
      setLoadedEndpoints(true);
    },
  });
  const userId = user?.id ?? '';
  const userAvatar = user?.avatar ?? '';
  const { data: preferences } = useGetPreferences({ enabled: !!userId });
  const { data: avatar, refetch: refetchAvatar } = useGetAvatar({
    id: userId,
    enabled: !!userId && userAvatar !== '0' && userAvatar !== '',
    cache: userAvatar,
  });
  const updatePreferences = useUpdatePreferences();

  const logout = useDeleteAccountToken({ setCurrentToken });
  const logoutUser = () => logout.mutateAsync(currentToken ?? '');

  const getPref = (preference: string) => {
    for (const pref of preferences ?? []) {
      if (pref.tag === preference) return pref.value;
    }
    return null;
  };

  const setPref = ({ preference, value }: { preference: string; value: string }) => {
    let updated = false;
    if (preferences) {
      const newPreferences: Preference[] = preferences.map((pref: Preference) => {
        if (pref.tag === preference) {
          updated = true;
          return { tag: pref.tag, value };
        }
        return pref;
      });

      if (!updated) newPreferences.push({ tag: preference, value });

      updatePreferences.mutateAsync(newPreferences);
    }
  };

  const deletePref = (preference: string) => {
    if (preferences) {
      const newPreferences: Preference[] = preferences.filter((pref: Preference) => pref.tag !== preference);

      updatePreferences.mutateAsync(newPreferences);
    }
  };

  useEffect(() => {
    if (currentToken) {
      axiosSec.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosGw.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosProv.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosFms.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosSub.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosOwls.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosAnalytics.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosInstaller.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
      axiosRrm.defaults.headers.common.Authorization = `Bearer ${currentToken}`;

      refetchUser();
      refetchEndpoints();
    }
  }, [currentToken]);

  const value: AuthProviderReturn = useMemo(
    () => ({
      avatar: avatar?.data
        ? `data:;base64,${btoa(
            new Uint8Array(avatar.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),
          )}`
        : '',
      refetchUser,
      refetchAvatar,
      user,
      token: currentToken,
      setToken: setCurrentToken,
      logout: logoutUser,
      ref,
      getPref,
      setPref,
      deletePref,
      endpoints,
      configurationDescriptions,
      isUserLoaded: preferences !== undefined && user !== undefined && loadedEndpoints,
    }),
    [currentToken, user, avatar, preferences, loadedEndpoints, configurationDescriptions, endpoints, ref],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthProvider.defaultProps = {
  token: '',
};

export const useAuth: () => AuthProviderReturn = () => React.useContext(AuthContext);
