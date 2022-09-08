import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerInput from '../DatePickerInput';

const propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  isStart: PropTypes.bool,
  isEnd: PropTypes.bool,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};

const defaultProps = {
  isStart: false,
  isEnd: false,
  startDate: null,
  endDate: null,
};

const DateTimePicker = ({ date, onChange, isStart, isEnd, startDate, endDate }) => {
  const { t } = useTranslation();

  return (
    <DatePicker
      selected={date}
      onChange={onChange}
      selectsStart={isStart}
      selectsEnd={isEnd}
      startDate={startDate}
      endDate={endDate}
      timeInputLabel={`${t('common.time')}: `}
      dateFormat="dd/MM/yyyy hh:mm aa"
      timeFormat="p"
      showTimeSelect
      customInput={<DatePickerInput />}
    />
  );
};

DateTimePicker.propTypes = propTypes;
DateTimePicker.defaultProps = defaultProps;
export default React.memo(DateTimePicker);
