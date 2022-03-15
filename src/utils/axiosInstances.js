import * as axios from 'axios';
import { AUTH_EXPIRED_TOKEN_CODE, AUTH_INVALID_TOKEN_CODE } from 'constants/apiErrors';

const secUrl = 'https://ucentral.dpaas.arilia.com:16001/api/v1/';
const sec = axios.create({ baseURL: secUrl });

sec.defaults.timeout = 60000;
sec.defaults.headers.get.Accept = 'application/json';
sec.defaults.headers.post.Accept = 'application/json';

sec.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const prov = axios.create({ baseURL: secUrl });

prov.defaults.timeout = 60000;
prov.defaults.headers.get.Accept = 'application/json';
prov.defaults.headers.post.Accept = 'application/json';

prov.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const gw = axios.create({ baseURL: secUrl });

gw.defaults.timeout = 60000;
gw.defaults.headers.get.Accept = 'application/json';
gw.defaults.headers.post.Accept = 'application/json';

gw.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const fms = axios.create({ baseURL: secUrl });

fms.defaults.timeout = 60000;
fms.defaults.headers.get.Accept = 'application/json';
fms.defaults.headers.post.Accept = 'application/json';

fms.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const sub = axios.create({ baseURL: secUrl });

sub.defaults.timeout = 60000;
sub.defaults.headers.get.Accept = 'application/json';
sub.defaults.headers.post.Accept = 'application/json';

sub.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const owls = axios.create({ baseURL: secUrl });

owls.defaults.timeout = 60000;
owls.defaults.headers.get.Accept = 'application/json';
owls.defaults.headers.post.Accept = 'application/json';

owls.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const analytics = axios.create({ baseURL: secUrl });

analytics.defaults.timeout = 60000;
analytics.defaults.headers.get.Accept = 'application/json';
analytics.defaults.headers.post.Accept = 'application/json';

analytics.interceptors.response.use(
  // Success actions
  undefined,
  (error) => {
    switch (error?.response?.status) {
      case 401:
        break;
      case 403:
        if (
          error.response.data?.ErrorCode === AUTH_EXPIRED_TOKEN_CODE ||
          error.response.data?.ErrorCode === AUTH_INVALID_TOKEN_CODE
        ) {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
          window.location.href = 'login';
        }
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

export const axiosProv = prov;
export const axiosSec = sec;
export const axiosGw = gw;
export const axiosFms = fms;
export const axiosSub = sub;
export const axiosOwls = owls;
export const axiosAnalytics = analytics;
