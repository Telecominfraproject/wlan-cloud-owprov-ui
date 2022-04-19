import React from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useSuspendSubscriber } from 'hooks/Network/Subscribers';
import useMutationResult from 'hooks/useMutationResult';
import { Subscriber } from 'models/Subscriber';

interface Props {
  subscriber?: Subscriber;
  refresh: () => void;
  isDisabled?: boolean;
}

const SubscriberActions: React.FC<Props> = ({ subscriber, refresh, isDisabled }) => {
  const { t } = useTranslation();
  const { mutateAsync: suspend } = useSuspendSubscriber({ id: subscriber?.id ?? '' });
  const { onSuccess, onError } = useMutationResult({
    objName: t('subscribers.one'),
    operationType: 'update',
    refresh,
  });

  const handleSuspendClick = () =>
    suspend(!subscriber?.suspended, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (e) => {
        onError(e);
      },
    });

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} ml={2} isDisabled={isDisabled}>
        {t('common.actions')}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleSuspendClick}>
          {subscriber?.suspended ? t('users.stop_suspension') : t('users.suspend')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

SubscriberActions.defaultProps = {
  subscriber: undefined,
  isDisabled: false,
};
export default React.memo(SubscriberActions);
