import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { Heading, Text, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  handleModalClick: PropTypes.func.isRequired,
};

const DeviceTypeStat = ({ data, handleModalClick }) => {
  const { t } = useTranslation();

  const getTopDeviceTypes = () => {
    const orderedTotals = Object.keys(data.deviceTypeTotals)
      .map((k) => ({
        deviceType: k,
        amount: data.deviceTypeTotals[k],
      }))
      .sort((a, b) => (a.amount < b.amount ? 1 : -1));

    if (orderedTotals.length <= 3) {
      return orderedTotals.map((v) => `${v.amount} ${v.deviceType}`).join(', ');
    }

    let othersTotal = 0;
    for (let i = 3; i < orderedTotals.length; i += 1) {
      othersTotal += orderedTotals[i].amount;
    }

    return `${orderedTotals[0].amount} ${orderedTotals[0].deviceType}, ${orderedTotals[1].amount} ${
      orderedTotals[1].deviceType
    }, ${othersTotal} ${t('common.others')}`;
  };

  return (
    <SimpleStatDisplay
      element={
        <>
          <Heading size="md" display="flex">
            <Text mt="2px">{t('configurations.device_types')}</Text>
            <Tooltip hasArrow label={t('analytics.device_types_explanation')}>
              <InfoIcon ml={2} mt="4px" />
            </Tooltip>
          </Heading>
          <Heading size="sm">
            <Text>{getTopDeviceTypes()}</Text>
          </Heading>
        </>
      }
      openModal={handleModalClick({
        prioritizedColumns: ['deviceType'],
        sortBy: [
          {
            id: 'deviceType',
            desc: false,
          },
        ],
      })}
      mb={4}
    />
  );
};

DeviceTypeStat.propTypes = propTypes;
export default DeviceTypeStat;
