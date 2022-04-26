import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import ConfigurationsTable from 'components/Tables/ConfigurationTable';
import ConfigurationInUseModal from 'components/Modals/Configuration/ConfigurationInUseModal';
import ConfigurationViewAffectedModal from 'components/Tables/ConfigurationTable/ConfigurationViewAffectedModal';
import CreateConfigurationModal from 'components/Tables/ConfigurationTable/CreateConfigurationModal';
import Actions from './Actions';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityConfigurationsTableWrapper = ({ entity }) => {
  const [config, setConfig] = useState(null);
  const queryClient = useQueryClient();
  const { isOpen: isInUseOpen, onOpen: openInUse, onClose: closeInUse } = useDisclosure();
  const { isOpen: isAffectedOpen, onOpen: openAffected, onClose: closeAffected } = useDisclosure();
  const openInUseModal = (newConf) => {
    setConfig(newConf);
    openInUse();
  };
  const openAffectedModal = (newConf) => {
    setConfig(newConf);
    openAffected();
  };

  const actions = useCallback(
    (cell) => (
      <Actions key={uuid()} cell={cell.row} openInUseModal={openInUseModal} openAffectedModal={openAffectedModal} />
    ),
    [],
  );

  const refresh = () => queryClient.invalidateQueries(['get-entity', entity.id]);

  return (
    <>
      <Box textAlign="right">
        <CreateConfigurationModal entityId={`entity:${entity.id}`} refresh={refresh} />
      </Box>
      <ConfigurationsTable select={entity.configurations} actions={actions} />
      <ConfigurationInUseModal isOpen={isInUseOpen} onClose={closeInUse} config={config} />
      <ConfigurationViewAffectedModal isOpen={isAffectedOpen} onClose={closeAffected} config={config} />
    </>
  );
};
EntityConfigurationsTableWrapper.propTypes = propTypes;
export default EntityConfigurationsTableWrapper;
