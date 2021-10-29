import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CInput,
  CButton,
  CPopover,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CDataTable,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMinus, cilPlus, cilSave, cilX } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useEntity } from 'ucentral-libs';
import ipRegex from 'utils/ipRegex';

const testIps = (newIp) => {
  const ip = newIp.trim();
  if (ip.length === 0) return false;

  // If this contains multiple IPs
  if (ip.includes(',')) {
    const ips = ip.split(',');
    for (let i = 0; i < ips.length; i += 1) {
      if (!ipRegex.test(ips[i])) return false;
    }
    return true;
  }

  // If this contains a range
  if (ip.includes('-')) {
    const ips = ip.split('-');
    for (let i = 0; i < ips.length; i += 1) {
      if (!ipRegex.test(ips[i])) return false;
    }
    return true;
  }

  // If it is CIDR
  if (ip.includes('/')) {
    return ipRegex.test(ip.split('/')[0]);
  }

  return ipRegex.test(ip);
};

const EntityIpModal = ({ show, toggle, ips, updateField }) => {
  const { t } = useTranslation();
  const { entity } = useEntity();
  const [newIp, setNewIp] = useState('');
  const [ipList, setIpList] = useState([]);

  const columns = [
    { key: 'ipAddress', label: t('common.ips') },
    { key: 'remove', label: '', _style: { width: '1%' } },
  ];

  const onChange = (e) => setNewIp(e.target.value);

  const addIp = () => {
    const newList = [...ipList];
    newList.push({ ipAddress: newIp });
    setIpList(newList);
    setNewIp('');
  };

  const removeIp = (v) => {
    const index = ipList.findIndex((ip) => ip.ipAddress === v);
    if (index > -1) {
      const newList = [...ipList];
      newList.splice(index, 1);

      setIpList(newList);
    }
  };

  const save = () => {
    updateField('sourceIP', { value: ipList.map((ip) => ip.ipAddress) });
    toggle();
  };

  useEffect(() => {
    if (show) {
      setNewIp('');
      setIpList(ips.map((ip) => ({ ipAddress: ip })));
    }
  }, [show]);

  return (
    <CModal size="lg" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{entity?.name}</CModalTitle>
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
        <h6>{t('entity.ip_formats')}</h6>
        <ul>
          <li>Single Address: IP</li>
          <li>List: IP,IP,IP</li>
          <li>Range: IP-IP</li>
          <li>CIDR: IP/number (example: 10.0.0.0/8)</li>
        </ul>
        <CInput
          className="mb-3 w-75 float-left mr-4"
          id="description"
          type="text"
          required
          value={newIp}
          onChange={onChange}
          placeholder={t('entity.enter_here')}
        />
        <CButton
          className="float-left"
          color="primary"
          variant="outline"
          onClick={addIp}
          disabled={!testIps(newIp)}
        >
          <CIcon content={cilPlus} />
        </CButton>
        <CDataTable
          addTableClasses="table-sm"
          border
          items={ipList}
          fields={columns}
          scopedSlots={{
            ipAddress: (item) => <td className="align-middle">{item.ipAddress}</td>,
            remove: (item) => (
              <td className="align-middle">
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  onClick={() => removeIp(item.ipAddress)}
                >
                  <CIcon content={cilMinus} />
                </CButton>
              </td>
            ),
          }}
        />
      </CModalBody>
    </CModal>
  );
};

EntityIpModal.propTypes = {
  show: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  ips: PropTypes.instanceOf(Array).isRequired,
  updateField: PropTypes.func.isRequired,
};

EntityIpModal.defaultProps = {
  show: false,
};

export default EntityIpModal;
