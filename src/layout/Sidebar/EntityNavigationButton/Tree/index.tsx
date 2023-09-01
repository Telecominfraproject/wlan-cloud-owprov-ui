import * as React from 'react';
import { Box, Button, Flex, Heading, Spacer, useColorMode } from '@chakra-ui/react';
import { ChakraStylesConfig, GroupBase, Select } from 'chakra-react-select';
import EntityTreeNode from './EntityTreeNode';
import { getExpandedKeys, setExpandedKeys } from './utils.entityTree';
import { TreeEntity, TreeVenue, useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles: React.CSSProperties = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

type Option = { value: string; label: string; type: 'venue' | 'entity' };

const chakraStyles: (colorMode: 'light' | 'dark') => ChakraStylesConfig<Option, false, GroupBase<Option>> = (
  colorMode,
) => ({
  dropdownIndicator: (provided) => ({
    ...provided,
    width: '32px',
  }),
  placeholder: (provided) => ({
    ...provided,
    lineHeight: '1',
    pointerEvents: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
  }),
  container: (provided) => ({
    ...provided,
    width: '300px',
    backgroundColor: colorMode === 'light' ? 'white' : 'gray.600',
    borderRadius: '15px',
  }),
  input: (provided) => ({
    ...provided,
    gridArea: '1 / 2 / 4 / 4 !important',
  }),
});

const formatGroupLabel = (data: GroupBase<Option>) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const getTreeIds = (tree: TreeEntity | TreeVenue): string[] => [
  tree.uuid,
  ...tree.children.flatMap((child) => getTreeIds(child)),
  ...(tree.venues ?? []).flatMap((venue) => getTreeIds(venue)),
];

type Props = {
  isModalOpen: boolean;
  treeRoot: TreeEntity;
  navigateTo: (id: string, type: 'venue' | 'entity') => void;
};

const EntityNavigationTree = ({ isModalOpen, treeRoot, navigateTo }: Props) => {
  const { colorMode } = useColorMode();
  const [expandedIds, setExpandedIds] = React.useState<{
    [key: string]: boolean;
  }>({});
  const getEntities = useGetEntities();
  const getVenues = useGetVenues();
  const [rawInput, setRawInput] = React.useState('');

  const onExpand = React.useCallback(
    (id: string) => {
      const newExpandedIds = { ...expandedIds };
      newExpandedIds[id] = true;
      setExpandedIds(newExpandedIds);
      setExpandedKeys(newExpandedIds);
    },
    [expandedIds],
  );

  const onCollapse = React.useCallback(
    (id: string) => {
      const newExpandedIds = { ...expandedIds };
      newExpandedIds[id] = false;
      setExpandedIds(newExpandedIds);
      setExpandedKeys(newExpandedIds);
    },
    [expandedIds],
  );

  const onExpandAll = () => {
    const treeIds = getTreeIds(treeRoot);
    const newExpandedIds: { [key: string]: boolean } = {};
    treeIds.forEach((id) => {
      newExpandedIds[id] = true;
    });
    setExpandedIds({ ...newExpandedIds });
    setExpandedKeys(newExpandedIds);
  };

  const onCollapseAll = () => {
    setExpandedIds({});
    setExpandedKeys({});
  };

  const mappedAndSortedEntities: Option[] = React.useMemo(() => {
    if (!getEntities.data) return [];

    return getEntities.data
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entity) => ({
        label: entity.name,
        value: entity.id,
        type: 'entity',
      }));
  }, [getEntities.data]);
  const mappedAndSortedVenues: Option[] = React.useMemo(() => {
    if (!getVenues.data) return [];

    return getVenues.data
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((venue) => ({
        label: venue.name,
        value: venue.id,
        type: 'venue',
      }));
  }, [getVenues.data]);

  const filteredEntities: Option[] = React.useMemo(() => {
    if (rawInput.length === 0) return mappedAndSortedEntities;
    return mappedAndSortedEntities?.filter((entity) => entity.label.toLowerCase().includes(rawInput.toLowerCase()));
  }, [mappedAndSortedEntities, rawInput]);

  const filteredVenues: Option[] = React.useMemo(() => {
    if (rawInput.length === 0) return mappedAndSortedVenues;
    return mappedAndSortedVenues?.filter((venue) => venue.label.toLowerCase().includes(rawInput.toLowerCase()));
  }, [mappedAndSortedVenues, rawInput]);

  const NoOptionsMessage = React.useCallback(
    () => (
      <Heading size="xs" textAlign="left" px={2}>
        No results found
      </Heading>
    ),
    [],
  );

  const onOptionChoice = (v: Option) => {
    navigateTo(v.value, v.type);
  };

  const onChange = (v: string) => {
    setRawInput(v);
  };

  React.useEffect(() => {
    if (isModalOpen) {
      setRawInput('');
    }
  }, [isModalOpen]);

  React.useEffect(() => {
    const settings = getExpandedKeys();
    const newExpandedIds: { [key: string]: boolean } = {};
    settings.forEach((id) => {
      newExpandedIds[id] = true;
    });
    setExpandedIds({ ...newExpandedIds });
  }, [treeRoot]);

  return (
    <Box>
      <Flex alignItems="center" mb={2}>
        <Select<Option, false, GroupBase<Option>>
          chakraStyles={chakraStyles(colorMode)}
          formatGroupLabel={formatGroupLabel}
          components={{ NoOptionsMessage }}
          options={[
            {
              label: 'Entities',
              options: filteredEntities,
            },
            {
              label: 'Venues',
              options: filteredVenues,
            },
          ]}
          filterOption={() => true}
          inputValue={rawInput}
          // @ts-ignore
          value={rawInput}
          placeholder="Search for an entity or venue"
          onInputChange={onChange}
          // @ts-ignore
          onChange={onOptionChoice}
          menuPlacement="top"
        />
        <Spacer />
        <Button onClick={onExpandAll} colorScheme="blue" size="sm">
          Expand
        </Button>
        <Button ml={2} onClick={onCollapseAll} colorScheme="gray" size="sm">
          Collapse
        </Button>
      </Flex>
      <EntityTreeNode
        node={treeRoot}
        level={0}
        expandedIds={expandedIds}
        onExpand={onExpand}
        onCollapse={onCollapse}
        navigateTo={navigateTo}
        onHoverParent={() => {}}
        onLeaveParent={() => {}}
      />
    </Box>
  );
};

export default EntityNavigationTree;
