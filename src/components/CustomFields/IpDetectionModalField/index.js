import React from 'react';
import PropTypes from 'prop-types';
import ListInputModalField from 'components/FormFields/ListInputModalField';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import IP_REGEX from 'constants/IP_REGEX';

const propTypes = {
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
};

const testIps = (newIp) => {
  const ip = newIp.trim();

  // If this contains multiple IPs
  if (ip.includes(',')) {
    const ips = ip.split(',');
    for (let i = 0; i < ips.length; i += 1) {
      if (!IP_REGEX.test(ips[i])) return false;
    }
    return true;
  }

  // If this contains a range
  if (ip.includes('-')) {
    const ips = ip.split('-');
    for (let i = 0; i < ips.length; i += 1) {
      if (!IP_REGEX.test(ips[i])) return false;
    }
    return true;
  }

  // If it is CIDR
  if (ip.includes('/')) {
    return IP_REGEX.test(ip.split('/')[0]);
  }

  return IP_REGEX.test(ip);
};

const IpDetectionModalField = ({ name, isDisabled, isRequired }) => {
  const { t } = useTranslation();
  const [{ value }, { error }, { setValue }] = useField(name);

  return (
    <ListInputModalField
      initialValue={value}
      name={name}
      setValue={setValue}
      label={t('entities.ip_detection')}
      buttonLabel={value.length === 0 ? t('entities.add_ips') : value.join(',')}
      title={t('entities.ip_detection')}
      explanation={
        <Box>
          <b>{t('entities.add_ips_explanation')}</b>
          <UnorderedList>
            <ListItem>{t('entities.ip_single_address')}</ListItem>
            <ListItem>{t('entities.ip_list')}</ListItem>
            <ListItem>{t('entities.ip_range')}</ListItem>
            <ListItem>{t('entities.ip_cidr')}</ListItem>
          </UnorderedList>
        </Box>
      }
      error={error}
      placeholder={t('entities.enter_ips')}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validation={testIps}
    />
  );
};

IpDetectionModalField.propTypes = propTypes;
IpDetectionModalField.defaultProps = defaultProps;

export default IpDetectionModalField;
