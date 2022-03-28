import React from 'react';
import PropTypes from 'prop-types';
import CreateButton from 'components/Buttons/CreateButton';
import { useTranslation } from 'react-i18next';
import { Center } from '@chakra-ui/react';
import { INTERFACE_SSID_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  pushSsid: PropTypes.func.isRequired,
};
const CreateSsidButton = ({ editing, pushSsid }) => {
  const { t } = useTranslation();

  const createSsid = () => {
    pushSsid(INTERFACE_SSID_SCHEMA(t, true).cast());
  };

  if (!editing) return null;

  return (
    <Center>
      <CreateButton label={t('configurations.add_ssid')} onClick={createSsid} />
    </Center>
  );
};

CreateSsidButton.propTypes = propTypes;
export default React.memo(CreateSsidButton);
