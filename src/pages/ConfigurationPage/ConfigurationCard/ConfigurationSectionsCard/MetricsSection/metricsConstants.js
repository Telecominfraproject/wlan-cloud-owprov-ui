import { object, number, string, array } from 'yup';

export const METRICS_STATISTICS_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
        types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
          types: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_HEALTH_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
      })
    : object()
        .shape({
          interval: number().required(t('form.required')).moreThan(59).lessThan(1000).default(60),
        })
        .nullable()
        .default(undefined);

export const METRICS_WIFI_FRAMES_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_DHCP_SNOOPING_SCHEMA = (t, useDefault = false) =>
  useDefault
    ? object().shape({
        filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
      })
    : object()
        .shape({
          filters: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        })
        .nullable()
        .default(undefined);

export const METRICS_SCHEMA = (t, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Metrics'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      __selected_subcategories: array().of(string()).default([]),
      statistics: METRICS_STATISTICS_SCHEMA(t, useDefault),
      health: METRICS_HEALTH_SCHEMA(t, useDefault),
      'wifi-frames': METRICS_WIFI_FRAMES_SCHEMA(t, useDefault),
      'dhcp-snooping': METRICS_DHCP_SNOOPING_SCHEMA(t, useDefault),
    }),
  });

export const getSubSectionDefaults = (t, sub) => {
  switch (sub) {
    case 'statistics':
      return METRICS_STATISTICS_SCHEMA(t, true).cast();
    case 'health':
      return METRICS_HEALTH_SCHEMA(t, true).cast();
    case 'wifi-frames':
      return METRICS_WIFI_FRAMES_SCHEMA(t, true).cast();
    case 'dhcp-snooping':
      return METRICS_DHCP_SNOOPING_SCHEMA(t, true).cast();
    default:
      return null;
  }
};
