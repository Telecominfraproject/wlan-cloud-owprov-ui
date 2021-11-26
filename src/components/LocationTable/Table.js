import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CButton, CDataTable, CLink, CPopover, CButtonToolbar } from '@coreui/react';
import { cilMagnifyingGlass, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactTooltip from 'react-tooltip';
import { FormattedDate } from 'ucentral-libs';
import DeleteButton from './DeleteButton';

const LocationTable = ({
  t,
  loading,
  entity,
  filterOnEntity,
  locations,
  assignToEntity,
  toggleEditModal,
  deleteLocation,
  perPageSwitcher,
  pageSwitcher,
}) => {
  const columns = filterOnEntity
    ? [
        { key: 'name', label: t('user.name'), _style: { width: '10%' } },
        { key: 'description', label: t('user.description'), _style: { width: '20%' } },
        { key: 'country', label: t('location.country'), _style: { width: '10%' } },
        { key: 'modified', label: t('common.created'), _style: { width: '10%' } },
        { key: 'actions', label: t('actions.actions'), _style: { width: '1%' } },
      ]
    : [
        { key: 'name', label: t('user.name'), _style: { width: '10%' } },
        { key: 'description', label: t('user.description'), _style: { width: '20%' } },
        { key: 'country', label: t('location.country'), _style: { width: '10%' } },
        { key: 'entity', label: t('entity.entity'), _style: { width: '10%' } },
        { key: 'modified', label: t('common.modified'), _style: { width: '12%' } },
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
    <>
      <CDataTable
        addTableClasses="ignore-overflow table-sm"
        items={locations}
        fields={columns}
        hover
        border
        loading={loading}
        scopedSlots={{
          name: (item) => <td className="align-middle">{item.name}</td>,
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
          description: (item) => <td className="align-middle">{item.description}</td>,
          entity: (item) => (
            <td className="align-middle">
              {filterOnEntity ? (
                item.entity
              ) : (
                <CLink
                  className="c-subheader-nav-link"
                  aria-current="page"
                  to={() => `/entity/${item.entity}`}
                >
                  {item.extendedInfo?.entity?.name ?? item.entity}
                </CLink>
              )}
            </td>
          ),
          actions: (item) => (
            <td className="text-center align-middle py-0">
              <CButtonToolbar
                role="group"
                className="justify-content-flex-end"
                style={{ width: '125px' }}
              >
                <CPopover content={t('inventory.assign_ent_ven')}>
                  <div>
                    <CButton
                      disabled={entity === null || filterOnEntity}
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mx-1"
                      onClick={() => assignToEntity(item.id)}
                      style={{ width: '33px', height: '30px' }}
                    >
                      <CIcon content={cilPlus} />
                    </CButton>
                  </div>
                </CPopover>
                <DeleteButton
                  t={t}
                  location={item}
                  deleteLocation={deleteLocation}
                  hideTooltips={hideTooltips}
                />
                <CPopover content={t('common.details')}>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mx-1"
                    onClick={() => toggleEditModal(item.id)}
                    style={{ width: '33px', height: '30px' }}
                  >
                    <CIcon content={cilMagnifyingGlass} size="sm" />
                  </CButton>
                </CPopover>
              </CButtonToolbar>
            </td>
          ),
        }}
      />
      <div className="pl-3">
        {pageSwitcher}
        <p className="float-left pr-2 pt-1">{t('common.items_per_page')}</p>
        {perPageSwitcher}
      </div>
    </>
  );
};

LocationTable.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  entity: PropTypes.instanceOf(Object),
  filterOnEntity: PropTypes.bool,
  locations: PropTypes.instanceOf(Array).isRequired,
  assignToEntity: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  deleteLocation: PropTypes.func.isRequired,
  perPageSwitcher: PropTypes.node.isRequired,
  pageSwitcher: PropTypes.node.isRequired,
};

LocationTable.defaultProps = {
  filterOnEntity: false,
  entity: null,
};

export default LocationTable;
