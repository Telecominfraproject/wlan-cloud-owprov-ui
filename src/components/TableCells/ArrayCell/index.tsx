import React, { useMemo } from 'react';

const ArrayCell = ({ arr }: { arr?: unknown[] }) => {
  const data = useMemo(() => {
    if (arr === undefined) return '';

    return arr.join(', ');
  }, [arr]);

  return <div>{data}</div>;
};

export default React.memo(ArrayCell);
