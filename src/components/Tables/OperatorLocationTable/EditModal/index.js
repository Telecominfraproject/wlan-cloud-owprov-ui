import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalOverlay, ModalContent, ModalBody, Spinner, Center, useBoolean } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import { LocationShape } from 'constants/propShapes';
import useFormRef from 'hooks/useFormRef';
import useFormModal from 'hooks/useFormModal';
import { useGetOperatorLocation } from 'hooks/Network/OperatorLocations';
import EditOperatorLocationForm from './Form';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  location: PropTypes.shape(LocationShape),
  refresh: PropTypes.func.isRequired,
};

const defaultProps = {
  location: null,
};

const EditOperatorLocationModal = ({ isOpen, onClose, location, refresh }) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const [editing, setEditing] = useBoolean();
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
    onModalClose: onClose,
  });
  const { data: locationData, isLoading } = useGetOperatorLocation({
    id: location?.id,
    enabled: location?.id !== '' && isOpen,
  });

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
            <EditOperatorLocationForm
              editing={editing}
              location={locationData}
              isOpen={isOpen}
              onClose={closeCancelAndForm}
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
      <ConfirmCloseAlert isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

EditOperatorLocationModal.propTypes = propTypes;
EditOperatorLocationModal.defaultProps = defaultProps;

export default EditOperatorLocationModal;
