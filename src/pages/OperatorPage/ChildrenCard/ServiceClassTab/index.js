import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Box } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import Actions from './Actions';
import ServiceClassTable from './Table';
import CreateServiceModal from './CreateServiceModal';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
};

const ServiceClassTab = ({ operatorId }) => {
  const { refreshId, refresh } = useRefreshId();
  const actions = useCallback((cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} />, []);

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateServiceModal operatorId={operatorId} refresh={refresh} />
      </Box>
      <ServiceClassTable operatorId={operatorId} actions={actions} refreshId={refreshId} />
    </>
  );
};
ServiceClassTab.propTypes = propTypes;
export default ServiceClassTab;
