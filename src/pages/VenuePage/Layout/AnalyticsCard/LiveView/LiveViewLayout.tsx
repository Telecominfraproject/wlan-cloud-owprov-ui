import * as React from 'react';
import { Box, Flex, HStack, Spacer, useColorModeValue } from '@chakra-ui/react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import AnalyticsDatePickers from '../DatePickers';
import LiveViewCirclePack from './CirclePack';
import FullScreenLiveViewButton from './FullScreenLiveViewButton';
import CirclePackInfoButton from './InfoButton';
import { UseLiveViewReturn } from './useLiveView';
import RefreshButton from 'components/Buttons/RefreshButton';
import LoadingOverlay from 'components/LoadingOverlay';
import { CircleGraphProvider } from 'contexts/CircleGraphProvider';
import { AnalyticsTimePointApiResponse } from 'models/Analytics';
import { VenueApiResponse } from 'models/Venue';
import { getHoursAgo } from 'utils/dateFormatting';

type Props = {
  data: AnalyticsTimePointApiResponse[][];
  venue: VenueApiResponse;
  isFetching?: boolean;
  onChangeTime: UseLiveViewReturn['onChangeTime'];
  onClearTime: UseLiveViewReturn['onClearTime'];
  refreshData: () => void;
};

const LiveViewLayout = ({ data, venue, isFetching, onChangeTime, onClearTime, refreshData }: Props) => {
  const color = useColorModeValue('gray.50', 'gray.800');
  const handle = useFullScreenHandle();

  return (
    <LoadingOverlay isLoading={!!isFetching}>
      <Box bgColor={handle?.active ? color : undefined} h="100%" p={0}>
        <FullScreen handle={handle}>
          <Box bgColor={handle?.active ? color : undefined} h="100%" p={0}>
            <Flex mb={2} pt={2} px={2} mt={handle?.active ? 4 : undefined} mr={handle?.active ? 4 : undefined}>
              <Spacer />
              <HStack>
                <CirclePackInfoButton />
                <AnalyticsDatePickers
                  defaults={{
                    start: getHoursAgo(5),
                    end: new Date(),
                  }}
                  setTime={(start: Date, end: Date) => onChangeTime({ start, end })}
                  onClear={onClearTime}
                />
                <FullScreenLiveViewButton isDisabled={isFetching || !data} handle={handle} />
                <RefreshButton onClick={refreshData} isFetching={isFetching} isCompact />
              </HStack>
            </Flex>
            <CircleGraphProvider>
              <LiveViewCirclePack data={data} handle={handle} venue={venue} />
            </CircleGraphProvider>
          </Box>
        </FullScreen>
      </Box>
    </LoadingOverlay>
  );
};

export default React.memo(LiveViewLayout);
