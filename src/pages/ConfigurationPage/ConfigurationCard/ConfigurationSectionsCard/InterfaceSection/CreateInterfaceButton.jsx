import React from 'react';
import { Button, useDisclosure, Modal, ModalBody, ModalContent, ModalOverlay, Box } from '@chakra-ui/react';
import { Formik } from 'formik';
import { Plus } from 'phosphor-react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { CREATE_INTERFACE_SCHEMA, SINGLE_INTERFACE_SCHEMA } from './interfacesConstants';
import CloseButton from 'components/Buttons/CloseButton';
import SaveButton from 'components/Buttons/SaveButton';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import ModalHeader from 'components/Modals/ModalHeader';
import useFormRef from 'hooks/useFormRef';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  setTabIndex: PropTypes.func.isRequired,
  arrLength: PropTypes.number.isRequired,
};

const CreateInterfaceButton = ({ editing, arrayHelpers: { push: pushInterface }, setTabIndex, arrLength }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { form, formRef } = useFormRef();

  const addInterface = ({ role, name }) => {
    pushInterface(SINGLE_INTERFACE_SCHEMA(t, true, role, name, true).cast());
    setTabIndex(arrLength);
    onClose();
  };

  return (
    <>
      <Button
        colorScheme="blue"
        type="button"
        onClick={onOpen}
        rightIcon={<Plus size={20} />}
        hidden={!editing}
        borderRadius={0}
        minWidth={24}
      >
        {t('configurations.add_interface')}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size="sm" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            title={t('configurations.add_interface')}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={!form.isValid || !form.dirty}
                />
                <CloseButton ml={2} onClick={onClose} />
              </>
            }
          />
          <ModalBody>
            <Formik
              innerRef={formRef}
              initialValues={CREATE_INTERFACE_SCHEMA(t).cast()}
              validationSchema={CREATE_INTERFACE_SCHEMA(t)}
              onSubmit={({ name, role }, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                addInterface({ name, role });
                onClose();
                resetForm();
                setSubmitting(false);
              }}
            >
              <Box mb={2}>
                <StringField name="name" label="name" isRequired />
                <SelectField
                  name="role"
                  label="role"
                  isRequired
                  options={[
                    { value: 'upstream', label: 'upstream' },
                    {
                      value: 'downstream',
                      label: 'downstream',
                    },
                  ]}
                />
              </Box>
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

CreateInterfaceButton.propTypes = propTypes;

export default React.memo(CreateInterfaceButton, isEqual);
