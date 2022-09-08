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
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { useGetComputedConfiguration, useGetTag } from 'hooks/Network/Inventory';
import useGetDeviceTypes from 'hooks/Network/DeviceTypes';
import { ArrowSquareOut, PaperPlaneTilt } from 'phosphor-react';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import EditTagForm from './Form';
import DeviceActionDropdown from './ActionDropdown';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tag: PropTypes.shape({
    serialNumber: PropTypes.string.isRequired,
    name: PropTypes.stirng,
  }),
  refresh: PropTypes.func.isRequired,
  pushConfig: PropTypes.instanceOf(Object).isRequired,
  onOpenScan: PropTypes.func.isRequired,
  onOpenFactoryReset: PropTypes.func.isRequired,
  onOpenUpgradeModal: PropTypes.func.isRequired,
};

const defaultProps = {
  tag: null,
};

const EditTagModal = ({
  isOpen,
  onClose,
  tag,
  refresh,
  pushConfig,
  onOpenScan,
  onOpenFactoryReset,
  onOpenUpgradeModal,
}) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const toast = useToast();
  const [form, setForm] = useState({});
  const [configuration, setConfiguration] = useState(null);
  const { data: gwUi } = useGetGatewayUi();
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

  const closeModal = () => (form.dirty || configuration?.__form?.isDirty ? openConfirm() : onClose());
  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const handlePushConfig = () => pushConfig.mutateAsync(tag.serialNumber);
  const handleOpenInGateway = () => window.open(`${gwUi}/#/devices/${tag.serialNumber}`, '_blank');

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
          title={t('crud.edit_obj', { obj: tag?.name ?? tag?.serialNumber })}
          right={
            <>
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={!editing || !form.isValid || (configuration !== null && !configuration.__form.isValid)}
              />
              <DeviceActionDropdown
                device={tag}
                isDisabled={editing}
                onOpenScan={onOpenScan}
                onOpenFactoryReset={onOpenFactoryReset}
                onOpenUpgradeModal={onOpenUpgradeModal}
              />
              <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
                <IconButton
                  aria-label="Go to device gateway page"
                  ml={2}
                  colorScheme="blue"
                  icon={<ArrowSquareOut size={20} />}
                  onClick={handleOpenInGateway}
                />
              </Tooltip>
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
              onClose={setEditing.off}
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
