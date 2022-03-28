import React from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'components/DatePickers/DateTimePicker';
import { Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  setStart: PropTypes.func.isRequired,
  setEnd: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const CirclePackTimePickers = ({ start, end, setStart, setEnd, isDisabled }) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <Flex>
        <Heading size="sm" mt="10px" mr={2}>
          {t('common.start')}:
        </Heading>
        <DateTimePicker date={start} isStart onChange={setStart} isDisabled={isDisabled} />
      </Flex>
      <Flex ml={2}>
        <Heading size="sm" mt="10px" mr={2}>
          {t('common.end')}:
        </Heading>
        <DateTimePicker date={end} isEnd onChange={setEnd} startDate={start} endDate={end} isDisabled={isDisabled} />
      </Flex>
    </Flex>
  );
};

CirclePackTimePickers.propTypes = propTypes;
export default React.memo(CirclePackTimePickers);
