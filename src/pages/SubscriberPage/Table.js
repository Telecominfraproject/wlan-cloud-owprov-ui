import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CPopover,
  CSelect,
  CButtonToolbar,
} from '@coreui/react';
import { cilBan, cilCheckCircle, cilPlus, cilSearch, cilSync, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { FormattedDate } from 'ucentral-libs';

const SubscriberTable = ({
  loading,
  users,
  usersPerPage,
  setUsersPerPage,
  pageCount,
  currentPage,
  setPage,
  toggleCreate,
  toggleDelete,
  toggleEdit,
  refreshUsers,
}) => {
  const { t } = useTranslation();

  const getValidatedIcon = (validated) => {
    const color = validated ? 'success' : 'secondary';
    return <CIcon content={validated ? cilCheckCircle : cilBan} color={color} size="lg" />;
  };

  const fields = [
    { key: 'email', label: t('user.login_id'), _style: { width: '10%' } },
    { key: 'name', label: t('user.name'), _style: { width: '10%' } },
    { key: 'lastLogin', label: t('user.last_login'), _style: { width: '10%' } },
    { key: 'validated', label: t('user.validated'), _style: { width: '5%' } },
    { key: 'description', label: t('user.description') },
    {
      key: 'actions',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false,
    },
  ];

  return (
    <div>
      <CCard className="my-0 py-0">
        <CCardHeader className="dark-header">
          <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
            {t('subscriber.subscribers')}
          </div>
          <div className="d-flex flex-row-reverse">
            <div className="pl-2">
              <CPopover content={t('common.refresh')}>
                <CButton onClick={refreshUsers} color="info">
                  <CIcon content={cilSync} />
                </CButton>
              </CPopover>
            </div>
            <div className="pl-2">
              <CPopover content={t('common.create')}>
                <CButton color="info" onClick={toggleCreate} block>
                  <CIcon content={cilPlus} />
                </CButton>
              </CPopover>
            </div>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <CDataTable
            addTableClasses="table-sm"
            items={users}
            fields={fields}
            loading={loading}
            hover
            border
            scopedSlots={{
              email: (item) => <td className=" align-middle">{item.email}</td>,
              name: (item) => (
                <CPopover content={item.name} placement="top">
                  <td className="align-middle">
                    <div style={{ width: 'calc(10vw)' }} className="text-truncate align-middle">
                      {item.name}
                    </div>
                  </td>
                </CPopover>
              ),
              lastLogin: (item) => (
                <td className="align-middle">
                  {item.lastLogin ? <FormattedDate date={item.lastLogin} /> : ''}
                </td>
              ),
              validated: (item) => (
                <td className="text-center align-middle">
                  <CPopover
                    content={item.validated ? t('user.validated') : t('user.not_validated')}
                  >
                    {getValidatedIcon(item.validated)}
                  </CPopover>
                </td>
              ),
              description: (item) => (
                <td className="align-middle">
                  <CPopover
                    content={item.description ? item.description : t('common.na')}
                    placement="top"
                  >
                    <div style={{ width: 'calc(20vw)' }} className="text-truncate align-middle">
                      {item.description}
                    </div>
                  </CPopover>
                </td>
              ),
              actions: (item) => (
                <td className="text-center align-middle">
                  <CButtonToolbar
                    role="group"
                    className="justify-content-center"
                    style={{ width: '100px' }}
                  >
                    <CPopover content={t('common.details')}>
                      <CButton
                        className="mx-1"
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => toggleEdit(item.id)}
                      >
                        <CIcon content={cilSearch} size="sm" />
                      </CButton>
                    </CPopover>
                    <CPopover content={t('common.delete')}>
                      <CButton
                        className="mx-1"
                        onClick={() => toggleDelete(item)}
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                      >
                        <CIcon content={cilTrash} size="sm" />
                      </CButton>
                    </CPopover>
                  </CButtonToolbar>
                </td>
              ),
            }}
          />
          <div className="d-flex flex-row pl-3">
            <div className="pr-3">
              <ReactPaginate
                previousLabel="← Previous"
                nextLabel="Next →"
                pageCount={pageCount}
                onPageChange={setPage}
                forcePage={currentPage}
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
              />
            </div>
            <p className="pr-2 mt-1">{t('common.items_per_page')}</p>
            <div style={{ width: '100px' }} className="px-2">
              <CSelect
                custom
                defaultValue={usersPerPage}
                onChange={(e) => setUsersPerPage(e.target.value)}
                disabled={loading}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </CSelect>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

SubscriberTable.propTypes = {
  users: PropTypes.arrayOf(Object).isRequired,
  loading: PropTypes.bool.isRequired,
  usersPerPage: PropTypes.string.isRequired,
  setUsersPerPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number,
  setPage: PropTypes.func.isRequired,
  toggleCreate: PropTypes.func.isRequired,
  toggleDelete: PropTypes.func.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  refreshUsers: PropTypes.func.isRequired,
};

SubscriberTable.defaultProps = {
  currentPage: 0,
};

export default React.memo(SubscriberTable);
