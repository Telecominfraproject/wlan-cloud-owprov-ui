import { Flex, Heading } from '@chakra-ui/react';
import RefreshButton from 'components/Buttons/RefreshButton';
import DateTimePicker from 'components/DatePickers/DateTimePicker';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getHoursAgo } from 'utils/dateFormatting';

const useDatePickers = ({
  defaultStart = getHoursAgo(1),
  defaultEnd = new Date(),
}: {
  defaultStart?: Date;
  defaultEnd?: Date;
}) => {
  const { t } = useTranslation();
  const [tempStart, setTempStart] = useState<Date>(defaultStart);
  const [tempEnd, setTempEnd] = useState<Date>(defaultEnd);
  const [start, setStart] = useState<Date>(defaultStart);
  const [end, setEnd] = useState<Date>(defaultEnd);
  const [refreshId, setRefreshId] = useState<number>(0);

  const refresh = () => {
    setStart(tempStart);
    setEnd(tempEnd);
    setRefreshId((state) => state + 1);
  };

  const timepickers = useMemo(
    () => (
      <Flex>
        <Flex>
          <Heading size="sm" mt="10px" mx={2}>
            {t('common.start')}:
          </Heading>
          <DateTimePicker date={tempStart} isStart onChange={setTempStart} />
        </Flex>
        <Flex ml={2}>
          <Heading size="sm" mt="10px" mr={2}>
            {t('common.end')}:
          </Heading>
          <DateTimePicker date={tempEnd} isEnd onChange={setTempEnd} startDate={tempStart} endDate={tempEnd} />
        </Flex>
        <Flex ml={2}>
          <RefreshButton onClick={refresh} />
        </Flex>
      </Flex>
    ),
    [t, tempStart, tempEnd],
  );

  const toReturn = useMemo(() => ({ start, end, refreshId, timepickers }), [start, end, refreshId, timepickers]);

  return toReturn;
};

export default useDatePickers;
