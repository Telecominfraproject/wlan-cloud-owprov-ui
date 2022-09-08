import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { useTranslation } from 'react-i18next';
import { Box, Center, Heading, useColorMode } from '@chakra-ui/react';
import { parseDbm } from 'utils/stringHelper';
import { errorColor, getBlendedColor, successColor, warningColor } from 'utils/colors';
import { getScaledArray } from 'utils/arrayHelpers';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { patternLinesDef } from '@nivo/core';
import CircleComponent from './CircleComponent';
import CircleLabel from './CircleLabel';
import CirclePackSlider from './Slider';
import CirclePackInfoButton from './InfoButton';

const theme = {
  labels: {
    text: {
      background: 'black',
    },
    background: 'black',
  },
};
const getFill = [
  {
    match: (d) => d.data.type === 'association' && d.data.details.rssi >= -45,
    id: 'assoc_success',
  },
  {
    match: (d) => d.data.type === 'association' && d.data.details.rssi >= -60,
    id: 'assoc_warning',
  },
  {
    match: (d) => d.data.type === 'association' && d.data.details.rssi < -60,
    id: 'assoc_danger',
  },
];

const getLabelsFilter = (label) => label.node.height === 0;

const labelTextColor = {
  from: 'color',
  modifiers: [['darker', 4]],
};

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const propTypes = {
  timepoints: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  handle: PropTypes.shape({
    enter: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
  venue: PropTypes.instanceOf(Object).isRequired,
};

const CirclePack = ({ timepoints, handle, venue }) => {
  const { t } = useTranslation();
  const { popoverRef } = useCircleGraph();
  const { colorMode } = useColorMode();
  const [pointIndex, setPointIndex] = useState(Math.max(timepoints.length - 1, 0));
  const [zoomedId, setZoomedId] = useState(null);

  const data = useMemo(() => {
    if (!timepoints || timepoints.length === 0 || !timepoints[pointIndex]) return null;

    const root = {
      name: venue.name,
      details: {
        avgHealth: 0,
      },
      type: 'venue',
      children: [],
      scale: 1,
    };

    let totalHealth = 0;
    const allBandwidth = [];

    for (const {
      device_info: deviceInfo,
      ssid_data: ssidData = [],
      radio_data: radioData = [],
      ap_data: apData,
    } of timepoints[pointIndex]) {
      totalHealth += deviceInfo.health;

      const finalDevice = {
        name: `${deviceInfo.serialNumber}/device/${uuid()}`,
        type: 'device',
        details: {
          deviceInfo,
          ssidData,
          apData,
        },
        scale: 1,
        children: [],
      };

      if (deviceInfo.health >= 90) {
        finalDevice.details.color = successColor(colorMode);
        finalDevice.details.tagColor = 'green';
      } else if (deviceInfo.health >= 70) {
        finalDevice.details.color = warningColor(colorMode);
        finalDevice.details.tagColor = 'yellow';
      } else {
        finalDevice.details.color = errorColor(colorMode);
        finalDevice.details.tagColor = 'red';
      }

      const radioChannelIndex = {};

      for (const [i, { band, transmit_pct: transmitPct, ...radioDetails }] of radioData.entries()) {
        let tagColor = 'green';
        if (transmitPct > 30) tagColor = 'yellow';
        else if (transmitPct > 50) tagColor = 'red';
        const finalRadio = {
          name: `${band}/radio/${uuid()}`,
          type: 'radio',
          details: {
            band,
            transmitPct,
            ...radioDetails,
            color: getBlendedColor('#0ba057', '#FD3049', transmitPct / 100),
            tagColor,
          },
          children: [],
        };
        radioChannelIndex[band] = i;
        finalDevice.children.push(finalRadio);
      }

      for (const { ssid, associations, ...ssidDetails } of ssidData) {
        const finalSsid = {
          name: `${ssid}/ssid/${uuid()}`,
          type: 'ssid',
          details: {
            ssid,
            associations,
            ...ssidDetails,
          },
          children: [],
          scale: 1,
        };

        let totalRssi = 0;
        for (const { station, rssi, ...associationDetails } of associations) {
          const bw = associationDetails.tx_bytes_bw + associationDetails.rx_bytes_bw;
          allBandwidth.push(bw);

          const finalAssociation = {
            name: `${station}/assoc/${uuid()}`,
            type: 'association',
            details: {
              station,
              rssi: parseDbm(rssi),
              ...associationDetails,
            },
            totalBw: bw,
            scale: 1,
          };

          if (rssi >= -45) {
            finalAssociation.details.color = successColor(colorMode);
            finalAssociation.details.tagColor = 'green';
          } else if (rssi >= -60) {
            finalAssociation.details.color = warningColor(colorMode);
            finalAssociation.details.tagColor = 'yellow';
          } else {
            finalAssociation.details.color = errorColor(colorMode);
            finalAssociation.details.tagColor = 'red';
          }

          totalRssi += rssi;
          finalSsid.children.push(finalAssociation);
        }
        finalSsid.details.avgRssi =
          associations.length === 0 ? undefined : parseDbm(Math.floor(totalRssi / Math.max(associations.length, 1)));
        if (associations.length === 0 || finalSsid.details.avgRssi >= -45) {
          finalSsid.details.color = successColor(colorMode);
          finalSsid.details.tagColor = 'green';
        } else if (finalSsid.details.avgRssi >= -60) {
          finalSsid.details.color = warningColor(colorMode);
          finalSsid.details.tagColor = 'yellow';
        } else {
          finalSsid.details.color = errorColor(colorMode);
          finalSsid.details.tagColor = 'red';
        }
        finalDevice.children[radioChannelIndex[ssidDetails.band]].children.push(finalSsid);
      }
      root.children.push(finalDevice);
    }

    if (allBandwidth.length > 0) {
      const scaledArray = getScaledArray(allBandwidth, 1, 30);
      const bandwidthObj = {};
      for (const [i, bw] of allBandwidth.entries()) {
        bandwidthObj[bw] = scaledArray[i];
      }

      for (const [deviceIndex, device] of root.children.entries()) {
        for (const [radioIndex, radio] of device.children.entries()) {
          for (const [ssidIndex, ssid] of radio.children.entries()) {
            for (const [assocIndex, assoc] of ssid.children.entries()) {
              root.children[deviceIndex].children[radioIndex].children[ssidIndex].children[assocIndex].scale =
                bandwidthObj[assoc.totalBw];
            }
          }
        }
      }
    }

    root.details.avgHealth = Math.floor(totalHealth / Math.max(timepoints[pointIndex].length, 1));
    if (root.details.avgHealth >= 90) {
      root.details.color = successColor(colorMode);
      root.details.tagColor = 'green';
    } else if (root.details.avgHealth >= 70) {
      root.details.color = warningColor(colorMode);
      root.details.tagColor = 'yellow';
    } else {
      root.details.color = errorColor(colorMode);
      root.details.tagColor = 'red';
    }
    root.color = '#31e88a';

    return root;
  }, [timepoints, pointIndex, colorMode]);

  const shapeDefs = useMemo(
    () => [
      patternLinesDef(
        'assoc_success',
        colorMode === 'light'
          ? {
              rotation: -45,
              color: 'var(--chakra-colors-success-400)',
              background: 'var(--chakra-colors-success-600)',
            }
          : {
              rotation: -45,
              color: 'var(--chakra-colors-success-400)',
              background: 'var(--chakra-colors-success-600)',
            },
      ),
      patternLinesDef(
        'assoc_warning',
        colorMode === 'light'
          ? {
              rotation: -45,
              color: 'var(--chakra-colors-warning-100)',
              background: 'var(--chakra-colors-warning-400)',
            }
          : {
              rotation: -45,
              color: 'var(--chakra-colors-warning-100)',
              background: 'var(--chakra-colors-warning-400)',
            },
      ),
      patternLinesDef(
        'assoc_danger',
        colorMode === 'light'
          ? {
              rotation: -45,
              color: 'var(--chakra-colors-danger-200)',
              background: 'var(--chakra-colors-danger-400)',
            }
          : {
              rotation: -45,
              color: 'var(--chakra-colors-danger-200)',
              background: 'var(--chakra-colors-danger-400)',
            },
      ),
    ],
    [colorMode],
  );

  const handleNodeClick = React.useCallback(
    (node) => {
      setZoomedId(zoomedId === node.id ? null : node.id);
    },
    [zoomedId],
  );

  useEffect(() => {
    setPointIndex(timepoints.length - 1);
  }, [timepoints]);

  return (
    <Box px={10} h="100%">
      {timepoints.length > 0 && <CirclePackSlider index={pointIndex} setIndex={setPointIndex} points={timepoints} />}
      <Box w="100%" h={handle?.active ? 'calc(100vh - 200px)' : '600px'} ref={popoverRef}>
        {data === null ? (
          <Center>
            <Heading size="lg">{t('common.no_records_found')}</Heading>
          </Center>
        ) : (
          <>
            <CirclePackInfoButton />
            <ResponsiveCirclePacking
              margin={margin}
              padding="36"
              defs={shapeDefs}
              animate={false}
              fill={getFill}
              id="name"
              value="scale"
              data={data}
              enableLabels
              labelsSkipRadius={42}
              labelsFilter={getLabelsFilter}
              labelTextColor={labelTextColor}
              labelComponent={CircleLabel}
              onMouseEnter={null}
              tooltip={null}
              circleComponent={CircleComponent}
              zoomedId={zoomedId}
              theme={theme}
              onClick={handleNodeClick}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

CirclePack.propTypes = propTypes;
export default React.memo(CirclePack);
