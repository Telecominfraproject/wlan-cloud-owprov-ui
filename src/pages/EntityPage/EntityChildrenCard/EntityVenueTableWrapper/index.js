import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box } from '@chakra-ui/react';
import VenueTable from 'components/Tables/VenueTable';
import CreateVenueModal from 'components/Tables/VenueTable/CreateVenueModal';
import Actions from './Actions';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityVenueTableWrapper = ({ entity }) => {
  const actions = useCallback((cell) => <Actions key={uuid()} cell={cell.row} />, []);

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateVenueModal entityId={entity.id} />
      </Box>
      <VenueTable select={entity.venues} actions={actions} />
    </>
  );
};
EntityVenueTableWrapper.propTypes = propTypes;
export default EntityVenueTableWrapper;
