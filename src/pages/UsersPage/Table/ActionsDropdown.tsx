import React from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Wrench } from 'phosphor-react';
import { useSendUserEmailValidation, useSuspendUser } from 'hooks/Network/Users';
import useMutationResult from 'hooks/useMutationResult';

interface Props {
  id: string;
  isSuspended: boolean;
  isWaitingForCheck: boolean;
  refresh: () => void;
}

const UserActions: React.FC<Props> = ({ id, isSuspended, isWaitingForCheck, refresh }) => {
  const { t } = useTranslation();
  const { mutateAsync: sendValidation } = useSendUserEmailValidation({ id, refresh });
  const { mutateAsync: suspend } = useSuspendUser({ id });
  const { onSuccess, onError } = useMutationResult({
    objName: t('users.one'),
    operationType: 'update',
    refresh,
  });

  const handleSuspendClick = () =>
    suspend(!isSuspended, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (e) => {
        onError(e);
      },
    });

  const handleValidationClick = () => sendValidation();

  return (
    <Menu>
      <Tooltip label={t('commands.other')}>
        <MenuButton as={IconButton} aria-label="Commands" icon={<Wrench size={20} />} size="sm" ml={2} />
      </Tooltip>
      <MenuList>
        <MenuItem onClick={handleSuspendClick}>
          {isSuspended ? t('users.reactivate_user') : t('users.suspend')}
        </MenuItem>
        <MenuItem onClick={handleValidationClick}>
          {isWaitingForCheck ? t('users.send_validation') : t('users.re_validate_email')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default React.memo(UserActions);
