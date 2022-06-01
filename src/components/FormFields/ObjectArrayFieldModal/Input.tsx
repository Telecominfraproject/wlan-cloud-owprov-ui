import React, { useCallback, useEffect, useState } from 'react';
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
  Box,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FieldInputProps } from 'models/Form';
import { Trash } from 'phosphor-react';
import { Formik } from 'formik';
import ModalHeader from 'components/Modals/ModalHeader';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import DataTable from 'components/DataTable';
import { Column } from 'models/Table';
// eslint-disable-next-line import/no-cycle
import { ObjectArrayFieldModalOptions } from '.';

interface Props extends FieldInputProps<object[]> {
  name: string;
  isError: boolean;
  onChange: (e: unknown[]) => void;
  isHidden: boolean;
  hideLabel: boolean;
  fields: React.ReactNode;
  columns: Column[];
  options: ObjectArrayFieldModalOptions;
  schema: (t: (e: string) => string, useDefault?: boolean) => object;
}

const ObjectArrayFieldInput: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  isError,
  error,
  fields,
  isRequired,
  isHidden,
  schema,
  columns,
  isDisabled,
  hideLabel,
  options,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempValue, setTempValue] = useState<object[]>([]);
  const variableName = name.split('.')[name.split('.').length - 1];

  const removeObj = (index: number) => {
    const newArr = [...tempValue];
    newArr.splice(index, 1);
    setTempValue(newArr);
  };

  const onSave = () => {
    onChange(tempValue);
    onClose();
  };

  const removeAction = useCallback(
    (cell) => (
      <Tooltip hasArrow label={t('common.remove')} placement="top">
        <IconButton
          aria-label="Remove Object"
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

  useEffect(() => {
    if (!isOpen) {
      setTempValue(value ?? []);
    }
  }, [value, isOpen]);

  return (
    <>
      <FormControl isInvalid={isError} isRequired={isRequired} isDisabled={isDisabled} hidden={isHidden}>
        <FormLabel hidden={hideLabel} ms="4px" fontSize="md" fontWeight="normal">
          {label}
        </FormLabel>
        <Text ml={1} fontSize="sm">
          <Button colorScheme="blue" onClick={onOpen}>
            {options?.buttonLabel ?? `${t('common.manage')} ${variableName} `} ({value?.length ?? 0}{' '}
            {t('common.entries', { count: value?.length ?? 0 }).toLowerCase()})
          </Button>
        </Text>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={options.modalTitle ?? name}
            right={
              <>
                <SaveButton onClick={onSave} hidden={isDisabled} />
                <CloseButton ml={2} onClick={onClose} />
              </>
            }
          />
          <ModalBody>
            {!isDisabled && (
              <Formik
                // @ts-ignore
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
                {({ resetForm, isValid, dirty, submitForm }) => (
                  <>
                    {fields}
                    <Box textAlign="right" my={4}>
                      <Button colorScheme="blue" isDisabled={!isValid} onClick={submitForm}>
                        {t('crud.add')}
                      </Button>
                      <Button colorScheme="gray" isDisabled={!dirty} ml={2} onClick={() => resetForm()}>
                        {t('common.reset')}
                      </Button>
                    </Box>
                  </>
                )}
              </Formik>
            )}
            <DataTable
              columns={
                !isDisabled
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
              minHeight="200px"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(ObjectArrayFieldInput);
