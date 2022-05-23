import { t } from 'i18next';
import React, { useMemo } from 'react';

const BooleanCell: React.FC<{ isTrue?: boolean }> = ({ isTrue }) => {
  const data = useMemo(() => {
    if (isTrue === undefined) return '-';

    return isTrue ? t('common.yes') : t('common.no');
  }, [isTrue]);

  return <div>{data}</div>;
};

export default React.memo(BooleanCell);
