import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import {
  Box,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import ModalHeader from 'components/Modals/ModalHeader';
import FileInputButton from 'components/Buttons/FileInputButton';
import { useTranslation } from 'react-i18next';
import { UploadSimple } from 'phosphor-react';
import SaveButton from 'components/Buttons/SaveButton';
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

const propTypes = {
  value: PropTypes.string,
  fileNameValue: PropTypes.string,
  explanation: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  test: PropTypes.func,
  label: PropTypes.string.isRequired,
  acceptedFileTypes: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  touched: PropTypes.bool,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  value: '',
  fileNameValue: '',
  test: () => true,
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  error: false,
  touched: false,
  definitionKey: null,
};

const FileInputModal = ({
  value,
  fileNameValue,
  label,
  acceptedFileTypes,
  explanation,
  onChange,
  test,
  error,
  touched,
  isRequired,
  isDisabled,
  isHidden,
  definitionKey,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempValue, setTempValue] = useState('');
  const [tempFilename, setTempFilename] = useState('');
  const [refreshId, setRefreshId] = useState('');

  const textExplanation = () => {
    if (value === '') return t('form.not_uploaded_yet');
    if (fileNameValue === '') return t('form.value_recorded_no_filename');
    return t('form.using_file', { filename: fileNameValue });
  };

  const saveValue = () => {
    onChange(tempValue, tempFilename);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setRefreshId(uuid());
      setTempValue('');
      setTempFilename('');
    }
  }, [isOpen]);

  return (
    <>
      <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled} hidden={isHidden}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          {label}
          <ConfigurationFieldExplanation definitionKey={definitionKey} />
        </FormLabel>
        <Text ml={1} fontSize="sm">
          {textExplanation()}
          <Tooltip label={t('common.use_file')}>
            <IconButton
              colorScheme="blue"
              onClick={onOpen}
              icon={<UploadSimple size={20} />}
              isDisabled={isDisabled}
              ml={2}
            />
          </Tooltip>
        </Text>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={label}
            right={
              <>
                <SaveButton onClick={saveValue} isDisabled={tempValue.length === 0 || !test(tempValue)} />
                <CloseButton ml={2} onClick={onClose} />
              </>
            }
          />
          <ModalBody>
            <Heading size="sm">{explanation}</Heading>
            <Box w={72} mt={2}>
              <FileInputButton
                value={value}
                setValue={setTempValue}
                setFileName={setTempFilename}
                refreshId={refreshId}
                accept={acceptedFileTypes}
                isStringFile
              />
            </Box>
            <FormControl isInvalid={tempValue !== '' && !test(tempValue)}>
              <Textarea isDisabled defaultValue={tempValue} mt={2} />
              <FormErrorMessage mt={2}>{t('form.invalid_file_content')}</FormErrorMessage>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

FileInputModal.propTypes = propTypes;
FileInputModal.defaultProps = defaultProps;
export default React.memo(FileInputModal);
