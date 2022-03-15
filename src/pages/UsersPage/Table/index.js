import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, Flex, Heading, useDisclosure, useToast } from '@chakra-ui/react';
import { v4 as createUuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { ArrowsClockwise } from 'phosphor-react';
import { useAuth } from 'contexts/AuthProvider';
import ColumnPicker from 'components/ColumnPicker';
import useGetRequirements from 'hooks/Network/Requirements';
import { useGetUsers } from 'hooks/Network/Users';
import CreateUserModal from './CreateUserModal';
import UserActions from './UserActions';
import EditUserModal from './EditUserModal';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const UserTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();
  const [usersWithAvatars, setUsersWithAvatars] = useState([]);
  const { data: requirements } = useGetRequirements();
  const [editId, setEditId] = useState('');
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { isOpen: editOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const {
    data: users,
    refetch: refreshUsers,
    isFetching,
  } = useGetUsers({ t, toast, setUsersWithAvatars });

  const openEditModal = (userId) => {
    setEditId(userId);
    openEdit();
  };

  const memoizedActions = useCallback(
    (cell) => (
      <UserActions
        cell={cell.row}
        refreshTable={refreshUsers}
        key={createUuid()}
        openEdit={openEditModal}
      />
    ),
    [],
  );
  const memoizedDate = useCallback(
    (cell) => <FormattedDate date={cell.row.values.lastLogin} key={createUuid()} />,
    [],
  );

  const memoizedAvatar = useCallback(
    (cell) => <Avatar name={cell.row.values.name} src={cell.row.original.avatar} />,
    [],
  );

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'avatar',
        Header: t('account.avatar'),
        Footer: '',
        accessor: 'avatar',
        customWidth: '32px',
        Cell: ({ cell }) => memoizedAvatar(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
      {
        id: 'email',
        Header: t('users.login_id'),
        Footer: '',
        accessor: 'email',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        hasPopover: true,
        alwaysShow: true,
      },
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
        id: 'userRole',
        Header: t('users.role'),
        Footer: '',
        accessor: 'userRole',
        customMinWidth: '80px',
        customWidth: '80px',
      },
      {
        id: 'lastLogin',
        Header: t('users.last_login'),
        Footer: '',
        accessor: 'lastLogin',
        Cell: ({ cell }) => memoizedDate(cell, 'lastLogin'),
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
    ];
    if (user?.userRole !== 'csr')
      baseColumns.push({
        id: 'user',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => memoizedActions(cell),
        disableSortBy: true,
        alwaysShow: true,
      });

    return baseColumns;
  }, [user]);

  const showUsers = () => {
    if (usersWithAvatars.length > 0) return usersWithAvatars;
    return users?.users ?? [];
  };

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
                preference="provisioning.userTable.hiddenColumns"
              />
              <CreateUserModal requirements={requirements} refreshUsers={refreshUsers} />
              <Button
                colorScheme="gray"
                onClick={refreshUsers}
                rightIcon={<ArrowsClockwise />}
                ml={2}
                isLoading={isFetching}
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
              data={showUsers()}
              isLoading={isFetching}
              obj={t('users.title')}
              hiddenColumns={hiddenColumns}
              fullScreen
            />
          </Box>
        </CardBody>
      </Card>
      <EditUserModal
        isOpen={editOpen}
        onClose={closeEdit}
        userId={editId}
        requirements={requirements}
        refreshUsers={refreshUsers}
      />
    </>
  );
};

UserTable.propTypes = propTypes;
UserTable.defaultProps = defaultProps;

export default UserTable;
