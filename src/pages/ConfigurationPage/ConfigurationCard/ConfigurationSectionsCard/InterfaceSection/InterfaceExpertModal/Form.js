import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { testInterfacesString } from 'constants/formTests';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import SaveButton from 'components/Buttons/SaveButton';

const propTypes = {
  config: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setConfig: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

const InterfaceExpertForm = ({ config, setConfig, onClose, editing }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(JSON.stringify({ interfaces: config }, null, 2));

  const onChange = (e) => setValue(e.target.value);
  const isInvalid = useMemo(() => !testInterfacesString(value), [value]);

  const save = () => {
    setConfig(value);
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('configurations.expert_name')}
          right={
            <>
              <SaveButton onClick={save} isDisabled={isInvalid || !editing} />
              <CloseButton ml={2} onClick={onClose} />
            </>
          }
        />
        <ModalBody>
          <FormControl isInvalid={isInvalid} isRequired isDisabled={!editing}>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
              {t('configurations.interfaces_instruction')}
            </FormLabel>
            <Textarea
              value={value}
              onChange={onChange}
              borderRadius="15px"
              fontSize="sm"
              h="360px"
              type="text"
              _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
            />
            <FormErrorMessage>{t('form.invalid_interfaces')}</FormErrorMessage>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

InterfaceExpertForm.propTypes = propTypes;
export default React.memo(InterfaceExpertForm, isEqual);
