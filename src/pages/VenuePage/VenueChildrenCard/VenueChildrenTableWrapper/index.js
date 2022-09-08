import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box } from '@chakra-ui/react';
import VenueTable from 'components/Tables/VenueTable';
import CreateVenueModal from 'components/Tables/VenueTable/CreateVenueModal';
import Actions from './Actions';

const propTypes = {
  venue: PropTypes.shape(EntityShape),
};

const defaultProps = {
  venue: null,
};

const VenueChildrenTableWrapper = ({ venue }) => {
  const actions = useCallback((cell) => <Actions key={uuid()} cell={cell.row} />, []);

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateVenueModal parentId={venue.id} />
      </Box>
      <VenueTable select={venue.children} actions={actions} />
    </>
  );
};
VenueChildrenTableWrapper.propTypes = propTypes;
VenueChildrenTableWrapper.defaultProps = defaultProps;
export default VenueChildrenTableWrapper;
