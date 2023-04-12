import React from 'react';
import { Heading, List, ListItem } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  handleModalClick: PropTypes.func.isRequired,
};

const FirmwareStat = ({ data, handleModalClick }) => {
  const { t } = useTranslation();

  const getTopFirmware = () => {
    const orderedTotals = Object.keys(data.deviceFirmwareTotals)
      .map((k) => ({
        lastFirmware: k,
        amount: data.deviceFirmwareTotals[k],
      }))
      .sort((a, b) => (a.amount < b.amount ? 1 : -1));

    if (orderedTotals.length <= 3) {
      return orderedTotals;
    }

    let othersTotal = 0;
    for (let i = 3; i < orderedTotals.length; i += 1) {
      othersTotal += orderedTotals[i].amount;
    }

    return [orderedTotals[0], orderedTotals[1], { lastFirmware: 'Others', amount: othersTotal }];
  };

  return (
    <SimpleStatDisplay
      title={t('analytics.firmware')}
      explanation={t('analytics.last_firmware_explanation')}
      element={
        <Heading size="sm">
          <List>
            {getTopFirmware().map(({ lastFirmware, amount }) => (
              <ListItem key={uuid()}>
                {lastFirmware}: {amount}
              </ListItem>
            ))}
          </List>
        </Heading>
      }
      openModal={handleModalClick({
        prioritizedColumns: ['lastFirmware'],
        sortBy: [
          {
            id: 'lastFirmware',
            desc: false,
          },
        ],
      })}
    />
  );
};

FirmwareStat.propTypes = propTypes;
export default FirmwareStat;
