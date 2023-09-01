import * as React from 'react';
import { Box, UseDisclosureReturn } from '@chakra-ui/react';
import EntityNavigationTree from './Tree';
import { Modal } from 'components/Modals/Modal';
import { useGetEntityTree } from 'hooks/Network/Entity';

type Props = {
  modalProps: UseDisclosureReturn;
  navigateTo: (id: string, type: 'venue' | 'entity') => void;
};

const EntityNavigationModal = ({ modalProps, navigateTo }: Props) => {
  const getEntityTree = useGetEntityTree();

  return (
    <Modal {...modalProps} title="Entity and Venue Navigation">
      <Box>
        {getEntityTree.data ? (
          <EntityNavigationTree isModalOpen={modalProps.isOpen} treeRoot={getEntityTree.data} navigateTo={navigateTo} />
        ) : null}
      </Box>
    </Modal>
  );
};

export default EntityNavigationModal;
