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
import { useGetContactCount, useGetContacts } from 'hooks/Network/Contacts';
import CreateSubscriberModal from 'components/Tables/ContactTable/CreateContactModal';
import EditSubscriberModal from 'components/Tables/ContactTable/EditContactModal';
import EntityCell from 'components/TableCells/EntityCell';
import VenueCell from 'components/TableCells/VenueCell';
import Actions from './Actions';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const ContactsTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [contact, setContact] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const {
    data: count,
    isFetching: isFetchingCount,
    refetch: refetchCount,
  } = useGetContactCount({
    t,
    toast,
  });
  const {
    data: contacts,
    isFetching: isFetchingContacts,
    refetch: refetchContacts,
  } = useGetContacts({
    t,
    toast,
    pageInfo,
    enabled: pageInfo !== null,
    count,
  });

  const openEditModal = (newContact) => {
    setContact(newContact);
    openEdit();
  };

  const memoizedActions = useCallback(
    (cell) => <Actions cell={cell.row} refreshTable={refetchCount} key={uuid()} openEditModal={openEditModal} />,
    [],
  );
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

  const entityCell = useCallback(
    (cell) => (
      <EntityCell entityName={cell.row.original.extendedInfo?.entity?.name ?? ''} entityId={cell.row.original.entity} />
    ),
    [],
  );
  const venueCell = useCallback(
    (cell) => (
      <VenueCell venueName={cell.row.original.extendedInfo?.venue?.name ?? ''} venueId={cell.row.original.venue} />
    ),
    [],
  );

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'primaryEmail',
        Header: t('contacts.primary_email'),
        Footer: '',
        accessor: 'primaryEmail',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        hasPopover: true,
        alwaysShow: true,
      },
      {
        id: 'name',
        Header: t('contacts.identifier'),
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
        id: 'venue',
        Header: t('venues.one'),
        Footer: '',
        accessor: 'extendedInfo.venue.name',
        Cell: ({ cell }) => venueCell(cell),
        customMinWidth: '150px',
        customWidth: '150px',
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
                preference="provisioning.contactTable.hiddenColumns"
              />
              <CreateSubscriberModal refresh={refetchCount} />
              <Button
                colorScheme="gray"
                onClick={refetchCount}
                rightIcon={<ArrowsClockwise />}
                ml={2}
                isLoading={isFetchingCount || isFetchingContacts}
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
              data={contacts ?? []}
              isLoading={isFetchingCount || isFetchingContacts}
              isManual
              hiddenColumns={hiddenColumns}
              obj={t('contacts.other')}
              count={count || 0}
              setPageInfo={setPageInfo}
              fullScreen
            />
          </Box>
        </CardBody>
      </Card>
      {isEditOpen && (
        <EditSubscriberModal isOpen={isEditOpen} onClose={closeEdit} contact={contact} refresh={refetchContacts} />
      )}
    </>
  );
};

ContactsTable.propTypes = propTypes;
ContactsTable.defaultProps = defaultProps;

export default ContactsTable;
