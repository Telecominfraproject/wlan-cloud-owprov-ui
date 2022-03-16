import React, { useCallback, useEffect, useState } from 'react';
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
import { useMutation } from 'react-query';
import { useGetSubscriber } from 'hooks/Network/Subscribers';
import { axiosProv, axiosSec } from 'utils/axiosInstances';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import { RequirementsShape, SubscriberShape } from 'constants/propShapes';
import { useGetInventoryTags } from 'hooks/Network/Inventory';
import EditSubscriberForm from './Form';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subscriber: PropTypes.shape(SubscriberShape),
  requirements: PropTypes.shape(RequirementsShape),
  refresh: PropTypes.func.isRequired,
};

const defaultProps = {
  subscriber: null,
  requirements: {
    accessPolicy: '',
    passwordPolicy: '',
  },
};

const EditSubscriberModal = ({ isOpen, onClose, subscriber, requirements, refresh }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const toast = useToast();
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
  const { data: subscriberData, isLoading } = useGetSubscriber({
    t,
    toast,
    id: subscriber?.id,
    enabled: subscriber?.id !== '' && isOpen,
  });
  const updateSubscriber = useMutation((subInfo) => axiosSec.put(`subuser/${subscriber?.id}`, subInfo));
  const { data: tagSerials } = useGetInventoryTags({
    t,
    toast,
    enabled: subscriber?.id !== '' && isOpen,
    owner: subscriber?.id,
  });
  const [deviceSerials, setDeviceSerials] = useState(null);

  const addSerialNumber = useCallback(
    (newSerial) => {
      const newSerials = [...deviceSerials];
      newSerials.push(newSerial);
      setDeviceSerials(newSerials);
    },
    [deviceSerials, setDeviceSerials],
  );
  const removeSerialNumber = useCallback(
    (serialToRemove) => {
      const newSerials = deviceSerials.filter((serial) => serial !== serialToRemove);
      setDeviceSerials([...newSerials]);
    },
    [deviceSerials, setDeviceSerials],
  );

  const claimDevices = async () => {
    const toRemove = tagSerials.filter((old) => !deviceSerials.find((edited) => edited === old));
    const toAdd = deviceSerials.filter((edited) => !tagSerials.find((old) => edited === old));

    const removePromises = toRemove.map(async (serialNumber) =>
      axiosProv
        .put(`inventory/${serialNumber}`, { subscriber: '' })
        .then(() => ({
          serialNumber,
        }))
        .catch(() => ({ serialNumber, error: true })),
    );

    const addPromises = toAdd.map(async (serialNumber) =>
      axiosProv
        .put(`inventory/${serialNumber}`, { subscriber: subscriber.id })
        .then(() => ({
          serialNumber,
        }))
        .catch(() => ({ serialNumber, error: true })),
    );

    const removeResults = await Promise.all(removePromises);
    const claimResults = await Promise.all(addPromises);

    const removeErrors = removeResults.filter((res) => res.error).map((res) => res.serialNumber);
    const claimErrors = claimResults.filter((res) => res.error).map((res) => res.serialNumber);

    return [removeErrors, claimErrors];
  };

  const closeModal = () => (form.dirty || deviceSerials !== tagSerials ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  useEffect(() => {
    setDeviceSerials(tagSerials ?? null);
  }, [tagSerials]);

  useEffect(() => {
    if (isOpen) setEditing.off();
  }, [isOpen]);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('crud.edit_obj', { obj: t('subscribers.one') })}
          right={
            <>
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={!editing || !form.isValid || (!form.dirty && deviceSerials === tagSerials)}
              />
              <EditButton ml={2} isDisabled={editing} onClick={setEditing.toggle} isCompact />
              <CloseButton ml={2} onClick={closeModal} />
            </>
          }
        />
        <ModalBody>
          {!isLoading && subscriberData && deviceSerials ? (
            <EditSubscriberForm
              editing={editing}
              subscriber={subscriberData}
              requirements={requirements}
              updateSubscriber={updateSubscriber}
              isOpen={isOpen}
              onClose={onClose}
              refresh={refresh}
              formRef={formRef}
              deviceSerials={deviceSerials}
              addSerialNumber={addSerialNumber}
              removeSerialNumber={removeSerialNumber}
              claimDevices={claimDevices}
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

EditSubscriberModal.propTypes = propTypes;
EditSubscriberModal.defaultProps = defaultProps;

export default EditSubscriberModal;
