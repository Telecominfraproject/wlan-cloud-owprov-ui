import { Flex, FormControl, FormLabel, Spacer, Switch, useBoolean, useDisclosure, useToast } from '@chakra-ui/react';
import RefreshButton from 'components/Buttons/RefreshButton';
import InventoryTable from 'components/Tables/InventoryTable';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateTagModal from 'components/Tables/InventoryTable/CreateTagModal';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ImportDeviceCsvModal from 'components/Tables/InventoryTable/ImportDeviceCsvModal';
import { usePushConfig } from 'hooks/Network/Inventory';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';

const SubscriberInventory = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [refreshId, setRefreshId] = useState(uuid());
  const [tag, setTag] = useState(null);
  const [onlyUnassigned, setOnlyUnassigned] = useBoolean(false);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const pushConfiguration = usePushConfig({ t, toast, onSuccess: () => openPush() });

  const openEditModal = (newTag) => {
    setTag(newTag);
    openEdit();
  };

  const refreshInventory = () => setRefreshId(uuid());

  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshEntity={refreshInventory} openEditModal={openEditModal} />,
    [refreshId],
  );
  return (
    <>
      <Flex>
        <Spacer />
        <FormControl display="flex" w="unset" alignItems="center" mr={2}>
          <FormLabel htmlFor="unassigned-switch" mb="0">
            {t('devices.unassigned_only')}
          </FormLabel>
          <Switch id="unassigned-switch" isChecked={onlyUnassigned} onChange={setOnlyUnassigned.toggle} size="lg" />
        </FormControl>
        <ImportDeviceCsvModal refresh={refreshInventory} deviceClass="subscriber" />
        <CreateTagModal refresh={refreshInventory} deviceClass="subscriber" />
        <RefreshButton ml={2} onClick={refreshInventory} />
      </Flex>
      <InventoryTable
        isSubscribersOnly
        ignoredColumns={['entity', 'venue']}
        refreshId={refreshId}
        actions={actions}
        onlyUnassigned={onlyUnassigned}
        minHeight={{ base: 'calc(100vh - 360px)', md: 'calc(100vh - 350px)' }}
      />
      <EditTagModal
        isOpen={isEditOpen}
        onClose={closeEdit}
        tag={tag}
        refresh={refreshInventory}
        pushConfig={pushConfiguration}
      />
      <ConfigurationPushModal isOpen={isPushOpen} onClose={closePush} pushResult={pushConfiguration.data} />
    </>
  );
};

export default SubscriberInventory;
