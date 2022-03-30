import { testLength, testUcMac } from 'constants/formTests';
import { object, number, string, array, bool } from 'yup';

export const CREATE_INTERFACE_SCHEMA = (t) =>
  object().shape({
    name: string().required(t('form.required')).default(''),
    role: string().required(t('form.required')).default('upstream'),
  });

export const INTERFACE_SSID_RADIUS_LOCAL_USER_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    mac: string()
      .required(t('form.required'))
      .test('services.ieee8021x.user.mac.length', t('form.invalid_mac_uc'), testUcMac)
      .default(''),
    'user-name': string().required(t('form.required')).default(''),
    'vlan-id': number().required(t('form.required')).moreThan(-1).lessThan(4097).integer().default(1),
    password: string()
      .required(t('form.required'))
      .test('services.ieee8021x.user.password.length', t('form.min_max_string', { min: 8, max: 63 }), (val) =>
        testLength({ val, min: 8, max: 63 }),
      )
      .default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_RADIUS_LOCAL_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'server-identity': string().required(t('form.required')).default('uCentral'),
      users: array()
        .of(INTERFACE_SSID_RADIUS_LOCAL_USER_SCHEMA(t, useDefault))
        .required(t('form.required'))
        .min(1, t('form.required'))
        .default([]),
    })
    .default({
      'server-identity': 'uCentral',
      users: [],
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_RADIUS_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'nas-identifier': string().default(undefined),
      'chargeable-user-id': bool().default(undefined),
      authentication: object()
        .shape({
          host: string().required(t('form.required')).default('192.168.178.192'),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1812),
          secret: string().required(t('form.required')).min(8).max(63).default('YOUR_SECRET'),
        })
        .nullable()
        .default(undefined),
      accounting: object()
        .shape({
          host: string().required(t('form.required')).default('192.168.178.192'),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
          secret: string().required(t('form.required')).min(8).max(63).default('YOUR_SECRET'),
        })
        .nullable()
        .default(undefined),
      'dynamic-authorization': object()
        .shape({
          host: string().required(t('form.required')).default('YOUR_SECRET'),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
          secret: string().required(t('form.required')).min(8).max(63).default(''),
        })
        .nullable()
        .default(undefined),
    })
    .default({
      authentication: {
        host: '192.168.178.192',
        port: 1812,
        secret: 'YOUR_SECRET',
      },
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

const keyProtos = ['psk', 'psk2', 'psk-mixed', 'sae-mixed'];

export const INTERFACE_SSID_ENCRYPTION_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      proto: string().required(t('form.required')).default('psk'),
      ieee80211w: string().required(t('form.required')).default('disabled'),
      key: string()
        .when('proto', {
          is: (v) => keyProtos.includes(v),
          then: string().required(t('form.required')).min(8).max(63).default(''),
          otherwise: string().nullable(),
        })
        .default(''),
    })
    .default({
      proto: 'psk',
      ieee80211w: 'disabled',
      key: 'YOUR_SECRET',
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_ROAMING_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'message-exchange': string().required(t('form.required')).default('ds'),
      'generate-psk': bool().required(t('form.required')).default(false),
      'domain-identifier': string().required(t('form.required')).default(''),
      'pmk-r0-key-holder': string().required(t('form.required')).default(''),
      'pmk-r1-key-holder': string().required(t('form.required')).default(''),
    })
    .default({
      'message-exchange': 'ds',
      'generate-psk': false,
      'domain-identifier': '',
      'pmk-r0-key-holder': '',
      'pmk-r1-key-holder': '',
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_RRM_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'neighbor-reporting': bool().required(t('form.required')).default(false),
      lci: string().required(t('form.required')).default(''),
      'civic-location': string().required(t('form.required')).default(''),
      'ftm-responder': bool().required(t('form.required')).default(false),
      'stationary-ap': bool().required(t('form.required')).default(false),
    })
    .default({
      'neighbor-reporting': false,
      lci: '',
      'civic-location': '',
      'ftm-responder': false,
      'stationary-ap': false,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    name: string().required(t('form.required')).default('YOUR_SSID'),
    purpose: string().default(undefined),
    'wifi-bands': array().of(string()).required(t('form.required')).min(1, t('form.required')).default(['2G', '5G']),
    'bss-mode': string().required(t('form.required')).default('ap'),
    'hidden-ssid': bool().required(t('form.required')).default(false),
    'isolate-clients': bool().required(t('form.required')).default(false),
    'power-save': bool().default(undefined),
    'broadcast-time': bool().default(undefined),
    'unicast-conversion': bool().default(undefined),
    services: array().of(string()).default([]),
    'maximum-clients': number().required(t('form.required')).moreThan(0).lessThan(65535).integer().default(64),
    'proxy-arp': bool().default(undefined),
    'disassoc-low-ack': bool().default(undefined),
    'vendor-elements': string(),
    encryption: INTERFACE_SSID_ENCRYPTION_SCHEMA(t, useDefault),
    rrm: INTERFACE_SSID_RRM_SCHEMA(t),
    roaming: INTERFACE_SSID_ROAMING_SCHEMA(t),
    radius: INTERFACE_SSID_RADIUS_SCHEMA(t),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV4_DHCP_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'lease-first': number().required(t('form.required')).positive().integer().default(1),
      'lease-count': number().required(t('form.required')).positive().integer().default(1),
      'lease-time': string().required(t('form.required')).default('6h'),
      'relay-server': string().default(''),
    })
    .default({
      'lease-first': 1,
      'lease-count': 1,
      'lease-time': '6h',
      'relay-server': '',
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV4_DHCP_LEASE_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      macaddr: string().required(t('form.required')).default(''),
      'lease-time': string().required(t('form.required')).default('6h'),
      'static-lease-offset': number().required(t('form.required')).positive().integer().default(1),
      'publish-hostname': bool().required(t('form.required')).default(true),
    })
    .default({
      macaddr: '',
      'lease-time': '6h',
      'static-lease-offset': 1,
      'publish-hostname': true,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_BRIDGE_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      mtu: number().required(t('form.required')).moreThan(255).lessThan(65535).integer().default(1500),
      'tx-queue-len': number().required(t('form.required')).positive().integer().default(5000),
      'isolate-ports': bool().required(t('form.required')).default(false),
    })
    .default({ mtu: 1500, 'tx-queue-len': 5000, 'isolate-ports': false });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV4_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    addressing: string().required(t('form.required')).default('dynamic'),
    subnet: string().when('addressing', {
      is: 'dynamic',
      then: string().nullable(),
      otherwise: string().required(t('form.required')).default(''),
    }),
    gateway: string().when('addressing', {
      is: 'dynamic',
      then: string().nullable(),
      otherwise: string().required(t('form.required')).default(''),
    }),
    'send-hostname': bool().when('addressing', {
      is: 'dynamic',
      then: bool().nullable(),
      otherwise: bool().required(t('form.required')).default(true),
    }),
    'use-dns': array().when('addressing', {
      is: 'dynamic',
      then: array().nullable(),
      otherwise: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
    }),
    dhcp: INTERFACE_IPV4_DHCP_SCHEMA(t, useDefault),
    'dhcp-lease': INTERFACE_IPV4_DHCP_LEASE_SCHEMA(t, useDefault),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_TUNNEL_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    proto: string().default(undefined),
    'peer-address': string().when('proto', {
      is: (v) => v === 'vxlan' || v === 'gre',
      then: string().required(t('form.required')).default(''),
      otherwise: string().nullable(),
    }),
    'peer-port': number().when('proto', {
      is: 'vxlan',
      then: number().required(t('form.required')).moreThan(0).lessThan(65535).integer().default(4700),
      otherwise: number().nullable(),
    }),
    server: string().when('proto', {
      is: 'l2tp',
      then: string().required(t('form.required')).default(''),
      otherwise: string().nullable(),
    }),
    'user-name': string().when('proto', {
      is: 'l2tp',
      then: string().required(t('form.required')).default(''),
      otherwise: string().nullable(),
    }),
    password: string().when('proto', {
      is: 'l2tp',
      then: string().required(t('form.required')).min(8).max(63).default(''),
      otherwise: string().nullable(),
    }),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SINGLE_INTERFACE_SCHEMA = (
  t,
  useDefault = false,
  role = 'upstream',
  name = '',
  initialCreation = false,
) => {
  const shape = object().shape({
    name: string().required(t('form.required')).default(name),
    role: string().required(t('form.required')).default(role),
    'isolate-hosts': bool().default(undefined),
    services: array().of(string()).default(undefined),
    ethernet: array()
      .of(
        object().shape({
          'select-ports': array().of(string()).default([]),
        }),
      )
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([{ 'select-ports': [] }]),
    vlan: initialCreation
      ? object().shape().nullable().default(undefined)
      : object().shape({
          id: number().required(t('form.required')).moreThan(0).lessThan(4051).default(1080),
        }),
    ipv4: initialCreation
      ? object()
          .shape({ addressing: string().required(t('form.required')) })
          .default({ addressing: 'dynamic' })
      : INTERFACE_IPV4_SCHEMA(t, useDefault),
    tunnel: INTERFACE_TUNNEL_SCHEMA(t, useDefault),
    ssids: array().of(INTERFACE_SSID_SCHEMA(t, useDefault)).default([]),
    'hostapd-bss-raw': array().of(string()).default(undefined),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACES_SCHEMA = (t, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Interfaces'),
    description: string().default(''),
    weight: number().required(t('form.required')).positive().integer().default(1),
    configuration: array()
      .of(SINGLE_INTERFACE_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

export const getSingleInterfaceDefault = (t) => SINGLE_INTERFACE_SCHEMA(t, true);
