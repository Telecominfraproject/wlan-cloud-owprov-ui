import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CRow,
  CCol,
  CInput,
  CPopover,
  CLink,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilX, cilSave } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast, FormattedDate } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';

const AssociateVenueEntityModal = ({ show, toggle, updateConfiguration }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [venues, setVenues] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState({ value: '', uuid: '' });

  const getPartial = async (type, offset) => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/${type}?limit=500&offset=${offset}`, { headers })
      .then((response) => response.data.entities ?? response.data.venues)
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.general_error'),
          color: 'danger',
          autohide: true,
        });
        return [];
      });
  };

  const updateConfig = (type, value, uuid) => setSelected({ type, value, uuid });

  const save = () => updateConfiguration(selected);

  const getType = async (type) => {
    setLoading(true);

    const allTypes = [];
    let continueGetting = true;
    let i = 0;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newStuff = await getPartial(type, i);
      if (newStuff === null || newStuff.length === 0) continueGetting = false;
      allTypes.push(...newStuff);
      i += 500;
    }
    const sorted = allTypes.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });

    if (type === 'entity') setEntities(sorted);
    else setVenues(sorted);

    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      setFilter('');
      getType('entity');
      getType('venue');
    }
  }, [show]);

  const fields = [
    { key: 'created', label: t('common.created'), _style: { width: '20%' }, filter: false },
    { key: 'name', label: t('user.name'), _style: { width: '25%' }, filter: false },
    { key: 'description', label: t('user.description'), _style: { width: '50%' } },
    { key: 'actions', label: '', _style: { width: '15%' }, filter: false },
  ];

  return (
    <CModal show={show} onClose={toggle} size="xl">
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('inventory.assign_to_entity')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={save}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <b>
              {selected?.type === 'venue'
                ? t('entity.currently_selected_venue', { config: selected.value })
                : t('entity.currently_selected_entity', { config: selected.value })}
            </b>
            <CButton
              id=""
              className="ml-3"
              color="danger"
              variant="outline"
              onClick={() => updateConfig('', '')}
            >
              {t('common.clear')}
            </CButton>
          </CCol>
        </CRow>
        <CRow className="my-4">
          <CCol sm="12" md="7" lg="5">
            <CInput
              type="text"
              placeholder="Search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </CCol>
          <CCol />
        </CRow>
        <h5>{t('entity.entities')}</h5>
        <div className="overflow-auto border mb-4" style={{ height: '300px' }}>
          <CDataTable
            addTableClasses="table-sm"
            items={entities}
            fields={fields}
            loading={loading}
            hover
            tableFilterValue={filter}
            border
            scopedSlots={{
              name: (item) => (
                <td>
                  <CLink
                    className="c-subheader-nav-link"
                    aria-current="page"
                    to={() => `/configuration/${item.id}`}
                  >
                    {item.name}
                  </CLink>
                </td>
              ),
              created: (item) => (
                <td>
                  <FormattedDate date={item.created} />
                </td>
              ),
              actions: (item) => (
                <td>
                  <CPopover content={t('configuration.select_configuration')}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => updateConfig('entity', item.name, item.id)}
                    >
                      <CIcon content={cilPlus} />
                    </CButton>
                  </CPopover>
                </td>
              ),
            }}
          />
        </div>
        <h5>{t('entity.venues')}</h5>
        <div className="overflow-auto border" style={{ height: '300px' }}>
          <CDataTable
            addTableClasses="table-sm"
            items={venues}
            fields={fields}
            loading={loading}
            hover
            tableFilterValue={filter}
            border
            scopedSlots={{
              name: (item) => (
                <td>
                  <CLink
                    className="c-subheader-nav-link"
                    aria-current="page"
                    to={() => `/configuration/${item.id}`}
                  >
                    {item.name}
                  </CLink>
                </td>
              ),
              created: (item) => (
                <td>
                  <FormattedDate date={item.created} />
                </td>
              ),
              actions: (item) => (
                <td>
                  <CPopover content={t('configuration.select_configuration')}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => updateConfig('venue', item.name, item.id)}
                    >
                      <CIcon content={cilPlus} />
                    </CButton>
                  </CPopover>
                </td>
              ),
            }}
          />
        </div>
      </CModalBody>
    </CModal>
  );
};

AssociateVenueEntityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  updateConfiguration: PropTypes.func.isRequired,
};
export default AssociateVenueEntityModal;
