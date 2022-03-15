import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@chakra-ui/react';
import { compactDate, formatDaysAgo } from 'utils/dateFormatting';

const propTypes = {
  date: PropTypes.number.isRequired,
};

const FormattedDate = ({ date }) => (
  <Tooltip hasArrow placement="top" label={compactDate(date)}>
    {date === 0 ? '-' : formatDaysAgo(date)}
  </Tooltip>
);

FormattedDate.propTypes = propTypes;

export default React.memo(FormattedDate);
