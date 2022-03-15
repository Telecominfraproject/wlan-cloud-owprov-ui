import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, useDisclosure, useToast } from '@chakra-ui/react';
import { v4 as createUuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { ArrowsClockwise } from 'phosphor-react';
import ColumnPicker from 'components/ColumnPicker';
import { useGetLocationCount, useGetLocations } from 'hooks/Network/Locations';
import CreateLocationModal from 'components/Tables/LocationTable/CreateLocationModal';
import EditLocationModal from 'components/Tables/LocationTable/EditLocationModal';
import EntityCell from 'components/TableCells/EntityCell';
import Actions from './Actions';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const LocationsTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [location, setLocation] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const {
    data: count,
    isFetching: isFetchingCount,
    refetch: refetchCount,
  } = useGetLocationCount({
    t,
    toast,
  });
  const {
    data: locations,
    isFetching: isFetchingLocations,
    refetch: refetchLocations,
  } = useGetLocations({
    t,
    toast,
    pageInfo,
    enabled: pageInfo !== null,
    count,
  });

  const openEditModal = (newLocation) => {
    setLocation(newLocation);
    openEdit();
  };

  const memoizedActions = useCallback(
    (cell) => (
      <Actions
        cell={cell.row}
        refreshTable={refetchCount}
        key={createUuid()}
        openEditModal={openEditModal}
      />
    ),
    [],
  );
  const memoizedDate = useCallback(
    (cell, key) => <FormattedDate date={cell.row.values[key]} key={createUuid()} />,
    [],
  );
  const entityCell = useCallback(
    (cell) => (
      <EntityCell
        entityName={cell.row.original.extendedInfo?.entity?.name ?? ''}
        entityId={cell.row.original.entity}
      />
    ),
    [],
  );

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
      },
      {
        id: 'entity',
        Header: t('entities.entity'),
        Footer: '',
        accessor: 'extendedInfo.entity.name',
        Cell: ({ cell }) => entityCell(cell),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'country',
        Header: t('locations.country'),
        Footer: '',
        accessor: 'country',
        customWidth: '100px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }) => memoizedDate(cell, 'modified'),
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
        id: 'user',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => memoizedActions(cell),
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
                preference="provisioning.locationTable.hiddenColumns"
              />
              <CreateLocationModal refresh={refetchCount} />
              <Button
                colorScheme="gray"
                onClick={refetchCount}
                rightIcon={<ArrowsClockwise />}
                ml={2}
                isLoading={isFetchingCount || isFetchingLocations}
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
              data={locations ?? []}
              isLoading={isFetchingCount || isFetchingLocations}
              isManual
              hiddenColumns={hiddenColumns}
              obj={t('locations.other')}
              count={count || 0}
              setPageInfo={setPageInfo}
              fullScreen
            />
          </Box>
        </CardBody>
      </Card>
      {isEditOpen && (
        <EditLocationModal
          isOpen={isEditOpen}
          onClose={closeEdit}
          location={location}
          refresh={refetchLocations}
        />
      )}
    </>
  );
};

LocationsTable.propTypes = propTypes;
LocationsTable.defaultProps = defaultProps;

export default LocationsTable;
