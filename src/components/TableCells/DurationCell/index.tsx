import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { secondsDuration } from 'utils/dateFormatting';

const DurationCell: React.FC<{ seconds?: number }> = ({ seconds }) => {
  const { t } = useTranslation();

  const data = useMemo(() => {
    if (seconds === undefined) return '-';

    return secondsDuration(seconds, t);
  }, [seconds]);

  return <div>{data}</div>;
};

export default React.memo(DurationCell);
