import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { Heading, List, ListItem } from '@chakra-ui/react';

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
      return orderedTotals;
    }

    let othersTotal = 0;
    for (let i = 2; i < orderedTotals.length; i += 1) {
      othersTotal += orderedTotals[i].amount;
    }

    return [orderedTotals[0], orderedTotals[1], { deviceType: 'Others', amount: othersTotal }];
  };

  return (
    <SimpleStatDisplay
      title={t('analytics.device_types')}
      explanation={t('analytics.device_types_explanation')}
      element={
        <Heading size="sm">
          <List>
            {getTopDeviceTypes().map(({ deviceType, amount }) => (
              <ListItem key={uuid()}>
                {deviceType}: {amount}
              </ListItem>
            ))}
          </List>
        </Heading>
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
