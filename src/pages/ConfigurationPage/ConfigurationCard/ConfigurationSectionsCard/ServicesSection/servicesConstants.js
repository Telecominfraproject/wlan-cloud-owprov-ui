import { testFqdnHostname, testIpv4, testLength, testUcMac } from 'constants/formTests';
import { object, number, string, array, bool } from 'yup';

export const SERVICES_INGRESS_FILTER_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    name: string().required(t('form.required')).default(''),
    program: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_USER_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    mac: string()
      .required(t('form.required'))
      .test('services.ieee8021x.user.mac.length', t('form.invalid_mac_uc'), testUcMac)
      .default(''),
    'user-name': string().required(t('form.required')).default(''),
    'vlan-id': number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(4097)
      .integer()
      .default(1),
    password: string()
      .required(t('form.required'))
      .test(
        'services.ieee8021x.user.password.length',
        t('form.min_max_string', { min: 8, max: 63 }),
        (val) => testLength({ val, min: 8, max: 63 }),
      )
      .default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_REALMS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    realm: string().required(t('form.required')).default('*'),
    port: number().required(t('form.required')).moreThan(-1).lessThan(65535).integer().default(22),
    secret: string().required(t('form.required')).default(''),
    'auto-discover': bool().default(false),
    'use-local-certificates': bool().default(false),
    'ca-certificate-filename': string().default(''),
    'ca-certificate': string().required(t('form.required')).default(''),
    'certificate-filename': string().default(''),
    certificate: string().required(t('form.required')).default(''),
    'private-key-filename': string().default(''),
    'private-key': string().required(t('form.required')).default(''),
    'private-key-password': string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_LLDP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    describe: string().required(t('form.required')).default(''),
    location: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_SSH_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    port: number().required(t('form.required')).moreThan(-1).lessThan(65535).integer().default(22),
    'authorized-keys': array()
      .of(string())
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
    'password-authentication': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_NTP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    servers: array()
      .of(string())
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
    'local-server': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_MDNS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_RTTY_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    host: string()
      .required(t('form.required'))
      .test('rtty.host.value', t('form.invalid_fqdn_host'), testFqdnHostname)
      .default(''),
    port: number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(5912),
    token: string()
      .required(t('form.required'))
      .test('rtty.token.length', t('form.min_max_string', { min: 32, max: 32 }), (val) =>
        testLength({ val, min: 32, max: 32 }),
      )
      .default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_LOG_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    host: string()
      .required(t('form.required'))
      .test('rtty.host.value', t('form.invalid_fqdn_host'), testFqdnHostname)
      .default(''),
    port: number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(5912),
    proto: string().required(t('form.required')).default('udp'),
    size: number()
      .required(t('form.required'))
      .moreThan(31)
      .lessThan(65535)
      .integer()
      .default(1000),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_HTTP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'http-port': number()
      .required(t('form.required'))
      .moreThan(0)
      .lessThan(65535)
      .integer()
      .default(80),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_IGMP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_IEEE8021X_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'use-local-certificate': bool().default(false),
    'ca-certificate-filename': string().default(''),
    'ca-certificate': string().required(t('form.required')).default(''),
    'server-certificate-filename': string().default(''),
    'server-certificate': string().required(t('form.required')).default(''),
    'private-key-filename': string().default(''),
    'private-key': string().required(t('form.required')).default(''),
    users: array()
      .of(SERVICES_USER_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_RADIUS_PROXY_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    realms: array()
      .of(SERVICES_REALMS_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_ONLINE_CHECK_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'ping-hosts': array()
      .of(string())
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
    'download-hosts': array()
      .of(string())
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
    'check-interval': number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(60),
    'check-threshold': number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(1),
    action: array()
      .of(string())
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_OPEN_FLOW_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    controller: string()
      .required(t('form.required'))
      .test('open-flow.cidr.value', t('form.invalid_cidr'), testIpv4)
      .default(''),
    mode: string().required(t('form.required')).default('ssl'),
    'ca-certificate-filename': string().default(''),
    'ca-certificate': string().required(t('form.required')).default(''),
    'ssl-certificate-filename': string().default(''),
    'ssl-certificate': string().required(t('form.required')).default(''),
    'private-key-filename': string().default(''),
    'private-key': string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_DATA_PLANE_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'ingress-filters': array()
      .of(SERVICES_INGRESS_FILTER_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_WIFI_STEERING_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    mode: string().required(t('form.required')).default('local'),
    'assoc-steering': bool().default(false),
    'auto-channel': bool().default(false),
    'required-snr': number().required(t('form.required')).integer().default(0),
    'required-probe-snr': number().required(t('form.required')).integer().default(0),
    'required-roam-snr': number().required(t('form.required')).integer().default(0),
    'load-kick-threshold': number().required(t('form.required')).integer().default(0),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_QUALITY_OF_SERVICE_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'upload-rate': number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(0),
    'download-rate': number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(0),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_FACEBOOK_WIFI_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'vendor-id': string().required(t('form.required')).default(''),
    'gateway-id': string().required(t('form.required')).default(''),
    secret: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_AIRTIME_POLICIES_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'dns-match': array()
      .of(string())
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
    'dns-weight': number()
      .required(t('form.required'))
      .moreThan(-1)
      .lessThan(65535)
      .integer()
      .default(256),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_SCHEMA = (t, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Services'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      __selected_subcategories: array().of(string()).default([]),
      lldp: SERVICES_LLDP_SCHEMA(t, useDefault),
      ssh: SERVICES_SSH_SCHEMA(t, useDefault),
      ntp: SERVICES_NTP_SCHEMA(t, useDefault),
      http: SERVICES_HTTP_SCHEMA(t, useDefault),
      mdns: SERVICES_MDNS_SCHEMA(t, useDefault),
      rtty: SERVICES_RTTY_SCHEMA(t, useDefault),
      log: SERVICES_LOG_SCHEMA(t, useDefault),
      igmp: SERVICES_IGMP_SCHEMA(t, useDefault),
      'online-check': SERVICES_ONLINE_CHECK_SCHEMA(t, useDefault),
      'open-flow': SERVICES_OPEN_FLOW_SCHEMA(t, useDefault),
      'wifi-steering': SERVICES_WIFI_STEERING_SCHEMA(t, useDefault),
      'quality-of-service': SERVICES_QUALITY_OF_SERVICE_SCHEMA(t, useDefault),
      'facebook-wifi': SERVICES_FACEBOOK_WIFI_SCHEMA(t, useDefault),
      'airtime-policies': SERVICES_AIRTIME_POLICIES_SCHEMA(t, useDefault),
      'data-plane': SERVICES_DATA_PLANE_SCHEMA(t, useDefault),
      'radius-proxy': SERVICES_RADIUS_PROXY_SCHEMA(t, useDefault),
      ieee8021x: SERVICES_IEEE8021X_SCHEMA(t, useDefault),
    }),
  });

