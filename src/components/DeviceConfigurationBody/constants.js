export const BASE_FORM = {
  name: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  weight: {
    type: 'int',
    value: 0,
    error: false,
    required: true,
  },
  description: {
    type: 'string',
    value: '',
    error: false,
    required: false,
  },
};

export const GLOBALS_FORM = {
  'ipv4-network': {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  'ipv6-network': {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
};

export const UNIT_FORM = {
  name: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  location: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  timezone: {
    type: 'string',
    value: '',
    error: false,
    required: true,
    options: [
      'Universal Coordinated Time (UTC)',
      'European Central Time (UTC+1:00)',
      'Eastern European Time (UTC+2:00)',
      '(Arabic) Egypt Standard Time (UTC+3:00)',
      'Universal Coordinated Time (UTC)',
      'Universal Coordinated Time (UTC)',
      'Universal Coordinated Time (UTC)',
      'Universal Coordinated Time (UTC)',
    ],
  },
  'leds-active': {
    type: 'bool',
    value: true,
    error: false,
  },
  'random-password': {
    type: 'bool',
    value: false,
    error: false,
  },
};

export const METRICS_FORM = {
  statistics: {
    enabled: false,
    interval: {
      type: 'int',
      value: 0,
      error: false,
      required: true,
    },
    types: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['ssids', 'lldp', 'clients'],
    },
  },
  health: {
    enabled: false,
    interval: {
      value: 60,
      type: 'int',
      error: false,
      required: true,
      minimum: 60,
    },
  },
  'wifi-frames': {
    enabled: false,
    filters: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: [
        'probe',
        'auth',
        'assoc',
        'disassoc',
        'deauth',
        'local-deauth',
        'inactive-deauth',
        'key-mismatch',
        'beacon-report',
        'radar-detected',
      ],
    },
  },
  'dhcp-snooping': {
    enabled: false,
    filters: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['ack', 'discover', 'offer', 'request', 'solicit', 'reply', 'renew'],
    },
  },
};
