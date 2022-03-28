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

const MemoryStat = ({ data, handleModalClick }) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const getMemoryColor = () => {
    if (data.avgMemoryUsed < 65) return successColor(colorMode);
    if (data.avgMemoryUsed < 80) return warningColor(colorMode);
    return errorColor(colorMode);
  };

  return (
    <SimpleStatDisplay
      title={t('analytics.average_memory')}
      label={`${data.avgMemoryUsed}%`}
      explanation={t('analytics.average_memory_explanation')}
      openModal={handleModalClick({
        prioritizedColumns: ['lastPing', 'memory'],
        sortBy: [
          {
            id: 'memory',
            desc: true,
          },
        ],
      })}
      mb={4}
      color={getMemoryColor()}
    />
  );
};

MemoryStat.propTypes = propTypes;
export default MemoryStat;
