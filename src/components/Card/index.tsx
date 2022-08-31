import React from 'react';
import { BackgroundProps, Box, InteractivityProps, LayoutProps, SpaceProps, useStyleConfig } from '@chakra-ui/react';

interface CardProps extends LayoutProps, SpaceProps, BackgroundProps, InteractivityProps {
  variant?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ variant, children, ...props }) => {
  // @ts-ignore
  const styles = useStyleConfig('Card', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...props}>
      {children}
    </Box>
  );
};

export default React.memo(Card);
