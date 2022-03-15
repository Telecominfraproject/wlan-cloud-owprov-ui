import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import InventoryTable from 'components/Tables/InventoryTable';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { usePushConfig } from 'hooks/Network/Inventory';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateTagModal from 'components/Tables/InventoryTable/CreateTagModal';
import Actions from './Actions';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityDeviceTableWrapper = ({ entity }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [tag, setTag] = useState(null);
  const [refreshId, setRefreshId] = useState(0);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const pushConfiguration = usePushConfig({ t, toast, onSuccess: () => openPush() });

  const openEditModal = (newTag) => {
    setTag(newTag);
    openEdit();
  };

  const refreshEntity = () => queryClient.invalidateQueries(['get-entity', entity.id]);

  const refetchTags = () => setRefreshId(refreshId + 1);

  const actions = useCallback(
    (cell) => (
      <Actions
        key={createUuid()}
        cell={cell.row}
        refreshEntity={refreshEntity}
        openEditModal={openEditModal}
      />
    ),
    [refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateTagModal refresh={refreshEntity} entityId={`entity:${entity.id}`} />
      </Box>
      <InventoryTable
        tagSelect={entity.devices}
        ignoredColumns={['entity', 'venue']}
        refreshId={refreshId}
        actions={actions}
      />
      <EditTagModal
        isOpen={isEditOpen}
        onClose={closeEdit}
        tag={tag}
        refresh={refetchTags}
        pushConfig={pushConfiguration}
      />
      <ConfigurationPushModal
        isOpen={isPushOpen}
        onClose={closePush}
        pushResult={pushConfiguration.data}
      />
    </>
  );
};

EntityDeviceTableWrapper.propTypes = propTypes;
export default EntityDeviceTableWrapper;
