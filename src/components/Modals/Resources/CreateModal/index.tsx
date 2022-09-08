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
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import CreateButton from 'components/Buttons/CreateButton';
import useFormRef from 'hooks/useFormRef';
import InterfaceSsidResource from '../Sections/InterfaceSsid';
import InterfaceSsidRadiusResource from '../Sections/InterfaceSsidRadius';
import InterfaceVlanResource from '../Sections/InterfaceVlan';

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

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const onVariableChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVariable(e.target.value);

  return (
    <>
      <CreateButton ml={2} onClick={onOpen} />
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
            <FormControl isRequired>
              <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                {t('resources.variable')}
              </FormLabel>
              <Select value={selectedVariable} onChange={onVariableChange} borderRadius="15px" fontSize="sm" w="200px">
                <option value="interface.ssid.radius">interface.ssid.radius</option>
                <option value="interface.vlan">interface.vlan</option>
                <option value="interface.ssid">interface.ssid</option>
              </Select>
            </FormControl>
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
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

export default CreateResourceModal;
