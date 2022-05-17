import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { Plus, Trash } from 'phosphor-react';
import { useGetInventoryCount, useGetInventoryTags } from 'hooks/Network/Inventory';

const propTypes = {
  tagSelect: PropTypes.arrayOf(PropTypes.string),
  owner: PropTypes.string,
  serialsToDisable: PropTypes.arrayOf(PropTypes.string),
  ignoredColumns: PropTypes.arrayOf(PropTypes.string),
  addAction: PropTypes.func,
  removeAction: PropTypes.func,
  isSubscribersOnly: PropTypes.bool,
  actions: PropTypes.func,
  refreshId: PropTypes.number,
  onlyUnassigned: PropTypes.bool,
  minHeight: PropTypes.instanceOf(Object),
};

const defaultProps = {
  tagSelect: null,
  owner: null,
  addAction: null,
  removeAction: null,
  isSubscribersOnly: false,
  onlyUnassigned: false,
  ignoredColumns: [],
  serialsToDisable: [],
  actions: null,
  refreshId: 0,
  minHeight: null,
};

const InventoryTable = ({
  tagSelect,
  owner,
  isSubscribersOnly,
  serialsToDisable,
  addAction,
  removeAction,
  ignoredColumns,
  onlyUnassigned,
  actions,
  refreshId,
  minHeight,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState(null);
  const isManual = tagSelect !== null || owner !== null;
  const { data: count, isFetching: isFetchingCount } = useGetInventoryCount({
    t,
    toast,
    enabled: !isManual,
    isSubscribersOnly,
    onlyUnassigned,
  });
  const {
    data: tags,
    isFetching: isFetchingTags,
    refetch: refetchTags,
  } = useGetInventoryTags({
    t,
    toast,
    pageInfo,
    tagSelect,
    owner,
    isSubscribersOnly,
    onlyUnassigned,
    enabled: (!isManual && pageInfo !== null) || (isManual && tagSelect?.length > 0) || (isManual && owner !== null),
  });

  const deviceActions = useCallback(
    (cell) =>
      actions !== null ? (
        actions(cell)
      ) : (
        <Flex>
          {addAction && (
            <Tooltip hasArrow label={t('common.claim')} placement="top">
              <IconButton
                ml={2}
                colorScheme="blue"
                icon={<Plus size={20} />}
                size="sm"
                isDisabled={serialsToDisable.find(
                  (serial) => serial === cell.row.values.serialNumber || serial === cell.row.original.id,
                )}
                onClick={() => addAction(cell.row.values.serialNumber)}
              />
            </Tooltip>
          )}
          {removeAction && (
            <Tooltip hasArrow label={t('common.remove')} placement="top">
              <IconButton
                ml={2}
                colorScheme="blue"
                icon={<Trash size={20} />}
                size="sm"
                isDisabled={serialsToDisable.find((serial) => serial === cell.row.values.serialNumber)}
                onClick={() => removeAction(cell.row.values.serialNumber)}
              />
            </Tooltip>
          )}
        </Flex>
      ),
    [serialsToDisable, addAction, removeAction, tagSelect],
  );

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'serialNumber',
        Header: t('inventory.serial_number'),
        Footer: '',
        accessor: 'serialNumber',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'configuration',
        Header: t('configurations.one'),
        Footer: '',
        accessor: 'extendedInfo.deviceConfiguration.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
      },
      {
        id: 'entity',
        Header: t('entities.entity'),
        Footer: '',
        accessor: 'extendedInfo.entity.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'venue',
        Header: t('venues.one'),
        Footer: '',
        accessor: 'extendedInfo.venue.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
    ];

    if (actions !== null || addAction || removeAction) {
      baseColumns.push({
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'id',
        Cell: ({ cell }) => deviceActions(cell),
        customWidth: '50px',
      });
    }
    return baseColumns;
  }, [serialsToDisable, tagSelect, addAction, removeAction]);

  useEffect(() => {
    refetchTags();
  }, [t, refreshId]);

  if (isManual && tagSelect?.length === 0) {
    return (
      <DataTable
        columns={columns.filter((col) => !ignoredColumns.find((ign) => col.id === ign))}
        data={[]}
        isLoading={isFetchingCount || isFetchingTags}
        isManual={!isManual}
        obj={t('devices.title')}
        count={count || 0}
        setPageInfo={setPageInfo}
        minHeight={minHeight ?? '200px'}
      />
    );
  }

  return (
    <DataTable
      columns={columns.filter((col) => !ignoredColumns.find((ign) => col.id === ign))}
      data={tags ?? []}
      isLoading={isFetchingCount || isFetchingTags}
      isManual={!isManual}
      obj={t('devices.title')}
      count={count || 0}
      setPageInfo={setPageInfo}
      minHeight={minHeight ?? '200px'}
    />
  );
};

InventoryTable.propTypes = propTypes;
InventoryTable.defaultProps = defaultProps;

export default InventoryTable;
