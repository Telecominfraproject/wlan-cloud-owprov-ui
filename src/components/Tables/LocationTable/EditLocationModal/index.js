import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useToast,
  Spinner,
  Center,
  useDisclosure,
  useBoolean,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { LocationShape } from 'constants/propShapes';
import { useGetLocation } from 'hooks/Network/Locations';
import useFormRef from 'hooks/useFormRef';
import EditLocationForm from './Form';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  location: PropTypes.shape(LocationShape),
  refresh: PropTypes.func.isRequired,
};

const defaultProps = {
  location: null,
};

const EditLocationModal = ({ isOpen, onClose, location, refresh }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const toast = useToast();
  const { form, formRef } = useFormRef();
  const { data: locationData, isLoading } = useGetLocation({
    t,
    toast,
    id: location?.id,
    enabled: location?.id !== '' && isOpen,
  });
  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) setEditing.off();
  }, [isOpen]);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('crud.edit_obj', { obj: t('locations.one') })}
          right={
            <>
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={!editing || !form.isValid || !form.dirty}
              />
              <EditButton ml={2} isDisabled={editing} onClick={setEditing.toggle} isCompact />
              <CloseButton ml={2} onClick={closeModal} />
            </>
          }
        />
        <ModalBody>
          {!isLoading && locationData !== undefined ? (
            <EditLocationForm
              editing={editing}
              location={locationData}
              isOpen={isOpen}
              onClose={onClose}
              refresh={refresh}
              formRef={formRef}
            />
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
        </ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

EditLocationModal.propTypes = propTypes;
EditLocationModal.defaultProps = defaultProps;

export default EditLocationModal;
