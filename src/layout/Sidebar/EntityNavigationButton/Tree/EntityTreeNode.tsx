/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Buildings, CaretDown, CaretRight, TreeStructure } from '@phosphor-icons/react';
import EntityFavoritesButton from './EntityFavoritesButton';
import { TreeEntity, TreeVenue } from 'hooks/Network/Entity';

const expandIcon = (childrenLength: number, isExpanded: boolean) => {
  if (childrenLength === 0) return null;
  return isExpanded ? <CaretDown size={16} weight="fill" /> : <CaretRight size={16} weight="fill" />;
};

type Props = {
  node: TreeEntity | TreeVenue;
  level: number;
  expandedIds: {
    [key: string]: boolean;
  };
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  navigateTo: (id: string, type: 'venue' | 'entity') => void;
  onHoverParent: () => void;
  onLeaveParent: () => void;
};

const EntityTreeNode = ({
  node,
  level,
  expandedIds,
  onExpand,
  onCollapse,
  navigateTo,
  onHoverParent,
  onLeaveParent,
}: Props) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const childrenLevel = level + 1;
  const isExpanded = expandedIds[node.uuid] === true;

  const mergedAndSortedChildren = [...node.children, ...(node.venues ?? [])].sort((a, b) =>
    (a.name as string).localeCompare(b.name as string),
  );

  const onExpandClick = () => {
    if (isExpanded) {
      onCollapse(node.uuid);
    } else {
      onExpand(node.uuid);
    }
  };

  const onNavigate: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement> = (e) => {
    navigateTo(node.uuid, node.type);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseEnter = () => {
    setIsHovered(true);
    onHoverParent();
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    onLeaveParent();
  };

  const onChildHover = () => {
    setIsHovered(true);
    onHoverParent();
  };

  const onChildLeave = () => {
    setIsHovered(false);
    onLeaveParent();
  };

  return (
    <Box>
      <Flex alignItems="center">
        <span
          style={{
            width: '16px',
            cursor: 'pointer',
            paddingRight: '4px',
          }}
          onClick={mergedAndSortedChildren.length > 0 ? onExpandClick : undefined}
        >
          {expandIcon(mergedAndSortedChildren.length, isExpanded)}
        </span>
        <Flex
          onClick={onNavigate}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          cursor="pointer"
          w="100%"
          alignItems="center"
        >
          <span
            style={{
              marginRight: '4px',
            }}
          >
            {node.type === 'entity' ? <TreeStructure size={16} /> : <Buildings size={16} />}
          </span>
          <Text fontWeight={isHovered ? 'bold' : 'normal'}>{node.name}</Text>
          {isHovered ? <EntityFavoritesButton id={node.uuid} type={node.type} /> : null}
        </Flex>
      </Flex>
      {isExpanded ? (
        <Box paddingLeft={`${childrenLevel * 6}px`}>
          {mergedAndSortedChildren.map((child) => (
            <EntityTreeNode
              key={child.uuid}
              node={child}
              level={childrenLevel}
              expandedIds={expandedIds}
              onExpand={onExpand}
              onCollapse={onCollapse}
              navigateTo={navigateTo}
              onHoverParent={onChildHover}
              onLeaveParent={onChildLeave}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default React.memo(EntityTreeNode);