export const getSubSectionDefaults = (t, sub) => {
  switch (sub) {
    case 'lldp':
      return SERVICES_LLDP_SCHEMA(t, true).cast();
    case 'ssh':
      return SERVICES_SSH_SCHEMA(t, true).cast();
    case 'ntp':
      return SERVICES_NTP_SCHEMA(t, true).cast();
    case 'mdns':
      return SERVICES_MDNS_SCHEMA(t, true).cast();
    case 'rtty':
      return SERVICES_RTTY_SCHEMA(t, true).cast();
    case 'log':
      return SERVICES_LOG_SCHEMA(t, true).cast();
    case 'http':
      return SERVICES_HTTP_SCHEMA(t, true).cast();
    case 'igmp':
      return SERVICES_IGMP_SCHEMA(t, true).cast();
    case 'online-check':
      return SERVICES_ONLINE_CHECK_SCHEMA(t, true).cast();
    case 'open-flow':
      return SERVICES_OPEN_FLOW_SCHEMA(t, true).cast();
    case 'wifi-steering':
      return SERVICES_WIFI_STEERING_SCHEMA(t, true).cast();
    case 'quality-of-service':
      return SERVICES_QUALITY_OF_SERVICE_SCHEMA(t, true).cast();
    case 'facebook-wifi':
      return SERVICES_FACEBOOK_WIFI_SCHEMA(t, true).cast();
    case 'airtime-policies':
      return SERVICES_AIRTIME_POLICIES_SCHEMA(t, true).cast();
    case 'data-plane':
      return SERVICES_DATA_PLANE_SCHEMA(t, true).cast();
    case 'ieee8021x':
      return SERVICES_IEEE8021X_SCHEMA(t, true).cast();
    case 'radius-proxy':
      return SERVICES_RADIUS_PROXY_SCHEMA(t, true).cast();
    default:
      return null;
  }
};
