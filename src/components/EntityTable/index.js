import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { axiosProv } from 'utils/axiosInstances';
import { useQuery } from 'react-query';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { Plus, Trash } from 'phosphor-react';

const getEntitiesApi = async (pageInfo) => {
  if (Array.isArray(pageInfo)) {
    return axiosProv
      .get(`entity?withExtendedInfo=true&select=${pageInfo}`)
      .then(({ data }) => data);
  }

  return axiosProv
    .get(
      `entity?withExtendedInfo=true&limit=${pageInfo.limit}&offset=${
        pageInfo.limit * pageInfo.index
      }`,
    )
    .then(({ data }) => data);
};
const getCountApi = async () => axiosProv.get(`entity?countOnly=true`).then(({ data }) => data);

const propTypes = {
  idsToDisable: PropTypes.arrayOf(PropTypes.string),
  addAction: PropTypes.func,
  removeAction: PropTypes.func,
  entitySelect: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  idsToDisable: [],
  addAction: null,
  removeAction: null,
  entitySelect: null,
};

const EntityTable = ({ entitySelect, idsToDisable, addAction, removeAction }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState(null);
  const isSelect = entitySelect !== null;
  const { data: count, isFetching: isFetchingCount } = useQuery('get-entities-count', getCountApi, {
    enabled: !isSelect,
    onError: (e) => {
      if (!toast.isActive('entities-count-fetching-error'))
        toast({
          id: 'entities-count-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('entities.title'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });
  const { data: entities, isFetching: isFetchingEntities } = useQuery(
    ['get-entities', pageInfo, entitySelect, isSelect],
    () => getEntitiesApi(isSelect ? entitySelect : pageInfo),
    {
      keepPreviousData: true,
      enabled: (!isSelect && pageInfo !== null) || (isSelect && entitySelect.length > 0),
      onError: (e) => {
        if (!toast.isActive('entities-fetching-error'))
          toast({
            id: 'entities-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('entities.title'),
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    },
  );

  const deviceActions = useCallback(
    (cell) => (
      <Flex>
        {addAction && (
          <Tooltip hasArrow label={t('common.claim')} placement="top">
            <IconButton
              ml={2}
              colorScheme="blue"
              icon={<Plus size={20} />}
              size="sm"
              isDisabled={idsToDisable.find((id) => id === cell.row.values.id)}
              onClick={() => addAction(cell.row.values.id)}
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
              isDisabled={idsToDisable.find((id) => id === cell.row.values.id)}
              onClick={() => removeAction(cell.row.values.id)}
            />
          </Tooltip>
        )}
      </Flex>
    ),
    [idsToDisable, addAction, removeAction],
  );

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customWidth: '150px',
        alwaysShow: true,
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
      },
    ];

    if (addAction || removeAction) {
      baseColumns.push({
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'id',
        Cell: ({ cell }) => deviceActions(cell),
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      });
    }
    return baseColumns;
  }, [idsToDisable]);

  return (
    <DataTable
      columns={columns}
      data={entities?.entities ?? []}
      isLoading={isFetchingCount || isFetchingEntities}
      isManual={!isSelect}
      obj={t('inventory.tags')}
      count={count?.count || 0}
      setPageInfo={setPageInfo}
      minHeight="200px"
    />
  );
};

EntityTable.propTypes = propTypes;
EntityTable.defaultProps = defaultProps;

export default EntityTable;
