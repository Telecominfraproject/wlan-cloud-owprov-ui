import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { EntitySchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import { useCreateOperator } from 'hooks/Network/Operators';
import useMutationResult from 'hooks/useMutationResult';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import ToggleField from 'components/FormFields/ToggleField';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const CreateOperatorForm = ({ isOpen, onClose, refresh, formRef }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('operator.one'),
    operationType: 'create',
    refresh,
    onClose,
  });
  const create = useCreateOperator();

  const createParameters = ({ name, description, note, sourceIP, rrm, firmwareRCOnly }) => ({
    name,
    rrm,
    sourceIP,
    description,
    firmwareRCOnly,
    notes: note.length > 0 ? [{ note }] : undefined,
  });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        name: '',
        description: '',
        rrm: 'inherit',
        firmwareRCOnly: false,
        sourceIP: [],
        note: '',
      }}
      validationSchema={EntitySchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(createParameters(formData), {
          onSuccess: () => {
            onSuccess(setSubmitting, resetForm);
          },
          onError: (e) => {
            onError(e, { resetForm });
          },
        })
      }
    >
      {({ errors, touched }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
            <StringField name="name" label={t('common.name')} errors={errors} touched={touched} isRequired />
            <StringField name="description" label={t('common.description')} errors={errors} touched={touched} />
            <SelectField
              name="rrm"
              label="RRM"
              errors={errors}
              touched={touched}
              options={[
                { value: 'inherit', label: 'inherit' },
                { value: 'on', label: 'on' },
                { value: 'off', label: 'off' },
              ]}
              isRequired
              w={28}
            />
            <ToggleField name="firmwareRCOnly" label={t('configurations.rc_only')} />
            <IpDetectionModalField name="sourceIP" />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

CreateOperatorForm.propTypes = propTypes;

export default CreateOperatorForm;
