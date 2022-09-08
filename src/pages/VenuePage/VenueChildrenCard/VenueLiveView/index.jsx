import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { Box, Center, Flex, Spacer, Spinner, useColorModeValue } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import RefreshButton from 'components/Buttons/RefreshButton';
import { CircleGraphProvider } from 'contexts/CircleGraphProvider';
import { getHoursAgo } from 'utils/dateFormatting';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import CirclePack from './CirclePack';
import ExpandButton from './ExpandButton';
import CirclePackTimePickers from './TimePickers';

const propTypes = {
  boardId: PropTypes.string.isRequired,
  venue: PropTypes.instanceOf(Object).isRequired,
};

const VenueLiveView = ({ boardId, venue }) => {
  const handle = useFullScreenHandle();
  const color = useColorModeValue('gray.50', 'gray.800');
  const [startTime, setStartTime] = useState(getHoursAgo(1));
  const [endTime, setEndTime] = useState(new Date());
  const { data: timepoints, isFetching, refetch } = useGetAnalyticsBoardTimepoints({ id: boardId, startTime, endTime });

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
