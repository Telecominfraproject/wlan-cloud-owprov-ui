import React, { useState } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import InterfaceCaptiveResource from '../Sections/CaptivePortal';
import InterfaceSsidResource from '../Sections/InterfaceSsid';
import InterfaceSsidRadiusResource from '../Sections/InterfaceSsidRadius';
import InterfaceVlanResource from '../Sections/InterfaceVlan';
import InterfaceIpv4Resource from '../Sections/Ipv4';
import OpenRoamingSSID from '../Sections/OpenRoamingSsid';
import SingleRadioResource from '../Sections/SingleRadio';
import InterfaceTunnelResource from '../Sections/Tunnel';
import CloseButton from 'components/Buttons/CloseButton';
import CreateButton from 'components/Buttons/CreateButton';
import SaveButton from 'components/Buttons/SaveButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import ModalHeader from 'components/Modals/ModalHeader';
import { useGetRadiusEndpoints } from 'hooks/Network/RadiusEndpoints';
import useFormRef from 'hooks/useFormRef';

interface Props {
  refresh: () => void;
  entityId: string;
  isVenue?: boolean;
}

const CreateResourceModal: React.FC<Props> = ({ refresh, entityId, isVenue = false }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVariable, setSelectedVariable] = useState('interface.ssid');
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { form, formRef } = useFormRef();
  const getRadiusEndpoints = useGetRadiusEndpoints();

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const onVariableChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVariable(e.target.value);

  return (
    <>
      <CreateButton ml={2} onClick={onOpen} isCompact />
      <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('resources.configuration_resource') })}
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
            <FormControl isRequired mb={4}>
              <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                Configuration Section
              </FormLabel>
              <Select value={selectedVariable} onChange={onVariableChange} borderRadius="15px" fontSize="sm" w="200px">
                <option value="interface.captive">interface.captive</option>
                <option value="interface.ipv4">interface.ipv4</option>
                <option value="radio">radio</option>
                <option value="interface.ssid">interface.ssid</option>
                <option
                  value="interface.ssid.openroaming"
                  hidden={!getRadiusEndpoints.data || getRadiusEndpoints.data.length === 0}
                >
                  Open Roaming SSID
                </option>
                <option value="interface.ssid.radius">interface.ssid.radius</option>
                <option value="interface.tunnel">interface.tunnel</option>
                <option value="interface.vlan">interface.vlan</option>
              </Select>
            </FormControl>
            {selectedVariable === 'interface.captive' && (
              <InterfaceCaptiveResource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
                isDisabled={false}
              />
            )}
            {selectedVariable === 'interface.ssid.radius' && (
              <InterfaceSsidRadiusResource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                isDisabled={false}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
              />
            )}
            {selectedVariable === 'interface.ssid.openroaming' && getRadiusEndpoints.data && (
              <OpenRoamingSSID
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                isDisabled={false}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
                radiusEndpoints={getRadiusEndpoints.data}
              />
            )}
            {selectedVariable === 'interface.tunnel' && (
              <InterfaceTunnelResource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
                isDisabled={false}
              />
            )}
            {selectedVariable === 'interface.vlan' && (
              <InterfaceVlanResource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                isDisabled={false}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
              />
            )}
            {selectedVariable === 'interface.ssid' && (
              <InterfaceSsidResource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
                isDisabled={false}
              />
            )}
            {selectedVariable === 'radio' && (
              <SingleRadioResource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
                isDisabled={false}
              />
            )}
            {selectedVariable === 'interface.ipv4' && (
              <InterfaceIpv4Resource
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                formRef={formRef}
                parent={{ entity: isVenue ? undefined : entityId, venue: isVenue ? entityId : undefined }}
                isDisabled={false}
              />
            )}
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

export default CreateResourceModal;
