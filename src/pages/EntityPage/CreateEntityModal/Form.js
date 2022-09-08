import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { EntitySchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import { useCreateEntity } from 'hooks/Network/Entity';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import DeviceRulesField from 'components/CustomFields/DeviceRulesField';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const CreateEntityForm = ({ isOpen, onClose, formRef, parentId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(uuid());
  const create = useCreateEntity();

  const createParameters = ({ name, description, note, deviceRules }) => ({
    name,
    deviceRules,
    description,
    notes: note.length > 0 ? [{ note }] : undefined,
    parent: parentId,
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
        deviceRules: {
          rrm: 'inherit',
          rcOnly: 'inherit',
          firmwareUpgrade: 'inherit',
        },
        note: '',
      }}
      validationSchema={EntitySchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(createParameters(formData), {
          onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['get-entity-tree']);
            setSubmitting(false);
            resetForm();
            toast({
              id: 'entity-creation-success',
              title: t('common.success'),
              description: t('crud.success_create_obj', {
                obj: t('entities.one'),
              }),
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            navigate(`/entity/${data.id}`);
            onClose();
          },
          onError: (e) => {
            toast({
              id: uuid(),
              title: t('common.error'),
              description: t('crud.error_create_obj', {
                obj: t('entities.one'),
                e: e?.response?.data?.ErrorDescription,
              }),
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            setSubmitting(false);
          },
        })
      }
    >
      {({ errors, touched }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={6}>
            <StringField name="name" label={t('common.name')} errors={errors} touched={touched} isRequired />
            <DeviceRulesField />
            <StringField name="description" label={t('common.description')} errors={errors} touched={touched} />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

CreateEntityForm.propTypes = propTypes;

export default CreateEntityForm;
