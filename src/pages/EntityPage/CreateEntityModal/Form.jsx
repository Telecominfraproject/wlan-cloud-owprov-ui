import React, { useEffect, useState } from 'react';
import { useToast, SimpleGrid, Heading, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import RrmFormField from 'components/CustomFields/RrmFormField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { EntitySchema } from 'constants/formSchemas';
import { useCreateEntity } from 'hooks/Network/Entity';

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

  const options = [
    { value: 'yes', label: t('common.yes') },
    { value: 'no', label: t('common.no') },
    { value: 'inherit', label: t('common.inherit') },
  ];

  const createParameters = ({ name, description, note, deviceRules, sourceIP }) => ({
    name,
    deviceRules,
    description,
    notes: note.length > 0 ? [{ note }] : undefined,
    parent: parentId,
    sourceIP,
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
        sourceIP: [],
        note: '',
      }}
      validationSchema={EntitySchema(t)}
      onSubmit={(formData, { setSubmitting, resetForm }) =>
        create.mutateAsync(createParameters(formData), {
          onSuccess: (data) => {
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
      <Form>
        <Heading size="md">{t('common.details')}</Heading>
        <StringField w="240px" name="name" label={t('common.name')} isRequired mr={4} />

        <StringField name="description" isArea h="80px" label={t('common.description')} />
        <StringField name="note" label={t('common.note')} />
        <Heading size="md" mt={6} mb={4}>
          Behaviors
        </Heading>
        <SimpleGrid minChildWidth="200px">
          <IpDetectionModalField name="sourceIP" />
          <Box>
            <RrmFormField namePrefix="deviceRules" />
          </Box>
          <Box w="200px">
            <SelectField name="deviceRules.rcOnly" label={t('configurations.rc_only')} options={options} w="100px" />
          </Box>
          <Box w="200px">
            <SelectField
              name="deviceRules.firmwareUpgrade"
              label={t('configurations.firmware_upgrade')}
              options={options}
              w="100px"
            />
          </Box>
        </SimpleGrid>
      </Form>
    </Formik>
  );
};

CreateEntityForm.propTypes = propTypes;

export default CreateEntityForm;
