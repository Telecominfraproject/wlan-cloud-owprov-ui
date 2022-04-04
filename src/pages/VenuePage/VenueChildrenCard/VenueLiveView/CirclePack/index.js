import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { useGetVenue } from 'hooks/Network/Venues';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Center, Heading, useColorMode, useToast } from '@chakra-ui/react';
import { parseDbm } from 'utils/stringHelper';
import { errorColor, getBlendedColor, successColor, warningColor } from 'utils/colors';
import { getScaledArray } from 'utils/arrayHelpers';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { patternLinesDef } from '@nivo/core';
import CircleComponent from './CircleComponent';
import CircleLabel from './CircleLabel';
import CirclePackSlider from './Slider';
import CirclePackInfoButton from './InfoButton';

const propTypes = {
  timepoints: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  handle: PropTypes.shape({
    enter: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
};

const CirclePack = ({ timepoints, handle }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { popoverRef } = useCircleGraph();
  const { colorMode } = useColorMode();
  const { id } = useParams();
  const { data: venue } = useGetVenue({ t, toast, id });
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

    for (const { device_info: deviceInfo, ssid_data: ssidData = [], radio_data: radioData = [] } of timepoints[
      pointIndex
    ]) {
      totalHealth += deviceInfo.health;

      const finalDevice = {
        name: `${deviceInfo.serialNumber}/device/${uuid()}`,
        type: 'device',
        details: {
          deviceInfo,
          ssidData,
        },
        scale: 1,
        children: [],
      };

      if (deviceInfo.health >= 90) finalDevice.details.color = successColor(colorMode);
      else if (deviceInfo.health >= 70) finalDevice.details.color = warningColor(colorMode);
      else finalDevice.details.color = errorColor(colorMode);

      const radioChannelIndex = {};

      for (const [i, { band, transmit_pct: transmitPct, ...radioDetails }] of radioData.entries()) {
        const finalRadio = {
          name: `${band}/radio/${uuid()}`,
          type: 'radio',
          details: {
            band,
            transmitPct,
            ...radioDetails,
            color: getBlendedColor('#0ba057', '#FD3049', transmitPct / 100),
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

          if (rssi >= -45) finalAssociation.details.color = successColor(colorMode);
          else if (rssi >= -60) finalAssociation.details.color = warningColor(colorMode);
          else finalAssociation.details.color = errorColor(colorMode);

          totalRssi += rssi;
          finalSsid.children.push(finalAssociation);
        }
        finalSsid.details.avgRssi = parseDbm(Math.floor(totalRssi / Math.max(associations.length, 1)));
        if (finalSsid.details.avgRssi >= -45) finalSsid.details.color = successColor(colorMode);
        else if (finalSsid.details.avgRssi >= -60) finalSsid.details.color = warningColor(colorMode);
        else finalSsid.details.color = errorColor(colorMode);
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
    if (root.details.avgHealth >= 90) root.details.color = successColor(colorMode);
    else if (root.details.avgHealth >= 70) root.details.color = warningColor(colorMode);
    else root.details.color = errorColor(colorMode);
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
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              padding="36"
              defs={shapeDefs}
              fill={[
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
              ]}
              id="name"
              value="scale"
              data={data}
              enableLabels
              labelsSkipRadius={42}
              labelsFilter={(label) => label.node.height === 0}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 4]],
              }}
              labelComponent={CircleLabel}
              onMouseEnter={null}
              tooltip={null}
              circleComponent={CircleComponent}
              zoomedId={zoomedId}
              motionConfig="slow"
              theme={{
                labels: {
                  text: {
                    background: 'black',
                  },
                  background: 'black',
                },
              }}
              onClick={(node) => {
                setZoomedId(zoomedId === node.id ? null : node.id);
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

CirclePack.propTypes = propTypes;
export default React.memo(CirclePack);
