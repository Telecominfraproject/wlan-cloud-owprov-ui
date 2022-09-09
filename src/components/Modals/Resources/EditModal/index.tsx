import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
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
import { Resource } from 'models/Resource';
import { useGetResource } from 'hooks/Network/Resources';
import useFormRef from 'hooks/useFormRef';
import InterfaceSsidRadiusResource from '../Sections/InterfaceSsidRadius';
import InterfaceVlanResource from '../Sections/InterfaceVlan';
import InterfaceSsidResource from '../Sections/InterfaceSsid';
import SingleRadioResource from '../Sections/SingleRadio';
import InterfaceCaptiveResource from '../Sections/CaptivePortal';
import InterfaceTunnelResource from '../Sections/Tunnel';
import InterfaceIpv4Resource from '../Sections/Ipv4';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resource?: Resource;
  refresh: () => void;
}

const EditResourceModal: React.FC<Props> = ({ isOpen, onClose, resource, refresh }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { form, formRef } = useFormRef();
  const {
    data: resourceData,
    isLoading,
    refetch,
  } = useGetResource({
    id: resource?.id ?? '',
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

  const refreshAll = () => {
    refetch();
    refresh();
  };

  const getForm = () => {
    if (isLoading || !resourceData)
      return (
        <Center>
          <Spinner />
        </Center>
      );

    if (getType() === 'interface.captive')
      return (
        <InterfaceCaptiveResource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );

    if (getType() === 'interface.ssid.radius')
      return (
        <InterfaceSsidRadiusResource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );
    if (getType() === 'interface.tunnel')
      return (
        <InterfaceTunnelResource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );

    if (getType() === 'interface.ipv4')
      return (
        <InterfaceIpv4Resource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );

    if (getType() === 'interface.vlan')
      return (
        <InterfaceVlanResource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );

    if (getType() === 'interface.ssid')
      return (
        <InterfaceSsidResource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );

    if (getType() === 'radio')
      return (
        <SingleRadioResource
          resource={resourceData}
          isOpen={isOpen}
          onClose={onClose}
          refresh={refreshAll}
          formRef={formRef}
          isDisabled={!editing}
        />
      );

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
        <ModalBody>{getForm()}</ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

export default EditResourceModal;
