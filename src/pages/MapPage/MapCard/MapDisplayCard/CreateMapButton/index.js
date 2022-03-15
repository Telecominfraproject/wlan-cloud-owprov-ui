import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  CloseButton,
} from '@chakra-ui/react';
import SaveButton from 'components/Buttons/SaveButton';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import ModalHeader from 'components/ModalHeader';
import { useCreateMap } from 'hooks/Network/Maps';
import CreateButton from 'components/Buttons/CreateButton';
import CreateMapForm from './Form';

const propTypes = {
  mapRef: PropTypes.instanceOf(Object).isRequired,
  setMapId: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const CreateMapButton = ({ mapRef, setMapId, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const [form, setForm] = useState({});
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  );
  const create = useCreateMap();

  const closeModal = () => (form.dirty ? openConfirm() : onClose());
  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <>
      <CreateButton onClick={onOpen} isDisabled={isDisabled} isCompact ml={2} />
      <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('map.title') })}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={!form.isValid || !form.dirty}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            {mapRef?.current && (
              <CreateMapForm
                create={create}
                isOpen={isOpen}
                onClose={onClose}
                currentMapInformation={mapRef.current.getDataToSave()}
                setMapId={setMapId}
                formRef={formRef}
              />
            )}
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert
          isOpen={showConfirm}
          confirm={closeCancelAndForm}
          cancel={closeConfirm}
        />
      </Modal>
    </>
  );
};

CreateMapButton.propTypes = propTypes;

export default React.memo(CreateMapButton);
