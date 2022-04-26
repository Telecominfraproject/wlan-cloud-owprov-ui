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
} from '@chakra-ui/react';
import { Lock } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { useClaimInventory } from 'hooks/Network/Inventory';
import { useQueryClient } from 'react-query';
import InventoryTable from '..';

const propTypes = {
  entityId: PropTypes.string,
  alreadyClaimedDevices: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const defaultProps = {
  entityId: '',
};

const AssignTagModal = ({ entityId, alreadyClaimedDevices }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const claimDevices = useClaimInventory({
    isVenue: entityId.split(':')[0] !== 'entity',
    entity: entityId.split(':')[1],
    unassign: true,
  });
  const [serialNumbers, setSerialNumbers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const closeModal = () => (serialNumbers.length > 0 ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const openModal = () => {
    setSerialNumbers([]);
    onOpen();
  };

  const addSerialNumber = useCallback(
    (newSerial) => {
      const newSerials = [...serialNumbers];
      newSerials.push(newSerial);
      setSerialNumbers(newSerials);
    },
    [serialNumbers, setSerialNumbers],
  );
  const removeSerialNumber = useCallback(
    (serialToRemove) => {
      const newSerials = serialNumbers.filter((serial) => serial !== serialToRemove);
      setSerialNumbers([...newSerials]);
    },
    [serialNumbers, setSerialNumbers],
  );

  const handleSave = () =>
    claimDevices.mutateAsync(serialNumbers, {
      onSuccess: ({ claimErrors, unassignErrors }) => {
        if (unassignErrors.length > 0) {
          toast({
            id: uuid(),
            title: t('common.error'),
            description: t('subscribers.error_removing_claim', {
              serials: unassignErrors.join(','),
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        } else if (claimErrors.length > 0) {
          toast({
            id: uuid(),
            title: t('common.error'),
            description: t('subscribers.error_claiming', {
              serials: claimErrors.join(','),
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        } else {
          toast({
            id: 'inventory-claim-success',
            title: t('common.success'),
            description: t('subscribers.devices_claimed_other', {
              count: serialNumbers.length,
            }),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          queryClient.invalidateQueries(
            entityId.split(':')[0] === 'entity'
              ? ['get-entity', entityId.split(':')[1]]
              : ['get-venue', entityId.split(':')[1]],
          );
          onClose();
        }
      },
      onError: () => {
        toast({
          id: uuid(),
          title: t('common.error'),
          description: t('subscribers.error_claiming', {
            serials: serialNumbers.join(','),
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    });

  return (
    <>
      <Button alignItems="center" colorScheme="blue" rightIcon={<Lock size={20} />} onClick={openModal} ml={2}>
        {t('common.claim')}
      </Button>
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={`${t('common.claim')} ${t('devices.title')}`}
            right={
              <>
                <SaveButton
                  onClick={handleSave}
                  isLoading={claimDevices.isLoading}
                  isDisabled={serialNumbers.length === 0}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            <Heading mt={4} size="sm">
              {t('entities.devices_to_claim')}
            </Heading>
            <Box mt={2} h="280px" border="1px" overflowX="auto" borderRadius="8px">
              <InventoryTable
                removeAction={removeSerialNumber}
                ignoredColumns={['name', 'configuration']}
                tagSelect={serialNumbers}
              />
            </Box>
            <Heading mt={8} size="sm">
              {t('entities.claim_device_explanation')}
            </Heading>
            <Box mt={2} h="460px" border="1px" overflowX="auto" borderRadius="8px">
              <InventoryTable
                addAction={addSerialNumber}
                ignoredColumns={['name', 'configuration']}
                serialsToDisable={[...serialNumbers, ...alreadyClaimedDevices]}
              />
            </Box>
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

AssignTagModal.propTypes = propTypes;
AssignTagModal.defaultProps = defaultProps;

export default AssignTagModal;
