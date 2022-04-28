import { object, number, string, array, bool } from 'yup';
import { testLength, testUcMac } from 'constants/formTests';

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

export const RADIUS_SCHEMA = (t, useDefault = false) => {
  const shape = object()
    .shape({
      name: string().required(t('form.required')).default(''),
      description: string().default(''),
      note: string().default(''),
      'nas-identifier': string().default(undefined),
      'chargeable-user-id': bool().required(t('form.required')).default(false),
      authentication: object().shape({
        host: string().required(t('form.required')).default('192.168.178.192'),
        port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1812),
        secret: string().required(t('form.required')).min(8).max(63).default(''),
        'mac-filter': bool().default(undefined),
      }),
      accounting: object()
        .shape({
          host: string().required(t('form.required')).default('192.168.178.192'),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
          secret: string().required(t('form.required')).min(8).max(63).default(''),
        })
        .nullable()
        .default(undefined),
      'dynamic-authorization': object()
        .shape({
          host: string().required(t('form.required')).default('192.168.178.192'),
          port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
          secret: string().required(t('form.required')).min(8).max(63).default(''),
        })
        .nullable()
        .default(undefined),
      local: INTERFACE_SSID_RADIUS_LOCAL_SCHEMA(t),
    })
    .default({
      'chargeable-user-id': false,
      authentication: {
        host: '192.168.178.192',
        port: 1812,
        secret: '',
      },
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const EDIT_SCHEMA = (t) =>
  object().shape({
    name: string().required(t('form.required')).default(''),
    description: string().default(''),
    entity: string().required(t('form.required')),
    'nas-identifier': string().default(undefined),
    'chargeable-user-id': bool().required(t('form.required')).default(false),
    authentication: object().shape({
      host: string().required(t('form.required')).default(''),
      port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1812),
      secret: string().required(t('form.required')).min(8).max(63).default(''),
    }),
    accounting: object()
      .shape({
        host: string().required(t('form.required')).default(''),
        port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
        secret: string().required(t('form.required')).min(8).max(63).default(''),
      })
      .nullable()
      .default(undefined),
    'dynamic-authorization': object()
      .shape({
        host: string().required(t('form.required')).default(''),
        port: number().required(t('form.required')).positive().lessThan(4050).integer().default(1813),
        secret: string().required(t('form.required')).min(8).max(63).default(''),
      })
      .nullable()
      .default(undefined),
    local: INTERFACE_SSID_RADIUS_LOCAL_SCHEMA(t),
  });
