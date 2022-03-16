import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, useDisclosure, useToast } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { ArrowsClockwise } from 'phosphor-react';
import ColumnPicker from 'components/ColumnPicker';
import { useGetResources, useGetResourcesCount } from 'hooks/Network/Resources';
import CreateResourceModal from './CreateResourceModal';
import EditResourceModal from './EditResourceModal';
import Actions from './Actions';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const ResourcesTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [resource, setResource] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { data: count, isFetching: isFetchingCount } = useGetResourcesCount({
    t,
    toast,
  });
  const {
    data: resources,
    isFetching: isFetchingResources,
    refetch: refresh,
  } = useGetResources({
    t,
    toast,
    pageInfo,
    enabled: pageInfo !== null,
    count,
  });

  const openEditModal = (newResource) => {
    setResource(newResource);
    openEdit();
  };

  const actionCell = useCallback(
    (cell) => <Actions cell={cell.row} refreshTable={refresh} key={uuid()} openEditModal={openEditModal} />,
    [],
  );
  const dateCell = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);
  const prefixCell = useCallback((cell) => cell.row.values.variables[0]?.prefix ?? '-', []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        alwaysShow: true,
      },
      {
        id: 'variables',
        Header: t('common.variable'),
        Footer: '',
        accessor: 'variables',
        Cell: ({ cell }) => prefixCell(cell),
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => dateCell(cell, 'created'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }) => dateCell(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'id',
        customWidth: '80px',
        Cell: ({ cell }) => actionCell(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, []);

  return (
    <>
      <Card>
        <CardHeader mb="10px">
          <Box>
            <Heading size="md">{title}</Heading>
          </Box>
          <Flex w="100%" flexDirection="row" alignItems="center">
            <Box ms="auto">
              <ColumnPicker
                columns={columns}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
                preference="provisioning.resourcesTable.hiddenColumns"
              />
              <CreateResourceModal refresh={refresh} />
              <Button
                colorScheme="gray"
                onClick={refresh}
                rightIcon={<ArrowsClockwise />}
                ml={2}
                isLoading={isFetchingCount || isFetchingResources}
              >
                {t('common.refresh')}
              </Button>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto" w="100%">
            <DataTable
              columns={columns}
              data={resources ?? []}
              isLoading={isFetchingCount || isFetchingResources}
              isManual
              hiddenColumns={hiddenColumns}
              obj={t('resources.title')}
              count={count || 0}
              setPageInfo={setPageInfo}
              fullScreen
            />
          </Box>
        </CardBody>
      </Card>
      {isEditOpen && (
        <EditResourceModal isOpen={isEditOpen} onClose={closeEdit} resource={resource} refresh={refresh} />
      )}
    </>
  );
};

ResourcesTable.propTypes = propTypes;
ResourcesTable.defaultProps = defaultProps;

export default ResourcesTable;
