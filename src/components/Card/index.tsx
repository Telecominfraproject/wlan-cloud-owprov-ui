import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';
import { ThemeProps } from 'models/Theme';

interface Props extends ThemeProps {
  variant?: string;
}

const defaultProps = {
  variant: undefined,
};

const Card: React.FC<Props> = ({ variant, children, ...props }) => {
  // @ts-ignore
  const styles = useStyleConfig('Card', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...props}>
      {children}
    </Box>
  );
};

Card.defaultProps = defaultProps;

export default Card;
