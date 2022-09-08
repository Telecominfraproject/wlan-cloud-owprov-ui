import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint, useDisclosure } from '@chakra-ui/react';
import { UploadSimple } from 'phosphor-react';
import ImportConfigurationModal from './Modal';

const propTypes = {
  setConfig: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const ImportConfigurationButton = ({ setConfig, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const breakpoint = useBreakpoint();

  const getButton = () => {
    if (breakpoint !== 'base' && breakpoint !== 'sm') {
      return (
        <Button
          ml={2}
          colorScheme="blue"
          onClick={onOpen}
          rightIcon={<UploadSimple size={20} />}
          isDisabled={isDisabled}
        >
          {t('configurations.import_file')}
        </Button>
      );
    }

    return (
      <Tooltip label={t('configurations.import_file')}>
        <IconButton
          ml={2}
          colorScheme="blue"
          onClick={onOpen}
          icon={<UploadSimple size={20} />}
          isDisabled={isDisabled}
        />
      </Tooltip>
    );
  };

  return (
    <>
      {getButton()}
      <ImportConfigurationModal isOpen={isOpen} onClose={onClose} setValue={setConfig} />
    </>
  );
};

ImportConfigurationButton.propTypes = propTypes;
export default React.memo(ImportConfigurationButton);
