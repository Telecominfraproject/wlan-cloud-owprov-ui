import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const propTypes = {
  venueName: PropTypes.string,
  venueId: PropTypes.string,
};
const defaultProps = {
  venueName: '',
  venueId: '',
};

const VenueCell = ({ venueName, venueId }) => {
  const navigate = useNavigate();

  const goTo = () => navigate(`/venue/${venueId}`);

  if (venueName !== '' && venueId !== '') {
    return (
      <Button size="sm" variant="link" onClick={goTo}>
        {venueName}
      </Button>
    );
  }

  return null;
};

VenueCell.propTypes = propTypes;
VenueCell.defaultProps = defaultProps;
export default React.memo(VenueCell);
