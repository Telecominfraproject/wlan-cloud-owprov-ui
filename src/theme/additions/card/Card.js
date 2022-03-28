const Card = {
  baseStyle: {
    p: '22px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    minWidth: '0px',
    wordWrap: 'break-word',
    backgroundClip: 'border-box',
  },
  variants: {
    panel: (props) => ({
      bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
      width: '100%',
      boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)',
      borderRadius: '15px',
    }),
    widget: (props) => ({
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
      width: '100%',
      boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.1)',
      borderRadius: '15px',
    }),
  },
  defaultProps: {
    variant: 'panel',
  },
};

export default {
  components: {
    Card,
  },
};
