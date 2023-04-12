import * as React from 'react';
import { Box, Center, Heading, useColorMode } from '@chakra-ui/react';
import { MouseHandler, ResponsiveCirclePacking } from '@nivo/circle-packing';
import { FullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import CircleComponent from './CircleComponent';
import CircleLabel from './CircleLabel';
import CirclePackSlider from './Slider';
import { useCirclePackTheme } from './useCirclePackTheme';
import { CirclePackRoot, parseAnalyticsTimepointsToCirclePackData } from './utils';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { AnalyticsTimePointApiResponse } from 'models/Analytics';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  data: AnalyticsTimePointApiResponse[][];
  venue: VenueApiResponse;
  handle: FullScreenHandle;
};

const LiveViewCirclePack = ({ data, venue, handle }: Props) => {
  const { t } = useTranslation();
  const context = useCircleGraph();
  const { colorMode } = useColorMode();
  const theme = useCirclePackTheme();
  const [pointIndex, setPointIndex] = React.useState(Math.max(data.length - 1, 0));
  const [zoomedId, setZoomedId] = React.useState<string | null>(null);

  const parsedData = React.useMemo(() => {
    const dataIndex = data[pointIndex] || [];

    if (dataIndex) {
      try {
        return parseAnalyticsTimepointsToCirclePackData(dataIndex, venue, colorMode);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  }, [data, pointIndex, colorMode]);

  const handleNodeClick: MouseHandler<CirclePackRoot> = React.useCallback(
    (node) => {
      setZoomedId(zoomedId === node.id ? null : node.id);
    },
    [zoomedId],
  );

  React.useEffect(() => {
    setPointIndex(data.length - 1);
  }, [data]);

  return (
    <Box px={10} h="100%">
      {data.length > 0 && <CirclePackSlider index={pointIndex} setIndex={setPointIndex} points={data} />}
      <Box w="100%" h={handle?.active ? 'calc(100vh - 200px)' : '600px'} ref={context?.popoverRef}>
        {!parsedData ? (
          <Center>
            <Heading size="lg">{t('common.no_records_found')}</Heading>
          </Center>
        ) : (
          <ResponsiveCirclePacking
            margin={theme.MARGINS}
            padding={36}
            defs={theme.shapeDefs}
            animate={false}
            fill={theme.getFill}
            id="name"
            value="scale"
            data={parsedData}
            enableLabels
            labelsSkipRadius={42}
            labelsFilter={theme.getLabelsFilter}
            labelTextColor={theme.LABEL_TEXT_COLORS}
            labelComponent={CircleLabel}
            // onMouseEnter={null}
            // tooltip={null}
            circleComponent={CircleComponent}
            zoomedId={zoomedId}
            theme={theme.THEME}
            onClick={handleNodeClick}
          />
        )}
      </Box>
    </Box>
  );
};

export default LiveViewCirclePack;
