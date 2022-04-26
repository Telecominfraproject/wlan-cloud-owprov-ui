import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { Plus } from 'phosphor-react';
import ContactTable from 'components/Tables/ContactTable';
import { useGetEntity } from 'hooks/Network/Entity';
import { Venue } from 'models/Venue';
import Actions from './Actions';

interface Props {
  venue: Venue;
  onAssignContact: (contactId: string) => void;
}

const UseExistingContactModal: React.FC<Props> = ({ onAssignContact, venue }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: entity } = useGetEntity({ id: venue.entity });

  const claimContact = async (id: string) => {
    await onAssignContact(id);
    onClose();
  };
  const actions = useCallback(
    (cell) => (
      <Actions
        key={uuid()}
        cell={cell.row}
        claimContact={claimContact}
        isDisabled={venue?.contacts !== undefined && venue.contacts.includes(cell.row.original.id)}
      />
    ),
    [onAssignContact, claimContact, venue],
  );

  return (
    <>
      <Button type="button" colorScheme="blue" rightIcon={<Plus size={20} />} onClick={onOpen} ml={2}>
        {t('venues.use_existing')}
      </Button>
      <Modal initialFocusRef={undefined} onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader title={t('venues.use_existing_contacts')} right={<CloseButton ml={2} onClick={onClose} />} />
          <ModalBody>
            <ContactTable
              select={entity?.contacts ?? []}
              actions={actions}
              ignoredColumns={['entity', 'venue']}
              disabledIds={venue.contacts}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UseExistingContactModal;
