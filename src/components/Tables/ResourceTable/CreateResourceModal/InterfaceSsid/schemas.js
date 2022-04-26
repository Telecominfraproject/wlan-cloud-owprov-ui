import { object, number, string, array, bool } from 'yup';

const keyProtos = ['psk', 'psk2', 'psk-mixed', 'sae-mixed'];

export const INTERFACE_SSID_ENCRYPTION_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      proto: string().required(t('form.required')).default('psk'),
      ieee80211w: string().required(t('form.required')).default('disabled'),
      key: string()
        .test('encryptionKeyTest', t('form.min_max_string', { min: 8, max: 63 }), (v, { from }) => {
          if (!keyProtos.includes(from[0].value.proto) || from[1].value.radius !== undefined) return true;
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
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
