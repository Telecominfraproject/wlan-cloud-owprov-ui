import * as React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, BoxProps, Center, Flex, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LiveViewLayout from './LiveViewLayout';
import { useLiveView } from './useLiveView';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  boardId: string;
  venue: VenueApiResponse;
  containerStyle?: BoxProps;
};

const LiveView = ({ boardId, venue, containerStyle }: Props) => {
  const { t } = useTranslation();
  const liveView = useLiveView({ boardId });

  const contents = React.useMemo(() => {
    if (liveView.getTimepoints.error) {
      return (
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Center>
            <Alert status="error" w="unset" borderRadius="15px">
              <AlertIcon />
              <Box>
                <AlertTitle>{t('common.error')}</AlertTitle>
                <AlertDescription>
                  {liveView.getTimepoints.error.response?.status === 404
                    ? t('analytics.missing_board')
                    : liveView.getTimepoints.error.response?.data?.ErrorDescription}
                </AlertDescription>
              </Box>
            </Alert>
          </Center>
        </Flex>
      );
    }

    if (liveView.getTimepoints.isLoading || !liveView.getTimepoints.data) {
      return (
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Center>
            <Spinner size="xl" />
          </Center>
        </Flex>
      );
    }

    return (
      <LiveViewLayout
        data={liveView.getTimepoints.data}
        isFetching={liveView.getTimepoints.isFetching}
        venue={venue}
        onChangeTime={liveView.onChangeTime}
        onClearTime={liveView.onClearTime}
        refreshData={liveView.getTimepoints.refetch}
      />
    );
  }, [liveView.getTimepoints]);

  return <Box {...containerStyle}>{contents}</Box>;
};

export default React.memo(LiveView);
