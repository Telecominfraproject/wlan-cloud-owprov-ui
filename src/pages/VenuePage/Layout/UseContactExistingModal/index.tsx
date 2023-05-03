import React, { useCallback } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Tooltip, IconButton } from '@chakra-ui/react';
import { Copy } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import ContactTable from 'components/Tables/ContactTable';
import { useGetEntity } from 'hooks/Network/Entity';
import { ContactObj } from 'models/Contact';
import { VenueApiResponse } from 'models/Venue';

interface Props {
  venue?: VenueApiResponse;
  onAssignContact: (contactId: string) => void;
}

const UseExistingContactModal = ({ onAssignContact, venue }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: entity } = useGetEntity({ id: venue?.entity });

  const claimContact = async (id: string) => {
    await onAssignContact(id);
    onClose();
  };
  const actions = useCallback(
    (cell: { row: { original: ContactObj } }) => (
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
      <Tooltip label={t('venues.use_existing')}>
        <IconButton
          aria-label={t('venues.use_existing')}
          icon={<Copy size={20} />}
          onClick={onOpen}
          colorScheme="teal"
        />
      </Tooltip>
      <Modal initialFocusRef={undefined} onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader title={t('venues.use_existing_contacts')} right={<CloseButton ml={2} onClick={onClose} />} />
          <ModalBody>
            <ContactTable
              select={entity?.contacts ?? []}
              actions={actions}
              ignoredColumns={['entity', 'venue']}
              disabledIds={venue?.contacts ?? []}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UseExistingContactModal;
