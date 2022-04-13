import React from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useSuspendSubscriber } from 'hooks/Network/Subscribers';
import useMutationResult from 'hooks/useMutationResult';

const SubscriberActions = ({ subscriber, refresh }) => {
  const { t } = useTranslation();
  const suspend = useSuspendSubscriber({ id: subscriber?.id });
  const { onSuccess, onError } = useMutationResult({
    objName: t('subscribers.one'),
    operationType: 'update',
    refresh,
  });

  const handleSuspendClick = () => {
    suspend.mutateAsync(!subscriber?.suspended, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (e) => {
        onError(e);
      },
    });
  };
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} ml={2}>
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
SubscriberActions.propTypes = {
  subscriber: PropTypes.instanceOf(Object),
  refresh: PropTypes.func.isRequired,
};
SubscriberActions.defaultProps = {
  subscriber: null,
};
export default React.memo(SubscriberActions);
