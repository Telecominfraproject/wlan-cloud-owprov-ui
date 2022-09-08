import React from 'react';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import RrmFormField from '../RrmFormField';

interface Props {
  isDisabled?: boolean;
  namePrefix?: string;
}
const DeviceRulesField: React.FC<Props> = ({ namePrefix = 'deviceRules', isDisabled }) => {
  const { t } = useTranslation();

  const options = [
    { value: 'yes', label: t('common.yes') },
    { value: 'no', label: t('common.no') },
    { value: 'inherit', label: t('common.inherit') },
  ];

  return (
    <>
      <SelectField
        name={`${namePrefix}.rcOnly`}
        label={t('configurations.rc_only')}
        isDisabled={isDisabled}
        options={options}
      />
      <RrmFormField namePrefix={namePrefix} isDisabled={isDisabled} />
      <SelectField
        name={`${namePrefix}.firmwareUpgrade`}
        label={t('configurations.firmware_upgrade')}
        isDisabled={isDisabled}
        options={options}
      />
    </>
  );
};

export default DeviceRulesField;
