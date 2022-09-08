import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { uppercaseFirstLetter } from 'utils/stringHelper';
import {
  Alert,
  Box,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  useBoolean,
} from '@chakra-ui/react';
import ModalHeader from 'components/Modals/ModalHeader';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import { useTranslation } from 'react-i18next';
import { WarningCircle } from 'phosphor-react';

const fileToString = async (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = ({ target: { result = null } }) => resolve(result);
    reader.onerror = () => resolve(null);
  });

const configurationSections = ['globals', 'unit', 'metrics', 'services', 'radios', 'interfaces', 'third-party'];

const transformComputedConfigToEditable = (config) => {
  const configurations = [];

  try {
    for (const [section, value] of Object.entries(config)) {
      if (configurationSections.includes(section)) {
        const configuration = {
          name: uppercaseFirstLetter(section),
          description: '',
          weight: 1,
          configuration: {},
        };
        configuration.configuration[section] = value;
        configurations.push(configuration);
      }
    }

    return JSON.stringify(configurations, null, 4);
  } catch {
    return '';
  }
};

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

const ImportConfigurationModal = ({ isOpen, onClose, setValue }) => {
  const { t } = useTranslation();
  const [tempValue, setTempValue] = useState('');
  const [refreshId, setRefreshId] = useState('');
  const [error, { on, off }] = useBoolean();

  const saveValue = () => {
    const newVal = JSON.parse(tempValue).map((conf) => ({
      ...conf,
      configuration: JSON.stringify(conf.configuration),
    }));
    setValue(newVal);
    onClose();
  };

  const parseFile = async (file) => {
    const fileStr = await fileToString(file);

    if (!fileStr) on();
    else {
      try {
        const res = JSON.parse(fileStr);
        const transformConfig = transformComputedConfigToEditable(res);
        if (transformConfig) {
          setTempValue(transformConfig);
          off();
        } else on();
      } catch {
        on();
      }
    }
  };

  const onChange = (e) => {
    if (e.target.files?.length > 0) parseFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!isOpen) {
      setRefreshId(uuid());
      setTempValue('');
    }
  }, [isOpen]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('configurations.import_file')}
          right={
            <>
              <SaveButton onClick={saveValue} isDisabled={tempValue.length === 0 || error} />
              <CloseButton ml={2} onClick={onClose} />
            </>
          }
        />
        <ModalBody>
          <Alert my={2} colorScheme="red">
            <WarningCircle size={20} />
            <Text ml={2}>{t('configurations.import_warning')}</Text>
          </Alert>
          <Heading size="sm">{t('configurations.import_file_explanation')}</Heading>
          <Box w={72} mt={2}>
            <FormControl isInvalid={error}>
              <InputGroup>
                <Input
                  borderRadius="15px"
                  pt={1}
                  fontSize="sm"
                  type="file"
                  onChange={onChange}
                  key={refreshId}
                  accept=".json"
                />
              </InputGroup>
              <FormErrorMessage mt={2}>{t('form.invalid_file_content')}</FormErrorMessage>
            </FormControl>
          </Box>
          <Textarea h="512px" isDisabled defaultValue={tempValue} mt={2} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ImportConfigurationModal.propTypes = propTypes;
export default ImportConfigurationModal;
