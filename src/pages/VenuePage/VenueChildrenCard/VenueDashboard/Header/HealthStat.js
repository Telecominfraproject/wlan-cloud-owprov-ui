import React from 'react';
import PropTypes from 'prop-types';
import { useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { errorColor, successColor, warningColor } from 'utils/colors';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  handleModalClick: PropTypes.func.isRequired,
};

const HealthStat = ({ data, handleModalClick }) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const getHealthColor = () => {
    if (data.avgHealth >= 90) return successColor(colorMode);
    if (data.avgHealth >= 70) return warningColor(colorMode);
    return errorColor(colorMode);
  };

  return (
    <SimpleStatDisplay
      title={t('analytics.average_health')}
      label={`${data.avgHealth}%`}
      explanation={t('analytics.average_health_explanation')}
      openModal={handleModalClick({
        prioritizedColumns: ['lastHealth', 'health'],
        sortBy: [
          {
            id: 'health',
            desc: false,
          },
        ],
      })}
      color={getHealthColor()}
      mb={4}
    />
  );
};

HealthStat.propTypes = propTypes;
export default HealthStat;
