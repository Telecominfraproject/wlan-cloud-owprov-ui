import React, { useMemo } from 'react';
import { parseDbm } from 'utils/stringHelper';

const DecibelCell = ({ db }: { db?: number }) => {
  const data = useMemo(() => {
    if (db === undefined) return '-';

    return parseDbm(db);
  }, [db]);

  return <div>{data}</div>;
};

export default React.memo(DecibelCell);
