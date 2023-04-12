import * as React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Stop } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useDeleteAnalyticsBoard } from 'hooks/Network/Analytics';
import { useUpdateVenue } from 'hooks/Network/Venues';
import { AxiosError } from 'models/Axios';

type Props = {
  boardId: string;
  venueId: string;
};

const StopMonitoringButton = ({ boardId, venueId }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const stopMonitoring = useDeleteAnalyticsBoard();
  const updateVenue = useUpdateVenue({ id: venueId });
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleStop = () => {
    updateVenue.mutate(
      { params: { boards: [] } },
      {
        onSuccess: () => {
          stopMonitoring.mutate(boardId, {
            onSuccess: () => {
              toast({
                title: t('common.success'),
                description: t('analytics.stop_monitoring_success'),
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
              onClose();
            },
            onError: (e) => {
              toast({
                title: t('common.error'),
                description: (e as AxiosError)?.response?.data?.ErrorDescription,
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            },
          });
        },
        onError: (e) => {
          toast({
            title: t('common.error'),
            description: (e as AxiosError)?.response?.data?.ErrorDescription,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        },
      },
    );
  };
  return (
    <>
      <Tooltip label={t('analytics.stop_monitoring')}>
        <IconButton
          aria-label={t('analytics.stop_monitoring')}
          icon={<Stop size={20} />}
          colorScheme="red"
          borderRadius={0}
          onClick={onOpen}
          h="41px"
        />
      </Tooltip>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('analytics.stop_monitoring')}
            </AlertDialogHeader>

            <AlertDialogBody>{t('analytics.stop_monitoring_warning')}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleStop}
                ml={2}
                isLoading={stopMonitoring.isLoading || updateVenue.isLoading}
              >
                {t('analytics.stop_monitoring')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default StopMonitoringButton;
