import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Formik } from 'formik';
import { SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import ToggleField from 'components/FormFields/ToggleField';

const propTypes = {
  configuration: PropTypes.shape({
    id: PropTypes.string.isRequired,
    rrm: PropTypes.string.isRequired,
  }),
  editing: PropTypes.bool.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const defaultProps = {
  configuration: null,
};

const SpecialConfigurationForm = ({ editing, configuration, formRef }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={formRef}
      enableReinitialize
      initialValues={
        configuration
          ? {
              ...configuration,
              rrm: configuration.rrm !== '' ? configuration.rrm : 'inherit',
            }
          : {
              rrm: 'inherit',
              firmwareUpgrade: 'no',
              firmwareRCOnly: false,
            }
      }
    >
      <SimpleGrid minChildWidth="200px" maxW="660px" spacing="20px">
        <SelectField
          name="rrm"
          label="RRM"
          options={[
            { value: 'inherit', label: 'inherit' },
            { value: 'on', label: 'on' },
            { value: 'off', label: 'off' },
          ]}
          isRequired
          isDisabled={!editing}
          w={28}
        />
        <SelectField
          name="firmwareUpgrade"
          label={t('configurations.firmware_upgrade')}
          options={[
            { value: 'inherit', label: 'inherit' },
            { value: 'yes', label: t('common.yes') },
            { value: 'no', label: t('common.no') },
          ]}
          isRequired
          isDisabled={!editing}
          w={36}
        />
        <ToggleField name="firmwareRCOnly" label={t('configurations.rc_only')} isDisabled={!editing} />
      </SimpleGrid>
    </Formik>
  );
};

SpecialConfigurationForm.propTypes = propTypes;
SpecialConfigurationForm.defaultProps = defaultProps;
export default SpecialConfigurationForm;
