import phoneNumberTest from 'utils/phoneNumber';
import * as Yup from 'yup';
import { testRegex } from './formTests';

// User Schemas
export const CreateUserSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string().required('Required'),
  description: Yup.string(),
  currentPassword: Yup.string().required('Required'),
  note: Yup.string(),
  userRole: Yup.string(),
});

export const CreateUserNonRootSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string().required('Required'),
  description: Yup.string(),
  currentPassword: Yup.string().required('Required'),
  note: Yup.string(),
  userRole: Yup.string(),
});

export const UpdateUserSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    currentPassword: Yup.string().notRequired().min(8, t('form.invalid_password')),
    description: Yup.string(),
    mfa: Yup.string(),
    phoneNumber: Yup.string().when('mfa', {
      is: 'sms',
      then: Yup.string()
        .required(t('account.phone_required'))
        .test('test-phone-number', t('form.invalid_phone_number'), (v) => {
          if (v) {
            return phoneNumberTest(v);
          }
          return true;
        }),
    }),
  });

export const RootSchemaForRootUser = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    description: Yup.string(),
    defaultRedirector: Yup.string(),
    organization: Yup.string().required(t('form.required')),
    apiKey: Yup.string(),
    serverEnrollmentProfile: Yup.string(),
    clientEnrollmentProfile: Yup.string(),
    note: Yup.string(),
  });

export const RootSchemaForNonRootUser = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    description: Yup.string(),
    defaultRedirector: Yup.string(),
  });

// Certificate Schemas
export const CreateCertificateSchema = (t) =>
  Yup.object().shape({
    type: Yup.string().required(t('form.required')),
    commonName: Yup.string()
      .required(t('form.required'))
      .when('type', {
        is: 'device',
        then: Yup.string()
          .required(t('form.required'))
          .test('test-mac-device', t('certificates.invalid_mac'), (v) => {
            if (v) {
              const cleanedString = v.trim().replace('-', '').replace(':', '');

              if (cleanedString.length !== 12) return false;
              if (!cleanedString.match('^[a-fA-F0-9]+$')) return false;
            }
            return true;
          }),
      })
      .when('type', {
        is: 'server',
        then: Yup.string()
          .required(t('form.required'))
          .test('test-mac-server', t('certificates.invalid_redirector'), (v) => {
            if (v) {
              const stringSplit = v.split('.');
              if (stringSplit.length < 2) return false;
              if (stringSplit[0][0] === '*' && stringSplit[1][0] === '*') return false;

              for (const part of stringSplit) {
                if (part.length === 0) return false;
                if (part[0] === '-' || part[part.length - 1] === '-') return false;
              }

              const splitPort = v.split(':');

              if ((splitPort.length === 2 && splitPort[1] < 1) || splitPort[1] > 65535) return false;
            }
            return true;
          }),
      }),
    manufacturer: Yup.string().when('type', {
      is: 'device',
      then: Yup.string().required(t('form.required')),
    }),
    model: Yup.string().when('type', {
      is: 'device',
      then: Yup.string().required(t('form.required')),
    }),
    redirector: Yup.string().when('type', {
      is: 'device',
      then: Yup.string()
        .required(t('form.required'))
        .test('test-redirector', t('certificates.invalid_redirector'), (v) => {
          if (v) {
            const stringSplit = v.split('.');
            if (stringSplit.length < 2) return false;
            if (stringSplit[0][0] === '*') return false;

            for (const part of stringSplit) {
              if (part.length === 0) return false;
              if (part[0] === '-' || part[part.length - 1] === '-') return false;
            }

            const splitPort = v.split(':');

            if ((splitPort.length === 2 && splitPort[1] < 1) || splitPort[1] > 65535) return false;
          }
          return true;
        }),
    }),
  });

