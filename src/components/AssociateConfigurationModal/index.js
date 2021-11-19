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
  CButtonToolbar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilX, cilSave, cilMinus, cilArrowTop, cilArrowBottom } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast, FormattedDate } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';

const AssociateConfigurationModal = ({ show, toggle, defaultConfigs, updateConfiguration }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedConfigs, setSelectedConfigs] = useState([]);

  const getPartialConfigs = async (offset) => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations?limit=500&offset=${offset}`, { headers })
      .then((response) => response.data.configurations)
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

  const addConfig = (config) => setSelectedConfigs([...selectedConfigs, config]);

  const removeConfig = (index) => {
    const newConfigs = [...selectedConfigs];
    newConfigs.splice(index, 1);
    setSelectedConfigs(newConfigs);
  };

  const moveUp = (index) => {
    const newUp = selectedConfigs[index];
    const newConfigs = [...selectedConfigs];
    newConfigs[index] = newConfigs[index - 1];
    newConfigs[index - 1] = newUp;
    setSelectedConfigs(newConfigs);
  };

  const moveDown = (index) => {
    const newDown = selectedConfigs[index];
    const newConfigs = [...selectedConfigs];
    newConfigs[index] = newConfigs[index + 1];
    newConfigs[index + 1] = newDown;
    setSelectedConfigs(newConfigs);
  };

  const save = () => updateConfiguration(selectedConfigs);

  const getConfigList = async () => {
    setLoading(true);

    const allConfigs = [];
    let continueGetting = true;
    let i = 0;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newConfigs = await getPartialConfigs(i);
      if (newConfigs === null || newConfigs.length === 0) continueGetting = false;
      allConfigs.push(...newConfigs);
      i += 500;
    }
    const sortedFirmware = allConfigs.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });
    setConfigs(sortedFirmware);

    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      setSelectedConfigs(defaultConfigs);
      setFilter('');
      getConfigList();
    }
  }, [show]);

  return (
    <CModal show={show} onClose={toggle} size="xl">
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('configuration.title')}</CModalTitle>
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
            <b>Associated Configs:</b>
          </CCol>
        </CRow>
        <div className="overflow-auto" style={{ height: '300px' }}>
          <CDataTable
            addTableClasses="table-sm"
            items={selectedConfigs}
            fields={[
              { key: 'name', label: t('user.name'), _style: { width: '20%' }, filter: false },
              { key: 'description', label: t('user.description'), _style: { width: '50%' } },
              { key: 'actions', label: '', _style: { width: '1%' }, filter: false },
            ]}
            loading={loading}
            hover
            border
            scopedSlots={{
              value: (item) => (
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
              uuid: (item) => (
                <td>
                  <FormattedDate date={item.created} />
                </td>
              ),
              actions: (item, index) => (
                <td>
                  <CButtonToolbar
                    role="group"
                    className="justify-content-flex-end pl-2"
                    style={{ width: '150px' }}
                  >
                    <CPopover content={t('entity.higher_priority')}>
                      <CButton
                        size="sm"
                        className="mx-1"
                        disabled={index === 0}
                        color="primary"
                        variant="outline"
                        onClick={() => moveUp(index)}
                      >
                        <CIcon content={cilArrowTop} />
                      </CButton>
                    </CPopover>
                    <CPopover content={t('entity.lower_priority')}>
                      <CButton
                        size="sm"
                        className="mx-1"
                        disabled={index === selectedConfigs.length - 1}
                        color="primary"
                        variant="outline"
                        onClick={() => moveDown(index)}
                      >
                        <CIcon content={cilArrowBottom} />
                      </CButton>
                    </CPopover>
                    <CPopover content={t('configuration.select_configuration')}>
                      <CButton
                        size="sm"
                        className="mx-1"
                        color="primary"
                        variant="outline"
                        onClick={() => removeConfig(index)}
                      >
                        <CIcon content={cilMinus} />
                      </CButton>
                    </CPopover>
                  </CButtonToolbar>
                </td>
              ),
            }}
          />
        </div>
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
        <div className="overflow-auto" style={{ height: '300px' }}>
          <CDataTable
            addTableClasses="table-sm"
            items={configs.filter((c) => selectedConfigs.findIndex((s) => s.id === c.id) === -1)}
            fields={[
              { key: 'name', label: t('user.name'), _style: { width: '20%' }, filter: false },
              { key: 'description', label: t('user.description'), _style: { width: '50%' } },
              {
                key: 'created',
                label: t('common.created'),
                _style: { width: '20%' },
                filter: false,
              },
              {
                key: 'modified',
                label: t('common.modified'),
                _style: { width: '20%' },
                filter: false,
              },
              { key: 'actions', label: '', _style: { width: '1%' }, filter: false },
            ]}
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
              modified: (item) => (
                <td>
                  <FormattedDate date={item.modified} />
                </td>
              ),
              actions: (item) => (
                <td>
                  <CPopover content={t('configuration.select_configuration')}>
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      onClick={() => addConfig(item)}
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

AssociateConfigurationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  defaultConfigs: PropTypes.instanceOf(Array).isRequired,
  updateConfiguration: PropTypes.func.isRequired,
};
export default AssociateConfigurationModal;
