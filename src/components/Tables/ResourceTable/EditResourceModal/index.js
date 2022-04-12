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
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import { SubscriberShape } from 'constants/propShapes';
import { useGetResource } from 'hooks/Network/Resources';
import useFormRef from 'hooks/useFormRef';
import InterfaceSsidRadius from './InterfaceSsidRadius';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  resource: PropTypes.shape(SubscriberShape),
  refresh: PropTypes.func.isRequired,
};

const defaultProps = {
  resource: null,
};

const EditResourceModal = ({ isOpen, onClose, resource, refresh }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const toast = useToast();
  const { form, formRef } = useFormRef();
  const { data: resourceData, isLoading } = useGetResource({
    t,
    toast,
    id: resource?.id,
    enabled: resource?.id !== '' && isOpen,
  });

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const getType = () => {
    if (resourceData) {
      return resourceData.variables[0]?.prefix ?? null;
    }

    return null;
  };

  useEffect(() => {
    if (isOpen) setEditing.off();
  }, [isOpen]);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('crud.edit_obj', { obj: t('resources.configuration_resource') })}
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
          {!isLoading && resourceData && getType() === 'interface.ssid.radius' ? (
            <InterfaceSsidRadius
              editing={editing}
              resource={resourceData}
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

EditResourceModal.propTypes = propTypes;
EditResourceModal.defaultProps = defaultProps;

export default EditResourceModal;
