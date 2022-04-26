import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid, useToast } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useCreateResource } from 'hooks/Network/Resources';
import StringField from 'components/FormFields/StringField';
import InterfaceVlanForm from './Form';
import schemas from './schemas';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  parent: PropTypes.shape({
    entity: PropTypes.string,
    venue: PropTypes.string,
    subscriber: PropTypes.string,
  }).isRequired,
};

const InterfaceVlan = ({ isOpen, onClose, refresh, formRef, parent }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());

  const create = useCreateResource();

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={schemas(t, true).cast()}
      validationSchema={schemas(t)}
      onSubmit={async (formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(
          {
            variables: [
              {
                type: 'json',
                weight: 0,
                prefix: 'interface.vlan',
                value: {
                  ...formData,
                  name: undefined,
                  description: undefined,
                  note: undefined,
                },
              },
            ],
            ...parent,
            name: formData.name,
            description: formData.description,
            notes: formData.note !== '' ? [{ note: formData.note }] : undefined,
          },
          {
            onSuccess: async () => {
              toast({
                id: 'resource-creation-success',
                title: t('common.success'),
                description: t('crud.success_create_obj', {
                  obj: t('resources.configuration_resource'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });

              setSubmitting(false);
              resetForm();
              refresh();
              onClose();
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_create_obj', {
                  obj: t('resources.configuration_resource'),
                  e: e?.response?.data?.ErrorDescription,
                }),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              setSubmitting(false);
            },
          },
        )
      }
    >
      <>
        <SimpleGrid minChildWidth="300px" spacing="20px" mt={4}>
          <StringField name="name" label={t('common.name')} isRequired />
          <StringField name="description" label={t('common.description')} />
          <StringField name="note" label={t('common.note')} />
        </SimpleGrid>
        <InterfaceVlanForm />
      </>
    </Formik>
  );
};

InterfaceVlan.propTypes = propTypes;

export default InterfaceVlan;
