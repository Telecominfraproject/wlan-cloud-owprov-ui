import { useCallback, useMemo, useState } from 'react';

const useRefreshId = () => {
  const [refreshId, setRefreshId] = useState(0);

  const refresh = useCallback(() => setRefreshId(refreshId + 1), [refreshId]);

  const toReturn = useMemo(
    () => ({
      refreshId,
      refresh,
    }),
    [refresh, refreshId],
  );

  return toReturn;
};

export default useRefreshId;
