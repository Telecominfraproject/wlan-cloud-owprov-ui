import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import ReactTooltip from 'react-tooltip';
import {
  CButton,
  CButtonToolbar,
  CCardBody,
  CDataTable,
  CCard,
  CCardHeader,
  CSelect,
  CLink,
  CPopover,
} from '@coreui/react';
import { useHistory } from 'react-router-dom';
import { cilPencil, cilPlus, cilSync } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { FormattedDate } from 'ucentral-libs';
import DeleteButton from './DeleteButton';

const VenueTable = ({
  t,
  loading,
  venues,
  venuesPerPage,
  updateVenuesPerPage,
  page,
  updatePage,
  entity,
  pageCount,
  toggleAdd,
  title,
  deleteVenue,
  refresh,
  onlyTable,
}) => {
  const history = useHistory();

  const columns = [
    { key: 'name', label: t('user.name'), _style: { width: '20%' } },
    { key: 'description', label: t('user.description'), _style: { width: '25%' } },
    { key: 'created', label: t('common.created'), _style: { width: '20%' } },
    { key: 'modified', label: t('common.modified'), _style: { width: '20%' } },
    { key: 'children', label: t('inventory.sub_venues'), _style: { width: '5%' } },
    { key: 'actions', label: t('actions.actions'), _style: { width: '1%' } },
  ];

  const hideTooltips = () => ReactTooltip.hide();

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      hideTooltips();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  return (
    <CCard className="my-0 py-0">
      <CCardHeader className="my-0 p-1 text-light" style={{ backgroundColor: '#2f3d54' }}>
        <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
          {onlyTable ? '' : title}
        </div>
        <div className="float-right">
          <CButtonToolbar role="group" className="justify-content-end">
            <CPopover content={t('inventory.add_child_venue', { entityName: entity?.name })}>
              <CButton color="info" onClick={toggleAdd} className="mx-1">
                <CIcon content={cilPlus} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.refresh')}>
              <CButton color="info" onClick={refresh} className="ml-1">
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
          </CButtonToolbar>
        </div>
      </CCardHeader>
      <CCardBody className="p-0">
        <CDataTable
          addTableClasses="ignore-overflow table-sm"
          items={venues ?? []}
          fields={columns}
          hover
          border
          loading={loading}
          scopedSlots={{
            name: (item) => (
              <td className="align-middle">
                <CLink
                  className="c-subheader-nav-link"
                  aria-current="page"
                  to={() => `/venue/${item.id}`}
                >
                  {item.name}
                </CLink>
              </td>
            ),
            description: (item) => <td className="align-middle">{item.description}</td>,
            created: (item) => (
              <td className="align-middle">
                <FormattedDate date={item.created} />
              </td>
            ),
            modified: (item) => (
              <td className="align-middle">
                <FormattedDate date={item.modified} />
              </td>
            ),
            children: (item) => <td className="align-middle">{item.children.length}</td>,
            actions: (item) => (
              <td className="text-center align-middle py-0">
                <CButtonToolbar
                  role="group"
                  className="justify-content-flex-end pl-2"
                  style={{ width: '90px' }}
                >
                  <CPopover content="Edit Tag">
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-1"
                      onClick={() => history.push(`/venue/${item.id}`)}
                      style={{ width: '33px', height: '30px' }}
                    >
                      <CIcon content={cilPencil} size="sm" />
                    </CButton>
                  </CPopover>
                  <DeleteButton
                    t={t}
                    venue={item}
                    deleteVenue={deleteVenue}
                    hideTooltips={hideTooltips}
                  />
                </CButtonToolbar>
              </td>
            ),
          }}
        />
        <div className="pl-3">
          <div className="pr-3 float-left">
            <ReactPaginate
              previousLabel="← Previous"
              nextLabel="Next →"
              pageCount={pageCount}
              onPageChange={updatePage}
              forcePage={Number(page)}
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
          <p className="float-left pr-2 pt-1">{t('common.items_per_page')}</p>
          <div style={{ width: '100px' }} className="float-left px-2">
            <CSelect
              custom
              defaultValue={venuesPerPage}
              onChange={(e) => updateVenuesPerPage(e.target.value)}
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
  );
};

VenueTable.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  venues: PropTypes.instanceOf(Array).isRequired,
  venuesPerPage: PropTypes.string.isRequired,
  updateVenuesPerPage: PropTypes.func.isRequired,
  page: PropTypes.string,
  entity: PropTypes.instanceOf(Object),
  updatePage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  toggleAdd: PropTypes.func,
  title: PropTypes.string,
  deleteVenue: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  onlyTable: PropTypes.bool,
};

VenueTable.defaultProps = {
  page: '0',
  toggleAdd: null,
  title: null,
  entity: null,
  onlyTable: false,
};

export default VenueTable;
