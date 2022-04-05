import { testAlphanumWithDash } from 'constants/formTests';
import { bool, object, number, string } from 'yup';

export const DEFAULT_UNIT = {
  name: 'Unit',
  description: '',
  weight: 0,
  configuration: {
    name: '',
    location: '',
    'leds-active': true,
    'random-password': false,
  },
};

export const UNIT_SCHEMA = (t) =>
  object().shape({
    name: string().required(t('form.required')).default('Unit'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      name: string().required(t('form.required')).default(''),
      location: string().required(t('form.required')).default(''),
      hostname: string()
        .test('test-hostname-network', t('form.invalid_hostname'), testAlphanumWithDash)
        .default(undefined),
      timezone: string().default(undefined),
      'leds-active': bool().default(true),
      'random-password': bool().default(false),
    }),
  });
