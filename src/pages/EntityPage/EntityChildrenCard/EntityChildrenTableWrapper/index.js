import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box } from '@chakra-ui/react';
import EntityTable from 'components/Tables/EntityTable';
import CreateEntityModal from 'pages/EntityPage/CreateEntityModal';
import Actions from './Actions';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityChildrenTableWrapper = ({ entity }) => {
  const actions = useCallback((cell) => <Actions key={uuid()} cell={cell.row} />, []);

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateEntityModal parentId={entity?.id ?? ''} />
      </Box>
      <EntityTable select={entity.children} actions={actions} />
    </>
  );
};
EntityChildrenTableWrapper.propTypes = propTypes;
export default EntityChildrenTableWrapper;
