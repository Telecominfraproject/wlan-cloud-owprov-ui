import {
  isValidPortRange,
  isValidPortRanges,
  testIpv4,
  testIpv6,
  testLeaseTime,
  testLength,
  testSelectPorts,
  testUcMac,
} from 'constants/formTests';
import { object, number, string, array, bool } from 'yup';

export const ENCRYPTION_PROTOS_REQUIRE_KEY = ['psk', 'psk2', 'psk-mixed', 'psk2-radius', 'sae', 'sae-mixed'];
export const ENCRYPTION_PROTOS_REQUIRE_IEEE = [
  'psk',
  'psk2',
  'psk2-radius',
  'psk-mixed',
  'wpa',
  'wpa2',
  'wpa-mixed',
  'sae',
  'sae-mixed',
  'wpa3',
  'wpa3-192',
  'wpa3-mixed',
  'owe',
  'owe-transition',
];
export const ENCRYPTION_PROTOS_REQUIRE_RADIUS = [
  'psk2-radius',
  'wpa',
  'wpa2',
  'wpa-mixed',
  'wpa3',
  'wpa3-192',
  'wpa3-mixed',
];
export const ENCRYPTION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'psk', label: 'WPA-PSK' },
  { value: 'psk2', label: 'WPA2-PSK' },
  { value: 'psk2-radius', label: 'PSK2-RADIUS' },
  { value: 'psk-mixed', label: 'WPA-PSK/WPA2-PSK Personal Mixed' },
  { value: 'wpa', label: 'WPA-Enterprise' },
  { value: 'wpa2', label: 'WPA2-Enterprise EAP-TLS' },
  { value: 'wpa-mixed', label: 'WPA-Enterprise-Mixed' },
  { value: 'sae', label: 'SAE' },
  { value: 'sae-mixed', label: 'WPA2/WPA3 Transitional' },
  { value: 'wpa3', label: 'WPA3-Enterprise EAP-TLS' },
  { value: 'wpa3-192', label: 'WPA3-192-Enterprise EAP-TLS' },
  { value: 'owe', label: 'OWE' },
  { value: 'owe-transition', label: 'OWE-Transition' },
];
export const ENCRYPTION_PROTOS_NO_6G = ['owe-transition'];

export const CREATE_INTERFACE_SCHEMA = (t) =>
  object().shape({
    name: string().required(t('form.required')).default(''),
    role: string().required(t('form.required')).default('upstream'),
  });

