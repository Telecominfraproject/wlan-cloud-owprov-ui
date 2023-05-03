import React, { useMemo, useState } from 'react';
import { Box, Center, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip } from '@chakra-ui/react';
import { Clock } from '@phosphor-icons/react';
import { AnalyticsTimePointApiResponse } from 'models/Analytics';
import { compactDate } from 'utils/dateFormatting';

type Props = {
  index: number;
  setIndex: (index: number) => void;
  points: AnalyticsTimePointApiResponse[][];
};
const CirclePackSlider = ({ index, setIndex, points }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onMouseEnter = () => setShowTooltip(true);
  const onMouseLeave = () => setShowTooltip(false);

  const stepsDetails = useMemo(
    () => ({
      steps: points.length,
      allTimestamps: points.map((point) => (!point[0] ? '-' : compactDate(point[0].timestamp))),
    }),
    [points],
  );

  const currTimestamp = points[index]?.[0]?.timestamp;

  return (
    <>
      <Slider
        id="slider"
        value={index}
        min={0}
        max={stepsDetails.steps - 1}
        colorScheme="teal"
        onChange={setIndex}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SliderTrack h="6px" borderRadius="4px">
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip hasArrow placement="top" isOpen={showTooltip} label={stepsDetails.allTimestamps[index]}>
          <SliderThumb boxSize={6}>
            <Box textColor="black" as={Clock} />
          </SliderThumb>
        </Tooltip>
      </Slider>
      <Center>
        <Heading size="lg">{currTimestamp ? compactDate(currTimestamp) : ''}</Heading>
      </Center>
    </>
  );
};

export default React.memo(CirclePackSlider);
