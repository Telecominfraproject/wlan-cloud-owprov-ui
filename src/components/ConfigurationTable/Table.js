import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CButtonToolbar, CDataTable, CPopover, CButton } from '@coreui/react';
import { cilFilterSquare, cilMagnifyingGlass, cilSpreadsheet } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactTooltip from 'react-tooltip';
import { FormattedDate } from 'ucentral-libs';
import DeleteButton from './DeleteButton';

const ConfigurationTable = ({
  t,
  history,
  loading,
  configs,
  toggleInUse,
  deleteConfig,
  toggleEffects,
}) => {
  const columns = [
    { key: 'name', label: t('user.name'), _style: { width: '20%' } },
    { key: 'description', label: t('user.description'), _style: { width: '20%' } },
    { key: 'created', label: t('common.created'), _style: { width: '10%' } },
    { key: 'modified', label: t('common.modified'), _style: { width: '10%' } },
    { key: 'deviceTypes', label: t('firmware.device_types'), _style: { width: '20%' } },
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
    <CDataTable
      addTableClasses="ignore-overflow table-sm"
      items={configs ?? []}
      fields={columns}
      hover
      border
      loading={loading}
      scopedSlots={{
        name: (item) => <td className="align-middle">{item.name}</td>,
        description: (item) => <td className="align-middle">{item.description}</td>,
        deviceTypes: (item) => <td className="align-middle">{item.deviceTypes.join(', ')}</td>,
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
        actions: (item) => (
          <td className="align-middle">
            <CButtonToolbar
              role="group"
              className="justify-content-flex-end"
              style={{ width: '200px' }}
            >
              <CPopover content={t('configuration.view_in_use')}>
                <CButton
                  disabled={item.inUse.length === 0}
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  className="mx-2"
                  onClick={() => toggleInUse(item)}
                  style={{ width: '33px', height: '30px' }}
                >
                  <CIcon content={cilSpreadsheet} size="sm" />
                </CButton>
              </CPopover>
              <CPopover content={t('configuration.view_affected_devices')}>
                <CButton
                  disabled={item.inUse.length === 0}
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  className="mx-2"
                  onClick={() => toggleEffects(item)}
                  style={{ width: '33px', height: '30px' }}
                >
                  <CIcon content={cilFilterSquare} size="sm" />
                </CButton>
              </CPopover>
              <DeleteButton
                t={t}
                config={item}
                deleteConfig={deleteConfig}
                hideTooltips={hideTooltips}
              />
              <CPopover content={t('common.details')}>
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  className="mx-2"
                  onClick={() => history.push(`/configuration/${item.id}`)}
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
  );
};

ConfigurationTable.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  loading: PropTypes.bool.isRequired,
  configs: PropTypes.instanceOf(Array).isRequired,
  toggleInUse: PropTypes.func.isRequired,
  deleteConfig: PropTypes.func.isRequired,
  toggleEffects: PropTypes.func.isRequired,
};

export default ConfigurationTable;
