import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { secondsDuration } from 'utils/dateFormatting';

const DurationCell = ({ seconds }: { seconds?: number }) => {
  const { t } = useTranslation();

  const data = useMemo(() => {
    if (seconds === undefined) return '-';

    return secondsDuration(seconds, t);
  }, [seconds]);

  return <div>{data}</div>;
};

export default React.memo(DurationCell);
