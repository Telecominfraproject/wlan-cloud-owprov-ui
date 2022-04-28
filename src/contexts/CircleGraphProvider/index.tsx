import React, { useMemo, useRef, useState } from 'react';

const CircleGraphContext = React.createContext<
  | {
      popoverRef: React.MutableRefObject<unknown>;
      isFullscreen: boolean;
      setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const CircleGraphProvider = ({ children }: { children: React.ReactElement }) => {
  const popoverRef = useRef<unknown>();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const value = useMemo(() => ({ popoverRef, isFullscreen, setIsFullscreen }), [popoverRef, isFullscreen]);

  return <CircleGraphContext.Provider value={value}>{children}</CircleGraphContext.Provider>;
};

export const useCircleGraph = () => React.useContext(CircleGraphContext);
