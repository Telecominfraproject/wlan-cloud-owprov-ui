import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { TreeEntity, TreeVenue, useGetEntityTree } from 'hooks/Network/Entity';

const traverseTreeToFindId = (tree: TreeEntity, desiredId: string) => {
  const traverse: (node: TreeEntity | TreeVenue) => null | (TreeEntity | TreeVenue)[] = (node) => {
    if (node.uuid === desiredId) {
      return [node];
    }

    for (const child of node.children) {
      const result = traverse(child);
      if (result) {
        return [node, ...result];
      }
    }

    for (const child of node.venues ?? []) {
      const result = traverse(child);
      if (result) {
        return [node, ...result];
      }
    }

    return null;
  };

  return traverse(tree);
};

type Props = {
  id: string;
};
const EntityBreadcrumb = ({ id }: Props) => {
  const menuProps = useDisclosure();
  const getEntityTree = useGetEntityTree();

  const pathToEntity = React.useMemo(() => {
    if (getEntityTree.data) {
      const path = traverseTreeToFindId(getEntityTree.data, id);
      if (path) {
        return path.filter(({ uuid }) => uuid !== '0000-0000-0000');
      }
    }

    return [];
  }, [getEntityTree.data, id]);

  const lastEntry = pathToEntity[pathToEntity.length - 1];
  const lastEntryChildren = [...(lastEntry?.children ?? []), ...(lastEntry?.venues ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  let timeout: NodeJS.Timeout;
  const onMouseEnter = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    menuProps.onOpen();
  };
  const onMouseLeave = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => menuProps.onClose(), 100);
  };

  return (
    <Breadcrumb separator="/" spacing={1}>
      {pathToEntity.map((entity) => (
        <BreadcrumbItem key={entity.uuid} isCurrentPage={entity.uuid === id}>
          <BreadcrumbLink href={`#/${entity.type}/${entity.uuid}`} fontWeight={entity.uuid === id ? 'bold' : undefined}>
            {entity.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
      <BreadcrumbItem>
        <Menu {...menuProps} gutter={0}>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: 'none' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Text>...</Text>
          </MenuButton>
          <MenuList
            bg={useColorModeValue('white', 'gray.900')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {lastEntryChildren.map((child) => (
              <MenuItem as="a" w="100%" key={child.uuid} href={`#/${child.type}/${child.uuid}`}>
                {child.name}
              </MenuItem>
            ))}
            {lastEntryChildren.length === 0 && <MenuItem isDisabled>No children</MenuItem>}
          </MenuList>
        </Menu>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default EntityBreadcrumb;
