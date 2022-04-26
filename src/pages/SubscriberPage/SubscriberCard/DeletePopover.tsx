import React from 'react';
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
} from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { defaultSubscriber, Subscriber } from 'models/Subscriber';
import { useDeleteSubscriber } from 'hooks/Network/Subscribers';
import useMutationResult from 'hooks/useMutationResult';

interface Props {
  subscriber?: Subscriber;
  isDisabled?: boolean;
}

const defaultProps = {
  subscriber: defaultSubscriber,
  isDisabled: false,
};

const DeletePopover: React.FC<Props> = ({ subscriber, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteSub = useDeleteSubscriber({ id: subscriber?.id ?? '' });
  const { onSuccess, onError } = useMutationResult({
    objName: t('subscribers.one'),
    operationType: 'delete',
    refresh: () => {
      queryClient.invalidateQueries(['get-operator', subscriber?.owner ?? '']);
      navigate(`/operators/${subscriber?.owner ?? ''}`);
    },
  });

  const handleDeleteClick = () =>
    deleteSub.mutateAsync(undefined, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (e) => {
        onError(e);
      },
    });

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
        <PopoverHeader>{t('crud.delete_obj', { obj: t('subscribers.one') })}</PopoverHeader>
        <PopoverBody>{t('crud.delete_confirm', { obj: t('subscribers.one') })}</PopoverBody>
        <PopoverFooter>
          <Center>
            <Button colorScheme="gray" mr="1" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteSub.isLoading}>
              {t('common.yes')}
            </Button>
          </Center>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

DeletePopover.defaultProps = defaultProps;

export default DeletePopover;
