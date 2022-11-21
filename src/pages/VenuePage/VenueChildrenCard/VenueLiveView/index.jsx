import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  Spacer,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import CirclePack from './CirclePack';
import ExpandButton from './ExpandButton';
import CirclePackTimePickers from './TimePickers';
import RefreshButton from 'components/Buttons/RefreshButton';
import LoadingOverlay from 'components/LoadingOverlay';
import { CircleGraphProvider } from 'contexts/CircleGraphProvider';
import { useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { getHoursAgo } from 'utils/dateFormatting';

const propTypes = {
  boardId: PropTypes.string.isRequired,
  venue: PropTypes.instanceOf(Object).isRequired,
};

const VenueLiveView = ({ boardId, venue }) => {
  const { t } = useTranslation();
  const handle = useFullScreenHandle();
  const color = useColorModeValue('gray.50', 'gray.800');
  const [startTime, setStartTime] = useState(getHoursAgo(1));
  const [endTime, setEndTime] = useState(new Date());
  const {
    data: timepoints,
    isFetching,
    refetch,
    error,
  } = useGetAnalyticsBoardTimepoints({ id: boardId, startTime, endTime });

  if (error)
    return (
      <Center mt={6}>
        <Alert status="error" w="unset" borderRadius="15px">
          <AlertIcon />
          <Box>
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>
              {error.response?.status === 404 ? t('analytics.missing_board') : error.response?.data?.ErrorDescription}
            </AlertDescription>
          </Box>
        </Alert>
      </Center>
    );

  return !timepoints ? (
    <Center mt={6}>
      <Spinner size="xl" />
    </Center>
  ) : (
    <LoadingOverlay isLoading={isFetching}>
      <Box bgColor={handle?.active ? color : null} h="100%" p={0}>
        <FullScreen handle={handle}>
          <Box bgColor={handle?.active ? color : null} h="100%" p={0}>
            <Flex mb={2} mt={handle?.active ? 4 : null} mr={handle?.active ? 4 : null}>
              <Spacer />
              <ExpandButton data={timepoints} isDisabled={isFetching || !timepoints} handle={handle} />
              <CirclePackTimePickers
                start={startTime}
                end={endTime}
                setStart={setStartTime}
                setEnd={setEndTime}
                isDisabled={isFetching || !timepoints}
              />
              <RefreshButton onClick={refetch} isLoading={isFetching} ml={2} />
            </Flex>
            <CircleGraphProvider>
              {timepoints && <CirclePack timepoints={timepoints} handle={handle} venue={venue} />}
            </CircleGraphProvider>
          </Box>
        </FullScreen>
      </Box>
    </LoadingOverlay>
  );
};

VenueLiveView.propTypes = propTypes;
export default VenueLiveView;
