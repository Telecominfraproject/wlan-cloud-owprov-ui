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
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import { TagShape } from 'constants/propShapes';
import { useGetComputedConfiguration, useGetTag } from 'hooks/Network/Inventory';
import useGetDeviceTypes from 'hooks/Network/DeviceTypes';
import { PaperPlaneTilt } from 'phosphor-react';
import EditTagForm from './Form';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tag: PropTypes.shape(TagShape),
  refresh: PropTypes.func.isRequired,
  pushConfig: PropTypes.instanceOf(Object).isRequired,
};

const defaultProps = {
  tag: null,
};

const EditTagModal = ({ isOpen, onClose, tag, refresh, pushConfig }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const toast = useToast();
  const [form, setForm] = useState({});
  const [configuration, setConfiguration] = useState(null);
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
  const { data: deviceTypesList } = useGetDeviceTypes();
  const { data: tagData, isLoading } = useGetTag({
    t,
    toast,
    serialNumber: tag?.serialNumber,
    enabled: tag?.serialNumber !== '' && isOpen,
  });
  const { data: computedConfig } = useGetComputedConfiguration({
    t,
    toast,
    serialNumber: tag?.serialNumber,
    enabled: tag?.serialNumber !== '' && isOpen,
  });
  const updateTag = useMutation((tagInfo) =>
    axiosProv.put(
      `inventory/${tag?.serialNumber}${
        tagInfo.__newConfig
          ? `?createObjects=${JSON.stringify({
              objects: [{ configuration: tagInfo.__newConfig }],
            })}`
          : ''
      }`,
      tagInfo,
    ),
  );

  const onConfigurationChange = useCallback((conf) => setConfiguration(conf), []);

  const closeModal = () =>
    form.dirty || configuration?.__form?.isDirty ? openConfirm() : onClose();
  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const handlePushConfig = () => pushConfig.mutateAsync(tag.serialNumber);

  useEffect(() => {
    if (isOpen) {
      setConfiguration(null);
      setEditing.off();
    }
  }, [isOpen]);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
        <ModalHeader
          title={t('crud.edit_obj', { obj: tag?.name })}
          right={
            <>
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={
                  !editing ||
                  !form.isValid ||
                  (configuration !== null && !configuration.__form.isValid)
                }
              />
              <Tooltip hasArrow label={t('configurations.push_configuration')} placement="top">
                <IconButton
                  ml={2}
                  colorScheme="blue"
                  icon={<PaperPlaneTilt size={20} />}
                  isDisabled={editing}
                  isLoading={pushConfig.isLoading}
                  onClick={handlePushConfig}
                />
              </Tooltip>
              <EditButton ml={2} isDisabled={editing} onClick={setEditing.toggle} isCompact />
              <CloseButton ml={2} onClick={closeModal} />
            </>
          }
        />
        <ModalBody>
          {!isLoading && tagData ? (
            <EditTagForm
              editing={editing}
              tag={{ ...tagData, computedConfig }}
              updateTag={updateTag}
              isOpen={isOpen}
              onClose={onClose}
              refresh={refresh}
              formRef={formRef}
              deviceTypesList={deviceTypesList ?? []}
              configuration={configuration}
              onConfigurationChange={onConfigurationChange}
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

EditTagModal.propTypes = propTypes;
EditTagModal.defaultProps = defaultProps;

export default EditTagModal;
