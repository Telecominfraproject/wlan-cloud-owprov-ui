import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getItem, setItem } from 'utils/localStorageHelper';
import axiosInstance from 'utils/axiosInstance';
import { useAuth, useToast, DeleteModal } from 'ucentral-libs';
import Table from './Table';
import EditSubscriberModal from './EditSubscriberModal';
import CreateSubscriberModal from './CreateSubscriberModal';

const SubscriberPage = () => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [page, setPage] = useState({ selected: 0 });
  const [users, setUsers] = useState([]);
  const [usersToDisplay, setUsersToDisplay] = useState([]);
  const [userToEdit, setUserToEdit] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [usersPerPage, setUsersPerPage] = useState(getItem('subscribersPerPage') || '10');
  const [policies, setPolicies] = useState({
    passwordPolicy: '',
    passwordPattern: '',
    accessPolicy: '',
  });

  const toggleDeleteModal = (user) => {
    if (!showDeleteModal) {
      setUserToDelete(user);
      setShowDeleteModal(true);
    } else {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const getPasswordPolicy = () => {
    axiosInstance
      .post(`${endpoints.owsec}/api/v1/suboauth2?requirements=true`, {})
      .then((response) => {
        const newPolicies = response.data;
        newPolicies.accessPolicy = `${endpoints.owsec}${newPolicies.accessPolicy}`;
        newPolicies.passwordPolicy = `${endpoints.owsec}${newPolicies.passwordPolicy}`;
        setPolicies(response.data);
      })
      .catch(() => {});
  };

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const toggleEditModal = (userId) => {
    if (userId) setUserToEdit(userId);
    setShowEditModal(!showEditModal);
  };

  const getUsers = () => {
    setLoading(true);

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owsec}/api/v1/subusers?idOnly=true`, {
        headers,
      })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('subscriber.error_fetching', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
        setLoading(false);
      });
  };

  const displayUsers = async () => {
    setLoading(true);

    const startIndex = page.selected * usersPerPage;
    const endIndex = parseInt(startIndex, 10) + parseInt(usersPerPage, 10);
    const idsToGet = users
      .slice(startIndex, endIndex)
      .map((x) => encodeURIComponent(x))
      .join(',');

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owsec}/api/v1/subusers?select=${idsToGet}`, {
        headers,
      })
      .then((response) => {
        setUsersToDisplay(response.data.users);
        setLoading(false);
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('user.error_fetching', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
        setLoading(false);
      });
  };

  const deleteUser = (userId) => {
    setDeleteLoading(true);

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .delete(`${endpoints.owsec}/api/v1/subuser/${userId}`, {
        headers,
      })
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('subscriber.success_delete'),
          color: 'success',
          autohide: true,
        });
        getUsers();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('subscriber.error_delete', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const updateUsersPerPage = (value) => {
    setItem('subscribersPerPage', value);
    setUsersPerPage(value);
  };

  useEffect(() => {
    if (users.length > 0) {
      displayUsers();
    } else {
      setUsersToDisplay([]);
      setLoading(false);
    }
  }, [users, usersPerPage, page]);

  useEffect(() => {
    getUsers();
    getPasswordPolicy();
  }, []);

  useEffect(() => {
    if (users !== []) {
      const count = Math.ceil(users.length / usersPerPage);
      setPageCount(count);
    }
  }, [usersPerPage, users]);

  return (
    <div>
      <Table
        t={t}
        users={usersToDisplay.sort((a, b) => a.email > b.email)}
        loading={loading}
        usersPerPage={usersPerPage}
        setUsersPerPage={updateUsersPerPage}
        pageCount={pageCount}
        currentPage={page.selected}
        setPage={setPage}
        deleteUser={deleteUser}
        deleteLoading={deleteLoading}
        toggleCreate={toggleCreateModal}
        toggleEdit={toggleEditModal}
        toggleDelete={toggleDeleteModal}
        refreshUsers={getUsers}
      />
      {showEditModal && (
        <EditSubscriberModal
          show={showEditModal}
          toggle={toggleEditModal}
          userId={userToEdit}
          getUsers={getUsers}
          policies={policies}
        />
      )}
      {showCreateModal && (
        <CreateSubscriberModal
          show={showCreateModal}
          toggle={toggleCreateModal}
          getUsers={getUsers}
          policies={policies}
        />
      )}
      <DeleteModal
        t={t}
        show={showDeleteModal}
        toggleShow={toggleDeleteModal}
        deleteRequest={deleteUser}
        idToDelete={userToDelete?.Id}
        deleteLoading={deleteLoading}
        title={`Delete Subscriber ${userToDelete?.email}`}
        explanation=""
        warning={t('user.delete_warning')}
      />
    </div>
  );
};

export default SubscriberPage;
