import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex, Spacer, Spinner, useToast } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import RefreshButton from 'components/Buttons/RefreshButton';
import { CircleGraphProvider } from 'contexts/CircleGraphProvider';
import { getHoursAgo } from 'utils/dateFormatting';
import { useFullScreenHandle } from 'react-full-screen';
import CirclePack from './CirclePack';
import ExpandButton from './ExpandButton';
import CirclePackTimePickers from './TimePickers';

const propTypes = {
  boardId: PropTypes.string.isRequired,
};

const VenueLiveView = ({ boardId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const handle = useFullScreenHandle();
  const [startTime, setStartTime] = useState(getHoursAgo(1));
  const [endTime, setEndTime] = useState(new Date());
  const {
    data: timepoints,
    isFetching,
    refetch,
  } = useGetAnalyticsBoardTimepoints({ t, toast, id: boardId, startTime, endTime });

  return !timepoints ? (
    <Center mt={6}>
      <Spinner size="xl" />
    </Center>
  ) : (
    <LoadingOverlay isLoading={isFetching}>
      <Box>
        <Flex mb={2}>
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
          {timepoints && <CirclePack timepoints={timepoints} handle={handle} />}
        </CircleGraphProvider>
      </Box>
    </LoadingOverlay>
  );
};

VenueLiveView.propTypes = propTypes;
export default VenueLiveView;
