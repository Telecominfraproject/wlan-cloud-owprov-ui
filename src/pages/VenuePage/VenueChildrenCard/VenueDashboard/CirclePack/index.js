import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { useGetVenue } from 'hooks/Network/Venues';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, useToast } from '@chakra-ui/react';
import CircleComponent from './CircleComponent';
import CircleLabel from './CircleLabel';

const propTypes = {
  timepoints: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
};
const CirclePack = ({ timepoints }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { id } = useParams();
  const { data: venue } = useGetVenue({ t, toast, id });
  const [zoomedId, setZoomedId] = useState(null);
  const data = useMemo(() => {
    const root = {
      name: venue.name,
      details: {
        avgHealth: 0,
      },
      type: 'venue',
      children: [],
    };

    let totalHealth = 0;
    for (const { device_info: deviceInfo, ssid_data: ssidData } of timepoints[0]) {
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

      for (const { bssid, associations, ...ssidDetails } of ssidData) {
        const finalSsid = {
          name: `${bssid}/ssid/${uuid()}`,
          type: 'ssid',
          details: {
            bssid,
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
              rssi,
              ...associationDetails,
            },
            scale: 1,
          };

          totalRssi += rssi;
          finalSsid.children.push(finalAssociation);
        }
        finalSsid.details.avgRssi = Math.floor(totalRssi / Math.max(associations.length, 1));
        finalDevice.children.push(finalSsid);
      }

      root.children.push(finalDevice);
    }

    root.details.avgHealth = Math.floor(totalHealth / Math.max(timepoints[0].length, 1));

    return root;
  }, [timepoints]);

  return (
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
        // eslint-disable-next-line react/no-unstable-nested-components
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
  );
};

CirclePack.propTypes = propTypes;
export default React.memo(CirclePack);