export const UpdateCertificateSchema = (t) =>
  Yup.object().shape({
    manufacturer: Yup.string().when('type', {
      is: 'device',
      then: Yup.string().required(t('form.required')),
    }),
    model: Yup.string().when('type', {
      is: 'device',
      then: Yup.string().required(t('form.required')),
    }),
    redirector: Yup.string().when('type', {
      is: 'device',
      then: Yup.string()
        .required(t('form.required'))
        .test('test-redirector', t('certificates.invalid_redirector'), (v) => {
          if (v) {
            const stringSplit = v.split('.');
            if (stringSplit.length < 2) return false;
            if (stringSplit[0][0] === '*') return false;

            for (const part of stringSplit) {
              if (part.length === 0) return false;
              if (part[0] === '-' || part[part.length - 1] === '-') return false;
            }

            const splitPort = v.split(':');

            if ((splitPort.length === 2 && splitPort[1] < 1) || splitPort[1] > 65535) return false;
          }
          return true;
        }),
    }),
  });

// Batch Schemas
export const BatchSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    description: Yup.string(),
    redirector: Yup.string().required(t('form.required')),
    manufacturer: Yup.string().required(t('form.required')),
    model: Yup.string().required(t('form.required')),
    commonNames: Yup.array().of(Yup.string()).required(t('form.required')).min(1, t('batch.need_devices')),
    note: Yup.string(),
  });

// Email Notification Schema
export const EmailNotificationSchema = (t) =>
  Yup.object().shape({
    email: Yup.string().email(t('form.invalid_email')),
  });

// Sms Notification Schema
export const SmsNotificationSchema = (t) =>
  Yup.object().shape({
    phone: Yup.string().test('test-phone-number', t('form.invalid_phone_number'), (v) => {
      if (v) {
        return phoneNumberTest(v);
      }
      return true;
    }),
  });

// Configuration  Schemas
export const CreateConfigurationSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    rrm: Yup.string().required(t('form.required')),
    deviceTypes: Yup.array().of(Yup.string()).required(t('form.required')).min(1, t('form.required')),
    description: Yup.string(),
    entity: Yup.string().required(t('form.required')),
    note: Yup.string(),
    userRole: Yup.string(),
  });

// Inventory Tag  Schemas
export const CreateTagSchema = (t) =>
  Yup.object().shape({
    serialNumber: Yup.string()
      .required(t('form.required'))
      .test('test-serial-regex', t('inventory.invalid_serial_number'), (v) => {
        if (v) {
          if (v.length !== 12) return false;
          if (!v.match('^[a-fA-F0-9]+$')) return false;
        }
        return true;
      }),
    name: Yup.string().required(t('form.required')),
    rrm: Yup.string().required(t('form.required')),
    deviceType: Yup.string().required(t('form.required')),
    description: Yup.string(),
    entity: Yup.string(),
    note: Yup.string(),
  });

export const UpdateTagSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    rrm: Yup.string().required(t('form.required')),
    deviceType: Yup.string().required(t('form.required')),
    description: Yup.string(),
    entity: Yup.string(),
    note: Yup.string(),
  });

// Subscriber Schema
export const SubscriberSchema = (t, passRegex) =>
  Yup.object().shape({
    email: Yup.string().email(t('form.invalid_email')).required(t('form.required')).default(''),
    name: Yup.string().required(t('form.required')).default(''),
    description: Yup.string().default(''),
    currentPassword: Yup.string()
      .required(t('form.required'))
      .test('test-password', t('form.invalid_password'), (v) => testRegex(v, passRegex))
      .default(''),
    note: Yup.string().default(''),
  });

// Contact Schemas
export const CreateContactSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    type: Yup.string().required(t('form.required')),
    salutation: Yup.string(),
    title: Yup.string(),
    firstname: Yup.string().required(t('form.required')),
    lastname: Yup.string(),
    initials: Yup.string(),
    primaryEmail: Yup.string().required(t('form.required')),
    secondaryEmail: Yup.string(),
    phones: Yup.array().of(Yup.string()),
    mobiles: Yup.array().of(Yup.string()),
    description: Yup.string(),
    accessPIN: Yup.string(),
    entity: Yup.string().required(t('form.required')),
    note: Yup.string(),
  });

