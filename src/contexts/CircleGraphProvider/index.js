import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const CircleGraphContext = React.createContext();

export const CircleGraphProvider = ({ children }) => {
  const popoverRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const value = useMemo(() => ({ popoverRef, isFullscreen, setIsFullscreen }), [popoverRef, isFullscreen]);

  return <CircleGraphContext.Provider value={value}>{children}</CircleGraphContext.Provider>;
};

CircleGraphProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCircleGraph = () => React.useContext(CircleGraphContext);
