import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Center,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import { useDeleteVenue } from 'hooks/Network/Venues';
import { EntityShape } from 'constants/propShapes';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

const propTypes = {
  venue: PropTypes.shape(EntityShape),
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  venue: { name: '', id: '' },
  isDisabled: false,
};

const DeleteVenuePopover = ({ venue, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteVenue = useDeleteVenue();

  const handleDeleteClick = () =>
    deleteVenue.mutateAsync(venue.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['get-entity-tree']);
        onClose();
        toast({
          id: `venue-delete-success`,
          title: t('common.success'),
          description: t('crud.success_delete_obj', {
            obj: venue.name,
          }),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate(`/${venue.parent !== '' ? 'venue' : 'entity'}/${venue.parent !== '' ? venue.parent : venue.entity}`);
      },
      onError: (e) => {
        if (!toast.isActive('venue-fetching-error'))
          toast({
            id: 'venue-delete-error',
            title: t('common.error'),
            description: t('crud.error_delete_obj', {
              obj: venue.name,
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    });

  if (venue.children?.length > 0 || venue.venues?.length > 0) {
    return (
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverAnchor>
          <span>
            <DeleteButton onClick={onOpen} isDisabled={isDisabled} ml={2} />
          </span>
        </PopoverAnchor>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{t('crud.delete_obj', { obj: t('venues.one') })}</PopoverHeader>
          <PopoverBody>{t('venues.cant_delete_explanation')}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.close')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverAnchor>
        <span>
          <DeleteButton onClick={onOpen} isDisabled={isDisabled} ml={2} />
        </span>
      </PopoverAnchor>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{t('crud.delete_obj', { obj: t('venues.one') })}</PopoverHeader>
        <PopoverBody>{t('crud.delete_confirm', { obj: t('venues.one') })}</PopoverBody>
        <PopoverFooter>
          <Center>
            <Button colorScheme="gray" mr="1" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteVenue.isLoading}>
              {t('common.yes')}
            </Button>
          </Center>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

DeleteVenuePopover.propTypes = propTypes;
DeleteVenuePopover.defaultProps = defaultProps;
export default DeleteVenuePopover;