// Location Schemas
export const CreateLocationSchema = (t, needEntity = true) =>
  Yup.object()
    .shape({
      name: Yup.string().required(t('form.required')),
      description: Yup.string(),
      type: Yup.string().required(t('form.required')),
      addressLineOne: Yup.string().required(t('form.required')),
      addressLineTwo: Yup.string(),
      city: Yup.string().required(t('form.required')),
      state: Yup.string().required(t('form.required')),
      postal: Yup.string().required(t('form.required')),
      country: Yup.string().required(t('form.required')),
      buildingName: Yup.string(),
      phones: Yup.array().of(Yup.string()),
      mobiles: Yup.array().of(Yup.string()),
      geoCode: Yup.string(),
      note: Yup.string(),
      entity: needEntity ? Yup.string().required(t('form.required')) : undefined,
    })
    .nullable();

// Entity Schemas
export const EntitySchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    description: Yup.string(),
    rrm: Yup.string().required(t('form.required')),
    deviceConfiguration: Yup.array().of(Yup.string()),
    sourceIP: Yup.array().of(Yup.string()),
    __createLocation: CreateLocationSchema(t, false).nullable().default(undefined),
  });

// Entity Schemas
export const VenueSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    description: Yup.string(),
    rrm: Yup.string().required(t('form.required')),
    deviceConfiguration: Yup.array().of(Yup.string()),
    contact: Yup.string(),
    location: Yup.string(),
    sourceIP: Yup.array().of(Yup.string()),
  });

// Configuration  Schemas
export const CreateMapSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    visibility: Yup.string().required(t('form.required')),
    description: Yup.string(),
    note: Yup.string(),
  });

// Service Class Schemas
export const ServiceClassSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    description: Yup.string(),
    billingCode: Yup.string().required(t('form.required')),
    cost: Yup.number(),
    currency: Yup.string(),
    period: Yup.string(),
  });

// Operator Contact Schemas
export const OperatorContactSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')),
    type: Yup.string().required(t('form.required')),
    salutation: Yup.string(),
    title: Yup.string(),
    firstname: Yup.string().required(t('form.required')),
    lastname: Yup.string(),
    initials: Yup.string(),
    primaryEmail: Yup.string().required(t('form.required')),
    secondaryEmail: Yup.string(),
    phones: Yup.array().of(Yup.string()),
    mobiles: Yup.array().of(Yup.string()),
    description: Yup.string(),
    accessPIN: Yup.string(),
    note: Yup.string(),
  });

// Location Schemas
export const OperatorLocationSchema = (t) =>
  Yup.object()
    .shape({
      name: Yup.string().required(t('form.required')),
      description: Yup.string(),
      type: Yup.string().required(t('form.required')),
      addressLineOne: Yup.string().required(t('form.required')),
      addressLineTwo: Yup.string(),
      city: Yup.string().required(t('form.required')),
      state: Yup.string().required(t('form.required')),
      postal: Yup.string().required(t('form.required')),
      country: Yup.string().required(t('form.required')),
      buildingName: Yup.string(),
      phones: Yup.array().of(Yup.string()),
      mobiles: Yup.array().of(Yup.string()),
      geoCode: Yup.string(),
      note: Yup.string(),
    })
    .nullable();

// Subscriber Device Schema
export const SubscriberDeviceSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')).default(''),
    subscriberId: Yup.string().required(t('form.required')).default(''),
    description: Yup.string().default(''),
    note: Yup.string().default(''),
    serialNumber: Yup.string()
      .required(t('form.required'))
      .test('test-serial-regex', t('inventory.invalid_serial_number'), (v) => {
        if (v) {
          if (v.length !== 12) return false;
          if (!v.match('^[a-fA-F0-9]+$')) return false;
        }
        return true;
      })
      .default(''),
    rrm: Yup.string().required(t('form.required')).default('inherit'),
    deviceType: Yup.string().required(t('form.required')).default(''),
    serviceClass: Yup.string().required(t('form.required')).default(''),
    billingCode: Yup.string().default(''),
    locale: Yup.string().default(''),
    location: Yup.string().default(''),
    contact: Yup.string().default(''),
    suspended: Yup.bool().default(false),
  });
