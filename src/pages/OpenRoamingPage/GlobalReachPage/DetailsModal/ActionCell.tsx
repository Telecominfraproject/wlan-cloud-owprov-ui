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
import { Recycle, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import {
  GlobalReachCertificate,
  useDeleteGlobalReachCertificate,
  useRenewGlobalReachCertificate,
} from 'hooks/Network/GlobalReach';
import { useNotification } from 'hooks/useNotification';

type Props = {
  certificate: GlobalReachCertificate;
};

const GlobalReachCertActionCell = ({ certificate }: Props) => {
  const { t } = useTranslation();
  const renewCertificate = useRenewGlobalReachCertificate();
  const deleteCertificate = useDeleteGlobalReachCertificate();
  const { successToast, apiErrorToast } = useNotification();

  const onDelete = (onClose: () => void) => async () => {
    await deleteCertificate.mutateAsync(
      { id: certificate.id, accountId: certificate.accountId },
      {
        onSuccess: () => {
          successToast({
            description: t('roaming.certificate_deleted'),
          });
          onClose();
        },
        onError: (error) => {
          apiErrorToast({ e: error });
        },
      },
    );
  };

  const onRenew = async () => {
    await renewCertificate.mutateAsync(
      { id: certificate.id, accountId: certificate.accountId },
      {
        onSuccess: () => {
          successToast({
            description: 'Recreated certificate!',
          });
        },
        onError: (error) => {
          apiErrorToast({ e: error });
        },
      },
    );
  };

  return (
    <HStack>
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
                {t('crud.delete')} {certificate.name}
              </PopoverHeader>
              <PopoverBody>{t('crud.delete_confirm', { obj: t('roaming.certificate_one') })}</PopoverBody>
              <PopoverFooter>
                <Center>
                  <Button colorScheme="gray" mr="1" onClick={onClose}>
                    {t('common.cancel')}
                  </Button>
                  <Button colorScheme="red" ml="1" onClick={onDelete(onClose)} isLoading={deleteCertificate.isLoading}>
                    {t('common.yes')}
                  </Button>
                </Center>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
      <Tooltip hasArrow label="Recreate" placement="top">
        <IconButton
          aria-label="Recreate"
          colorScheme="blue"
          icon={<Recycle size={20} />}
          size="sm"
          isLoading={renewCertificate.isLoading}
          onClick={onRenew}
        />
      </Tooltip>
    </HStack>
  );
};

export default GlobalReachCertActionCell;
