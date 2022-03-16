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
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import { useQueryClient } from 'react-query';
import LocationTable from 'components/Tables/LocationTable';
import { useClaimLocations, useGetAllLocations } from 'hooks/Network/Locations';

const propTypes = {
  entityId: PropTypes.string,
  alreadyClaimed: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const defaultProps = {
  entityId: '',
};

const AssignLocationModal = ({ entityId, alreadyClaimed }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const claimDevices = useClaimLocations({ entityId });
  const [locations, setLocations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { data: allLocations } = useGetAllLocations({ t, toast });

  const closeModal = () => (locations.length > 0 ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const openModal = () => {
    setLocations([]);
    onOpen();
  };

  const addLocation = useCallback(
    (newId) => {
      const newLocations = [...locations];
      newLocations.push(newId);
      setLocations(newLocations);
    },
    [locations, setLocations],
  );
  const removeLocation = useCallback(
    (locationToRemove) => {
      const newLocations = locations.filter((id) => id !== locationToRemove);
      setLocations([...newLocations]);
    },
    [locations, setLocations],
  );

  const handleSave = () =>
    claimDevices.mutateAsync(locations, {
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
            id: 'location-claim-success',
            title: t('common.success'),
            description: t('common.successfully_claimed_obj', {
              count: locations.length,
              obj: t('locations.other'),
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
              locations.find((cont) => cont === cell.row.original.id) ||
              alreadyClaimed.find((cont) => cont === cell.row.original.id)
            }
            onClick={() => addLocation(cell.row.original.id)}
          />
        </Tooltip>
      </Flex>
    ),
    [locations, alreadyClaimed, setLocations],
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
            onClick={() => removeLocation(cell.row.original.id)}
          />
        </Tooltip>
      </Flex>
    ),
    [locations, alreadyClaimed, setLocations],
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
            title={`${t('common.claim')} ${t('locations.other')}`}
            right={
              <>
                <SaveButton
                  onClick={handleSave}
                  isLoading={claimDevices.isLoading}
                  isDisabled={locations.length === 0}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            <Heading mt={4} size="sm">
              {t('locations.to_claim')}
            </Heading>
            <Box mt={2} h="280px" border="1px" overflowX="auto" borderRadius="8px">
              <LocationTable
                removeAction={removeLocation}
                select={locations}
                actions={removeActions}
                ignoredColumns={['created', 'modified']}
                disabledIds={[...locations, ...alreadyClaimed]}
              />
            </Box>
            <Heading mt={8} size="sm">
              {t('locations.claim_explanation')}
            </Heading>
            <Box mt={2} h="360px" border="1px" overflowX="auto" borderRadius="8px">
              <LocationTable
                addAction={addLocation}
                select={allLocations?.map((cont) => cont.id) ?? []}
                actions={addActions}
                ignoredColumns={['created', 'modified']}
                disabledIds={[...locations, ...alreadyClaimed]}
              />
            </Box>
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

AssignLocationModal.propTypes = propTypes;
AssignLocationModal.defaultProps = defaultProps;

export default AssignLocationModal;
