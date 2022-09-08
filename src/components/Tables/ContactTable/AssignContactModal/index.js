import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  useToast,
  Flex,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { Lock, Plus, Trash } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { useQueryClient } from 'react-query';
import ContactTable from 'components/Tables/ContactTable';
import { useClaimContacts, useGetAllContacts } from 'hooks/Network/Contacts';

const propTypes = {
  entityId: PropTypes.string,
  venueId: PropTypes.string,
  alreadyClaimed: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const defaultProps = {
  entityId: '',
  venueId: '',
};

const AssignContactModal = ({ entityId, venueId, alreadyClaimed }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const claimDevices = useClaimContacts({ entityId, venueId });
  const [contacts, setContacts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { data: allContacts } = useGetAllContacts({ t, toast });

  const closeModal = () => (contacts.length > 0 ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const openModal = () => {
    setContacts([]);
    onOpen();
  };

  const addContact = useCallback(
    (newId) => {
      const newContacts = [...contacts];
      newContacts.push(newId);
      setContacts(newContacts);
    },
    [contacts, setContacts],
  );
  const removeContact = useCallback(
    (contactToRemove) => {
      const newContacts = contacts.filter((id) => id !== contactToRemove);
      setContacts([...newContacts]);
    },
    [contacts, setContacts],
  );

  const handleSave = () =>
    claimDevices.mutateAsync(contacts, {
      onSuccess: ({ claimErrors }) => {
        if (claimErrors.length > 0) {
          toast({
            id: uuid(),
            title: t('common.error'),
            description: t('common.error_claiming_obj'),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        } else {
          toast({
            id: 'contact-claim-success',
            title: t('common.success'),
            description: t('common.successfully_claimed_obj', {
              count: contacts.length,
              obj: t('contacts.other'),
            }),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          queryClient.invalidateQueries(['get-entity', entityId]);
          onClose();
        }
      },
      onError: () => {
        toast({
          id: uuid(),
          title: t('common.error'),
          description: t('common.error_claiming_obj'),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    });

  const addActions = useCallback(
    (cell) => (
      <Flex>
        <Tooltip hasArrow label={t('common.claim')} placement="top">
          <IconButton
            ml={2}
            colorScheme="blue"
            icon={<Plus size={20} />}
            size="sm"
            isDisabled={
              contacts.find((cont) => cont === cell.row.original.id) ||
              alreadyClaimed.find((cont) => cont === cell.row.original.id)
            }
            onClick={() => addContact(cell.row.original.id)}
          />
        </Tooltip>
      </Flex>
    ),
    [contacts, alreadyClaimed, setContacts],
  );

  const removeActions = useCallback(
    (cell) => (
      <Flex>
        <Tooltip hasArrow label={t('common.remove')} placement="top">
          <IconButton
            ml={2}
            colorScheme="blue"
            icon={<Trash size={20} />}
            size="sm"
            onClick={() => removeContact(cell.row.original.id)}
          />
        </Tooltip>
      </Flex>
    ),
    [contacts, alreadyClaimed, setContacts],
  );

  return (
    <>
      <Button
        alignItems="center"
        colorScheme="blue"
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        rightIcon={<Lock size={20} />}
        onClick={openModal}
        ml={2}
      >
        {t('common.claim')}
      </Button>
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={`${t('common.claim')} ${t('contacts.other')}`}
            right={
              <>
                <SaveButton
                  onClick={handleSave}
                  isLoading={claimDevices.isLoading}
                  isDisabled={contacts.length === 0}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            <Heading mt={4} size="sm">
              {t('contacts.to_claim')}
            </Heading>
            <Box mt={2} h="280px" border="1px" overflowX="auto" borderRadius="8px">
              <ContactTable
                removeAction={removeContact}
                select={contacts}
                actions={removeActions}
                disabledIds={[...contacts, ...alreadyClaimed]}
                ignoredColumns={['created', 'modified']}
              />
            </Box>
            <Heading mt={8} size="sm">
              {t('contacts.claim_explanation')}
            </Heading>
            <Box mt={2} h="360px" border="1px" overflowX="auto" borderRadius="8px">
              <ContactTable
                addAction={addContact}
                select={allContacts?.map((cont) => cont.id) ?? []}
                actions={addActions}
                disabledIds={[...contacts, ...alreadyClaimed]}
                ignoredColumns={['created', 'modified']}
              />
            </Box>
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

AssignContactModal.propTypes = propTypes;
AssignContactModal.defaultProps = defaultProps;

export default AssignContactModal;
