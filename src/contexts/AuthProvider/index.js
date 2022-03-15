import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  axiosAnalytics,
  axiosFms,
  axiosGw,
  axiosOwls,
  axiosProv,
  axiosSec,
  axiosSub,
} from 'utils/axiosInstances';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useGetEndpoints } from 'hooks/Network/Endpoints';
import axios from 'axios';

const AuthContext = React.createContext();

const deleteToken = async (currentToken) =>
  axiosSec
    .delete(`/oauth2/${currentToken}`)
    .then(() => true)
    .catch(() => false);

const getAvatar = async (id, cache) =>
  axiosSec.get(`avatar/${id}?cache=${cache}`, { responseType: 'arraybuffer' });

const getConfigDescriptions = async (baseUrl) =>
  axios
    .get(`${baseUrl.split('/api')[0]}wwwassets/ucentral.schema.pretty.json`)
    .then(({ data }) => data.$defs);
const getUser = async () => axiosSec.get('oauth2?me=true').then(({ data }) => data);

const getPreferences = async () => axiosSec.get('preferences').then(({ data }) => data);

const putPreferences = async (newPrefs) => axiosSec.put(`preferences`, newPrefs);

export const AuthProvider = ({ token, children }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loadedEndpoints, setLoadedEndpoints] = useState(false);
  const [currentToken, setCurrentToken] = useState(token ?? '');
  const queryClient = useQueryClient();
  const { data: configurationDescriptions } = useQuery(
    ['get-configuration-descriptions'],
    () => getConfigDescriptions(axiosProv.defaults.baseURL),
    {
      staleTime: Infinity,
      enabled: loadedEndpoints,
    },
  );
  const { data: user, refetch: refetchUser } = useQuery(['get-user-profile'], getUser, {
    enabled: false,
    onError: (e) => {
      if (!toast.isActive('user-fetching-error'))
        toast({
          id: 'user-fetching-error',
          title: t('common.error'),
          description: t('user.error_fetching', { e: e?.response?.data?.ErrorDescription }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });
  const { refetch: refetchEndpoints } = useGetEndpoints({
    t,
    toast,
    onSuccess: (endpoints) => {
      for (const endpoint of endpoints) {
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
          default:
            break;
        }
      }
      setLoadedEndpoints(true);
    },
  });
  const userId = user?.id;
  const userAvatar = user?.avatar ?? '';
  const { data: preferences, refetch: refetchAvatar } = useQuery(
    ['get-preferences', userId],
    () => getPreferences(userId),
    {
      enabled: !!userId,
    },
  );
  const { data: avatar } = useQuery(
    ['get-user-avatar', userId, userAvatar],
    () => getAvatar(userId, userAvatar),
    {
      enabled: userAvatar !== '' && userAvatar !== '0',
    },
  );
  const updatePreferences = useMutation((newPrefs) => putPreferences(newPrefs), {
    onSuccess: (data) => {
      queryClient.setQueryData(['get-preferences', userId], data.data);
    },
  });

  const logout = useMutation(() => deleteToken(currentToken), {
    onSettled: () => {
      localStorage.removeItem('access_token');
      sessionStorage.clear();
      setCurrentToken('');
      window.location.replace('/');
    },
  });

  const logoutUser = () => logout.mutate();

  const getPref = (preference) => {
    for (const pref of preferences.data) {
      if (pref.tag === preference) return pref.value;
    }
    return null;
  };

  const setPref = ({ preference, value }) => {
    let updated = false;
    const newPreferences = [...preferences.data];

    for (const [i, pref] of preferences.data.entries()) {
      if (pref.tag === preference) {
        newPreferences[i].value = value;
        updated = true;
        break;
      }
    }

    if (!updated) newPreferences.push({ tag: preference, value });

    updatePreferences.mutateAsync({
      data: newPreferences,
    });
  };

  const deletePref = (preference) => {
    const newPreferences = preferences.data.filter((pref) => pref.tag !== preference);

    updatePreferences.mutateAsync({
      data: newPreferences,
    });
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
      refetchUser();
      refetchEndpoints();
    }
  }, [currentToken]);

  const value = useMemo(
    () => ({
      avatar: avatar?.data
        ? `data:;base64,${btoa(
            new Uint8Array(avatar.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          )}`
        : '',
      refetchUser,
      refetchAvatar,
      user,
      token: currentToken,
      setToken: setCurrentToken,
      logout: logoutUser,
      getPref,
      setPref,
      deletePref,
      configurationDescriptions,
      isUserLoaded: preferences !== undefined && user !== undefined && loadedEndpoints,
    }),
    [currentToken, user, avatar, preferences, loadedEndpoints],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  token: PropTypes.string,
  children: PropTypes.node.isRequired,
};

AuthProvider.defaultProps = {
  token: '',
};

export const useAuth = () => React.useContext(AuthContext);