export const INTERFACE_SSID_RATE_LIMIT_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'ingress-rate': number().required(t('form.required')).moreThan(-1).lessThan(65535).integer().default(0),
      'egress-rate': number().required(t('form.required')).moreThan(-1).lessThan(65535).integer().default(0),
    })
    .default({
      'ingress-rate': 0,
      'egress-rate': 0,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

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
          host: string().required(t('form.required')).default(''),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1812),
          secret: string().required(t('form.required')).default(''),
          'mac-filter': bool().default(undefined),
        })
        .nullable()
        .default(undefined),
      accounting: object()
        .shape({
          host: string().required(t('form.required')).default(''),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
          secret: string().required(t('form.required')).default(''),
        })
        .nullable()
        .default(undefined),
      'dynamic-authorization': object()
        .shape({
          host: string().required(t('form.required')).default(''),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
          secret: string().required(t('form.required')).default(''),
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

export const INTERFACE_SSID_MULTIPSK_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      mac: string().default(undefined),
      key: string()
        .required(t('form.required'))
        .test(
          'multi-psk-key-test',
          t('form.min_max_string', { min: 8, max: 63 }),
          (v) => v.length >= 8 && v.length <= 63,
        )
        .default(''),
      'vlan-id': number().required(t('form.required')).positive().lessThan(4097).integer().default(1813),
    })
    .default({
      mac: undefined,
      key: 'YOUR_KEY',
      'vlan-id': 1813,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_ENCRYPTION_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      proto: string()
        .required(t('form.required'))
        .test('encryption-6g-test', t('form.invalid_proto_6g'), (v, { from }) => {
          const bands = from[1].value['wifi-bands'];
          if (bands && bands.includes('6G') && ENCRYPTION_PROTOS_NO_6G.includes(from[0].value.proto)) return false;
          return true;
        })
        .default('psk'),
      ieee80211w: string()
        .test('encryptionIeeeTest', t('form.invalid_ieee'), (v, { from }) => {
          if ((from[0].value.proto === 'owe' || from[0].value.proto === 'owe-transition') && v === 'disabled') {
            return false;
          }
          return true;
        })
        .default('disabled'),
      key: string()
        .test('encryptionKeyTest', t('form.min_max_string', { min: 8, max: 63 }), (v, { from }) => {
          if (!ENCRYPTION_PROTOS_REQUIRE_KEY.includes(from[0].value.proto) || from[1].value.radius !== undefined)
            return true;
          return v.length >= 8 && v.length <= 63;
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
      'domain-identifier': string().default(undefined),
      'pmk-r0-key-holder': string().default(undefined),
      'pmk-r1-key-holder': string().default(undefined),
    })
    .default({
      'message-exchange': 'ds',
      'generate-psk': false,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_RRM_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'neighbor-reporting': bool().default(false),
      lci: string().default(''),
      'civic-location': string().default(''),
      'ftm-responder': bool().default(false),
      'stationary-ap': bool().default(false),
    })
    .default({
      'neighbor-reporting': false,
      'ftm-responder': false,
      'stationary-ap': false,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_SSID_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    name: string().required(t('form.required')).default(''),
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
    'rate-limit': INTERFACE_SSID_RATE_LIMIT_SCHEMA(t),
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
      'lease-time': string()
        .required(t('form.required'))
        .test('ipv4_dhcp.lease-time', t('form.invalid_lease_time'), testLeaseTime)
        .default('6h'),
      'relay-server': string().default(undefined),
    })
    .default({
      'lease-first': 1,
      'lease-count': 1,
      'lease-time': '6h',
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV4_DHCP_LEASE_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      macaddr: string().required(t('form.required')).default(''),
      'lease-time': string()
        .required(t('form.required'))
        .test('ipv4_dhcp-lease.lease-time', t('form.invalid_lease_time'), testLeaseTime)
        .default('6h'),
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

export const INTERFACE_CAPTIVE_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'gateway-name': string().default('uCentral - Captive Portal'),
    'gateway-fqdn': string().default('ucentral.splash'),
    'max-clients': number().moreThan(0).lessThan(65535).integer().default(32),
    'upload-rate': number().moreThan(-1).lessThan(65535).integer().default(0),
    'download-rate': number().moreThan(-1).lessThan(65535).integer().default(0),
    'upload-quota': number().moreThan(-1).lessThan(65535).integer().default(0),
    'download-quota': number().moreThan(-1).lessThan(65535).integer().default(0),
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

export const INTERFACE_IPV4_PORT_FORWARD_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    protocol: string().default('any'),
    'external-port': string()
      .test('ipv4-external-test', t('form.invalid_port_range'), isValidPortRange)
      .test('ipv4-external-range-test', t('form.invalid_port_ranges'), (v, { from }) =>
        isValidPortRanges(v, from[0].value['internal-port']),
      )
      .default('1000-1010'),
    'internal-address': string()
      .required(t('form.required'))
      .test('test-ipv4-port-forward-address', t('form.invalid_ipv4'), testIpv4)
      .default(''),
    'internal-port': string()
      .test('ipv4-internal-test', t('form.invalid_port_range'), isValidPortRange)
      .default('2000-2010'),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const INTERFACE_IPV4_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    addressing: string().required(t('form.required')).default('dynamic'),
    subnet: string().when('addressing', {
      is: 'dynamic',
      then: string().nullable(),
      otherwise: string().default(''),
    }),
    gateway: string().when('addressing', {
      is: 'dynamic',
      then: string().nullable(),
      otherwise: string().default(''),
    }),
    'send-hostname': bool().when('addressing', {
      is: 'dynamic',
      then: bool().nullable(),
      otherwise: bool().required(t('form.required')).default(true),
    }),
    'use-dns': array().when('addressing', {
      is: 'dynamic',
      then: array().nullable(),
      otherwise: array().of(string()).default([]),
    }),
    'port-forward': array().when('addressing', {
      is: 'dynamic',
      then: array().nullable(),
      otherwise: array().of(object()).default([]),
    }),
    dhcp: INTERFACE_IPV4_DHCP_SCHEMA(t, useDefault),
    'dhcp-lease': INTERFACE_IPV4_DHCP_LEASE_SCHEMA(t, useDefault),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV6_TRAFFIC_ALLOW_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      'destination-address': string()
        .required(t('form.required'))
        .test('test-ipv6-port-forward-address', t('form.invalid_ipv6'), testIpv6)
        .default(''),
      protocol: string().default('any'),
      'source-address': string().test('test-ipv6-port-forward-address', t('form.invalid_ipv6'), testIpv6).default(''),
      'source-ports': array().of(string()).min(1, t('form.required')).default([]),
      'destination-ports': array().of(string()).min(1, t('form.required')).default([]),
    })
    .default({
      'destination-address': '',
      protocol: 'any',
      'source-address': '',
      'source-ports': [],
      'destination-ports': [],
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const INTERFACE_IPV6_PORT_FORWARD_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    protocol: string().default('any'),
    'external-port': string()
      .test('ipv4-external-test', t('form.invalid_port_range'), isValidPortRange)
      .test('ipv4-external-range-test', t('form.invalid_port_ranges'), (v, { from }) =>
        isValidPortRanges(v, from[0].value['internal-port']),
      )
      .default('1000-1010'),
    'internal-address': string()
      .required(t('form.required'))
      .test('test-ipv6-port-forward-address', t('form.invalid_ipv6'), testIpv6)
      .default(''),
    'internal-port': string()
      .test('ipv4-internal-test', t('form.invalid_port_range'), isValidPortRange)
      .default('2000-2010'),
  });
  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV6_DHCP_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      mode: string().required(t('form.required')).default('hybrid'),
      'announce-dns': array().of(object()).default(undefined),
      'filter-prefix': string().default('::/0'),
    })
    .default({
      mode: 'hybrid',
      'announce-dns': undefined,
      'filter-prefix': '::/0',
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const INTERFACE_IPV6_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    addressing: string().required(t('form.required')).default('dynamic'),
    subnet: string().when('addressing', {
      is: 'dynamic',
      then: string().nullable(),
      otherwise: string().default(''),
    }),
    gateway: string().when('addressing', {
      is: 'dynamic',
      then: string().nullable(),
      otherwise: string().default(''),
    }),
    'prefix-size': number().moreThan(-1).lessThan(65).integer().default(undefined),
    'port-forward': array().when('addressing', {
      is: 'dynamic',
      then: array().nullable(),
      otherwise: array().of(object()).default([]),
    }),
    dhcpv6: INTERFACE_IPV6_DHCP_SCHEMA(t, useDefault),
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
      then: string().required(t('form.required')).default(''),
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
    role: string()
      .required(t('form.required'))
      .test('role-test', t('form.missing_interface_upstream'), (_, { from }) => {
        const rootConfig = from[from.length - 1];
        const allRoles = rootConfig.value.configuration.map(({ role: v }) => v);
        return allRoles.includes('upstream');
      })
      .default(role),
    'isolate-hosts': bool().default(undefined),
    services: array().of(string()).default(undefined),
    ethernet: array()
      .of(
        object().shape({
          'select-ports': array()
            .of(string())
            .test('select-ports-test', t('form.invalid_select_ports'), (v, { from }) => {
              const rootConfig = from[from.length - 1];
              const portStuff = [];

              for (const conf of rootConfig.value.configuration) {
                portStuff.push({
                  ports: conf.ethernet && conf.ethernet && conf.ethernet[0] ? conf.ethernet[0]['select-ports'] : [],
                  vlan: conf.vlan?.id ?? 'None',
                });
              }
              return testSelectPorts(portStuff);
            })
            .default([]),
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
    captive: initialCreation ? object().shape().nullable().default(undefined) : INTERFACE_CAPTIVE_SCHEMA(t, useDefault),
    ipv4: initialCreation
      ? object()
          .shape({ addressing: string().required(t('form.required')) })
          .default({ addressing: 'dynamic' })
      : INTERFACE_IPV4_SCHEMA(t, useDefault),
    tunnel: INTERFACE_TUNNEL_SCHEMA(t, useDefault).default(undefined),
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
