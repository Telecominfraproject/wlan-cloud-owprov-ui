import * as React from 'react';
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { GoogleOrionAccount, useDeleteGoogleOrionAccount } from 'hooks/Network/GoogleOrion';
import { useNotification } from 'hooks/useNotification';

type Props = {
  account: GoogleOrionAccount;
  openDetailsModal: (account: GoogleOrionAccount) => void;
};

const GoogleOrionAccountActionCell = ({ account, openDetailsModal }: Props) => {
  const { t } = useTranslation();
  const deleteAccount = useDeleteGoogleOrionAccount();
  const { successToast, apiErrorToast } = useNotification();

  const onDelete = (onClose: () => void) => async () => {
    await deleteAccount.mutateAsync(account.id, {
      onSuccess: () => {
        successToast({
          description: t('roaming.account_deleted'),
        });
        onClose();
      },
      onError: (error) => {
        apiErrorToast({ e: error });
      },
    });
  };

  return (
    <HStack spacing={2}>
      <Popover placement="start">
        {({ onClose, isOpen }) => (
          <>
            <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
              <Box>
                <PopoverTrigger>
                  <IconButton aria-label={t('crud.delete')} colorScheme="red" icon={<Trash size={20} />} size="sm" />
                </PopoverTrigger>
              </Box>
            </Tooltip>
            <PopoverContent w="334px">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                {t('crud.delete')} {account.name}
              </PopoverHeader>
              <PopoverBody>{t('crud.delete_confirm', { obj: t('roaming.account_one') })}</PopoverBody>
              <PopoverFooter>
                <Center>
                  <Button colorScheme="gray" mr="1" onClick={onClose}>
                    {t('common.cancel')}
                  </Button>
                  <Button colorScheme="red" ml="1" onClick={onDelete(onClose)} isLoading={deleteAccount.isLoading}>
                    {t('common.yes')}
                  </Button>
                </Center>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
      <Tooltip label={t('common.view_details')}>
        <IconButton
          aria-label={t('common.view_details')}
          onClick={() => openDetailsModal(account)}
          size="sm"
          icon={<MagnifyingGlass size={20} />}
          colorScheme="blue"
        />
      </Tooltip>
    </HStack>
  );
};

export default GoogleOrionAccountActionCell;
