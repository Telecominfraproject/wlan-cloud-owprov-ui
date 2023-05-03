import * as React from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { TreeStructure } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CreateEntityModal from './CreateEntityModal';
import { useGetEntity, useGetSelectEntities } from 'hooks/Network/Entity';
import { Entity } from 'models/Entity';

type Props = {
  id: string;
};

const EntityDropdown = ({ id }: Props) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const getEntity = useGetEntity({ id });
  const getChildren = useGetSelectEntities({ select: getEntity.data?.children ?? [] });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const goToEntity = (entityId: string) => () => navigate(`/entity/${entityId}`);

  const isCompact = breakpoint === 'base' || breakpoint === 'sm';

  return (
    <>
      <Menu>
        <Tooltip label={`${t('entities.sub_other')} (${getEntity.data?.children.length ?? 0})`}>
          {isCompact ? (
            <MenuButton
              as={IconButton}
              icon={<TreeStructure size={20} />}
              aria-label={`${t('entities.sub_other')} (${getEntity.data?.children.length ?? 0})`}
              colorScheme="pink"
              isDisabled={!getEntity.data}
              mx={2}
            />
          ) : (
            <MenuButton
              as={Button}
              aria-label={`${t('entities.sub_other')} (${getEntity.data?.children.length ?? 0})`}
              colorScheme="pink"
              isDisabled={!getEntity.data}
              mx={2}
            >{`${t('entities.sub_other')} (${getEntity.data?.children.length ?? 0})`}</MenuButton>
          )}
        </Tooltip>
        <MenuList>
          <MenuItem onClick={onOpen}>{t('common.create')}</MenuItem>
          <MenuDivider />
          {getChildren.data
            ?.sort((a: Entity, b: Entity) => a.name.localeCompare(b.name))
            .map(({ id: entityId, name }: Entity) => (
              <MenuItem key={entityId} onClick={goToEntity(entityId)}>
                {name}
              </MenuItem>
            )) ?? []}
        </MenuList>
      </Menu>
      <CreateEntityModal isOpen={isOpen} onClose={onClose} parentId={getEntity.data?.id ?? ''} />
    </>
  );
};

export default EntityDropdown;
