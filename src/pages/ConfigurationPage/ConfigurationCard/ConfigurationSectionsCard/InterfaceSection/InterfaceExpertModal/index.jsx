import React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import InterfaceExpertForm from './Form';
import EditButton from 'components/Buttons/EditButton';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const InterfaceExpertModal = ({ editing }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ value }, , { setValue }] = useField('configuration');

  const setConfig = (v) => {
    setValue(JSON.parse(v).interfaces);
  };

  return (
    <>
      <EditButton label={t('configurations.expert_name')} onClick={onOpen} />
      {isOpen && <InterfaceExpertForm config={value} onClose={onClose} setConfig={setConfig} editing={editing} />}
    </>
  );
};

InterfaceExpertModal.propTypes = propTypes;
export default InterfaceExpertModal;
