import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import useGetDeviceTypes from 'hooks/Network/DeviceTypes';
import CreateButton from 'components/Buttons/CreateButton';
import CreateTagForm from './Form';

const propTypes = {
  refresh: PropTypes.func.isRequired,
  entityId: PropTypes.string,
  subId: PropTypes.string,
};

const defaultProps = {
  entityId: '',
  subId: '',
};

const CreateTagModal = ({ refresh, entityId, subId }) => {
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
  const { data: deviceTypes } = useGetDeviceTypes();
  const [configuration, setConfiguration] = useState(null);

  const onConfigurationChange = useCallback((conf) => setConfiguration(conf), []);

  const create = useMutation((newObj) =>
    axiosProv.post(
      `inventory/${newObj.serialNumber}${
        newObj.__newConfig
          ? `?createObjects=${JSON.stringify({
              objects: [{ configuration: newObj.__newConfig }],
            })}`
          : ''
      }`,
      newObj,
    ),
  );

  const openModal = () => {
    setConfiguration(null);
    onOpen();
  };
  const closeModal = () =>
    form.dirty || configuration?.__form?.isDirty ? openConfirm() : onClose();
  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <>
      <CreateButton onClick={openModal} ml={2} />
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('inventory.tag', { count: 1 }) })}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={
                    !form.isValid ||
                    !form.dirty ||
                    (configuration !== null && !configuration.__form.isValid)
                  }
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            <CreateTagForm
              deviceTypesList={deviceTypes ?? []}
              create={create}
              isOpen={isOpen}
              onClose={onClose}
              refresh={refresh}
              formRef={formRef}
              entityId={entityId}
              subId={subId}
              configuration={configuration}
              onConfigurationChange={onConfigurationChange}
            />
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

CreateTagModal.propTypes = propTypes;
CreateTagModal.defaultProps = defaultProps;

export default CreateTagModal;
