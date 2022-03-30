import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compactDate } from 'utils/dateFormatting';
import { Box, Center, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip } from '@chakra-ui/react';
import { Clock } from 'phosphor-react';

const propTypes = {
  index: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
  points: PropTypes.instanceOf(Object).isRequired,
};

const CirclePackSlider = ({ index, setIndex, points }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onMouseEnter = () => setShowTooltip(true);
  const onMouseLeave = () => setShowTooltip(false);

  const stepsDetails = useMemo(
    () => ({
      steps: points.length,
      allTimestamps: points.map((point) => (point.length === 0 ? '-' : compactDate(point[0].timestamp))),
    }),
    [points],
  );

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
        <Heading size="lg">{points[index] ? compactDate(points[index][0].timestamp) : ''}</Heading>
      </Center>
    </>
  );
};

CirclePackSlider.propTypes = propTypes;
export default React.memo(CirclePackSlider);
