import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { useGetVenue } from 'hooks/Network/Venues';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, useToast } from '@chakra-ui/react';
import { parseDbm } from 'utils/stringHelper';
import CircleComponent from './CircleComponent';
import CircleLabel from './CircleLabel';
import CirclePackSlider from './Slider';

const propTypes = {
  timepoints: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
};
const CirclePack = ({ timepoints }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { id } = useParams();
  const { data: venue } = useGetVenue({ t, toast, id });
  const [pointIndex, setPointIndex] = useState(timepoints.length - 1);
  const [zoomedId, setZoomedId] = useState(null);
  const data = useMemo(() => {
    if (timepoints.length === 0) return null;

    const root = {
      name: venue.name,
      details: {
        avgHealth: 0,
      },
      type: 'venue',
      children: [],
    };

    let totalHealth = 0;
    for (const { device_info: deviceInfo, ssid_data: ssidData } of timepoints[pointIndex]) {
      // Global data needed for venue info
      totalHealth += deviceInfo.health;

      const finalDevice = {
        name: `${deviceInfo.serialNumber}/device/${uuid()}`,
        type: 'device',
        details: {
          deviceInfo,
          ssidData,
        },
        children: [],
      };

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
          scale: associations.length === 0 ? 1 : associations.length * 4,
        };

        let totalRssi = 0;
        for (const { station, rssi, ...associationDetails } of associations) {
          const finalAssociation = {
            name: `${station}/assoc/${uuid()}`,
            type: 'association',
            details: {
              station,
              rssi: parseDbm(rssi),
              ...associationDetails,
            },
            scale: 1,
          };

          totalRssi += rssi;
          finalSsid.children.push(finalAssociation);
        }
        finalSsid.details.avgRssi = parseDbm(Math.floor(totalRssi / Math.max(associations.length, 1)));
        finalDevice.children.push(finalSsid);
      }

      root.children.push(finalDevice);
    }

    root.details.avgHealth = Math.floor(totalHealth / Math.max(timepoints[0].length, 1));

    return root;
  }, [timepoints, pointIndex]);

  if (!data) return null;

  return (
    <>
      <CirclePackSlider index={pointIndex} setIndex={setPointIndex} points={timepoints} />
      <Box w="100%" h="600px">
        <ResponsiveCirclePacking
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          padding="36"
          id="name"
          value="scale"
          data={data}
          enableLabels
          labelsSkipRadius={32}
          labelsFilter={(label) => label.node.height === 0}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
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
      </Box>
    </>
  );
};

CirclePack.propTypes = propTypes;
export default React.memo(CirclePack);
