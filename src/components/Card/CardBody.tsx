import React from 'react';
import { Box, FlexProps, LayoutProps, SpaceProps, useStyleConfig } from '@chakra-ui/react';

interface CardBodyProps extends LayoutProps, SpaceProps, FlexProps {
  variant?: string;
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const CardBody: React.FC<CardBodyProps> = ({ variant, children, ...props }) => {
  // @ts-ignore
  const styles = useStyleConfig('CardBody', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...props}>
      {children}
    </Box>
  );
};

export default React.memo(CardBody);
