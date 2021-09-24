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
      'Midway Islands Time (UTC-11:00)',
      'Hawaii Standard Time (UTC-10:00)',
      'Pacific Standard Time (UTC-8:00)',
      'Mountain Standard Time (UTC-7:00)',
      'Central Standard Time (UTC-6:00)',
      'Eastern Standard Time (UTC-5:00)',
      'Puerto Rico and US Virgin Islands Time (UTC-4:00)',
      'Canada Newfoundland Time (UTC-3:30)',
      'Brazil Eastern Time (UTC-3:00)',
      'Central African Time (UTC-1:00)',
      'Universal Coordinated Time (UTC)',
      'European Central Time (UTC+1:00)',
      'Eastern European Time (UTC+2:00)',
      '(Arabic) Egypt Standard Time (UTC+2:00)',
      'Eastern African Time (UTC+3:00)',
      'Middle East Time (UTC+3:30)',
      'Near East Time (UTC+4:00)',
      'Pakistan Lahore Time (UTC+5:00)',
      'India Standard Time (UTC+5:30)',
      'Bangladesh Standard Time (UTC+6:00)',
      'Vietnam Standard Time (UTC+7:00)',
      'China Taiwan Time (UTC+8:00)',
      'Japan Standard Time (UTC+9:00)',
      'Australia Central Time (UTC+9:30)',
      'Australia Eastern Time (UTC+10:00)',
      'Solomon Standard Time (UTC+11:00)',
      'New Zealand Standard Time (UTC+12:00)',
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
