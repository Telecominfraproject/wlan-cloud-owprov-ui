import React from 'react';
import PropTypes from 'prop-types';
import { useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import EditButton from 'components/Buttons/EditButton';
import { useField } from 'formik';
import InterfaceExpertForm from './Form';

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
