import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Button,
  SimpleGrid,
  Box,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { Field, useFormikContext, getIn, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import SaveButton from 'components/Buttons/SaveButton';
import DataTable from 'components/DataTable';
import { Trash } from 'phosphor-react';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  fields: PropTypes.node.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  columns: PropTypes.instanceOf(Array).isRequired,
  editing: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
};

const defaultProps = {
  editing: false,
  isRequired: false,
  isDisabled: false,
  isHidden: false,
};

const ObjectArrayFieldModal = ({ name, label, fields, schema, columns, editing, isDisabled, isRequired, isHidden }) => {
  const { t } = useTranslation();
  const [tempValue, setTempValue] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { values, setFieldValue } = useFormikContext();
  const variableName = name.split('.')[name.split('.').length - 1];

  const removeObj = (index) => {
    const newArr = [...tempValue];
    newArr.splice(index, 1);
    setTempValue(newArr);
  };

  const removeAction = useCallback(
    (cell) => (
      <Tooltip hasArrow label={t('common.remove')} placement="top">
        <IconButton
          ml={2}
          colorScheme="red"
          icon={<Trash size={20} />}
          size="sm"
          onClick={() => removeObj(cell.row.index)}
        />
      </Tooltip>
    ),
    [tempValue],
  );

  const onChange = () => {
    setFieldValue(name, tempValue);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setTempValue(getIn(values, name) ?? []);
    }
  }, [isOpen]);

  return (
    <Field name={name}>
      {({ field, meta: { touched, error } }) => (
        <>
          <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled} hidden={isHidden}>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              {label}
            </FormLabel>
            <Text ml={1} fontSize="sm">
              <Button variant="link" colorScheme="blue" onClick={onOpen}>
                {t('common.manage')} {variableName} ({field?.value?.length ?? 0})
              </Button>
            </Text>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
              <ModalHeader
                title={name}
                right={
                  <>
                    <SaveButton onClick={onChange} hidden={!editing} isDisabled={tempValue.length === 0} />
                    <CloseButton ml={2} onClick={onClose} />
                  </>
                }
              />
              <ModalBody>
                {editing && (
                  <Formik
                    initialValues={schema(t, true).cast()}
                    validationSchema={schema(t)}
                    validateOnMount
                    onSubmit={(data, { setSubmitting, resetForm }) => {
                      setSubmitting(true);
                      setTempValue([...tempValue, data]);
                      resetForm();
                      setSubmitting(false);
                    }}
                  >
                    {({ resetForm, isValid, isDirty, submitForm }) => (
                      <>
                        <SimpleGrid minChildWidth="300px" gap={4}>
                          {fields}
                        </SimpleGrid>
                        <Box textAlign="right" my={4}>
                          <Button colorScheme="blue" isDisabled={!isValid} onClick={submitForm}>
                            {t('crud.add')}
                          </Button>
                          <Button colorScheme="gray" isDisabled={!isDirty} ml={2} onClick={resetForm}>
                            {t('common.reset')}
                          </Button>
                        </Box>
                      </>
                    )}
                  </Formik>
                )}
                <DataTable
                  columns={
                    editing
                      ? [
                          ...columns,
                          {
                            id: 'actions',
                            Header: t('common.actions'),
                            Footer: '',
                            accessor: 'Id',
                            customWidth: '80px',
                            Cell: ({ cell }) => removeAction(cell),
                            disableSortBy: true,
                            alwaysShow: true,
                          },
                        ]
                      : columns
                  }
                  data={tempValue}
                  obj={variableName}
                  minHeight="200px"
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Field>
  );
};

ObjectArrayFieldModal.propTypes = propTypes;
ObjectArrayFieldModal.defaultProps = defaultProps;

export default React.memo(ObjectArrayFieldModal);
