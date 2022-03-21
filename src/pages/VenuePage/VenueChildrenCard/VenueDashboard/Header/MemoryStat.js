import React from 'react';
import PropTypes from 'prop-types';
import { useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  handleModalClick: PropTypes.func.isRequired,
};

const MemoryStat = ({ data, handleModalClick }) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const getMemoryColor = () => {
    if (data.avgMemoryUsed < 65)
      return colorMode === 'light' ? 'var(--chakra-colors-green-200)' : 'var(--chakra-colors-green-400)';
    if (data.avgMemoryUsed < 80)
      return colorMode === 'light' ? 'var(--chakra-colors-yellow-200)' : 'var(--chakra-colors-yellow-400)';
    return colorMode === 'light' ? 'var(--chakra-colors-red-200)' : 'var(--chakra-colors-red-400)';
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
