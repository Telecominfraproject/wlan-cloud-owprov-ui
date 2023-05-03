import React from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { Wrench } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useSendEmailResetSubscriber, useSuspendSubscriber } from 'hooks/Network/Subscribers';
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
  const { mutateAsync: resetPassword } = useSendEmailResetSubscriber({ id: subscriber?.id ?? '' });
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
  const handleResetPasswordClick = () => resetPassword(undefined);

  return (
    <Menu>
      <Tooltip label={t('common.actions')} aria-label={t('common.actions')} hasArrow>
        <MenuButton as={IconButton} icon={<Wrench size={20} />} ml={2} isDisabled={isDisabled} />
      </Tooltip>
      <MenuList>
        <MenuItem onClick={handleSuspendClick}>
          {subscriber?.suspended ? t('users.stop_suspension') : t('users.suspend')}
        </MenuItem>
        <MenuItem onClick={handleResetPasswordClick}>{t('users.reset_password')}</MenuItem>
      </MenuList>
    </Menu>
  );
};

SubscriberActions.defaultProps = {
  subscriber: undefined,
  isDisabled: false,
};
export default React.memo(SubscriberActions);
