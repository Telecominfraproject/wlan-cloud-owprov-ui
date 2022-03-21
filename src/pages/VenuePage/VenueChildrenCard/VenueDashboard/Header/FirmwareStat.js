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
      return orderedTotals.map((v) => `${v.amount} ${v.lastFirmware}`).join(', ');
    }

    let othersTotal = 0;
    for (let i = 3; i < orderedTotals.length; i += 1) {
      othersTotal += orderedTotals[i].amount;
    }

    return `${orderedTotals[0].amount} ${orderedTotals[0].lastFirmware}, ${orderedTotals[1].amount} ${
      orderedTotals[1].lastFirmware
    }, ${othersTotal} ${t('common.others')}`;
  };

  return (
    <SimpleStatDisplay
      label={getTopFirmware()}
      element={
        <>
          <Heading size="md" display="flex">
            <Text mt="2px">{t('analytics.firmware')}</Text>
            <Tooltip hasArrow label={t('analytics.last_firmware_explanation')}>
              <InfoIcon ml={2} mt="4px" />
            </Tooltip>
          </Heading>
          <Heading size="sm">
            <Text>{getTopFirmware()}</Text>
          </Heading>
        </>
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
      mb={4}
    />
  );
};

FirmwareStat.propTypes = propTypes;
export default FirmwareStat;
