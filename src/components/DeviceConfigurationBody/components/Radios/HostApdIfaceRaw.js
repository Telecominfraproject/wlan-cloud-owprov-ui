import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CAlert,
  CInput,
  CFormGroup,
  CCol,
  CLabel,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CPopover,
  CDataTable,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMinus, cilSave, cilX, cilPlus } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'ucentral-libs';

const testParam = (v) => v.includes('=');

const columns = [
  { key: 'value', label: 'Value', _style: { width: '99%' } },
  { key: 'remove', label: '', _style: { width: '1%' } },
];
const HostApdIfaceRaw = ({ label, value, save, firstCol, secondCol, length }) => {
  const { t } = useTranslation();
  const [show, toggle] = useToggle(false);
  const [newParam, setNewParam] = useState('');
  const [tempValue, setTempValue] = useState([]);

  const getLabel = () => {
    if (length === 0) return `Manage Parameters`;

    return `Manage Parameters (${length})`;
  };

  const remove = (v) => {
    const key = Object.keys(v)[0];
    const index = tempValue.findIndex((obj) => obj === v[key]);
    if (index > -1) {
      const newList = [...tempValue];
      newList.splice(index, 1);

      setTempValue(newList);
    }
  };

  const addParam = () => {
    const newList = [...tempValue];
    newList.push(newParam);
    setNewParam('');
    setTempValue(newList);
  };

  const onChange = (e) => setNewParam(e.target.value);

  const closeAndSave = () => {
    save(tempValue);
    toggle();
  };

  useEffect(() => {
    if (show) {
      setTempValue(value);
      setNewParam('');
    }
  }, [show]);

  return (
    <CFormGroup row className="py-1">
      <CLabel col sm={firstCol} htmlFor="name">
        {label}
      </CLabel>
      <CCol sm={secondCol} onClick={toggle}>
        <CButton color="link" className="ml-0 pl-0" onClick={toggle}>
          {getLabel()}
        </CButton>
      </CCol>
      <CModal size="lg" show={show} onClose={toggle}>
        <CModalHeader className="p-1">
          <CModalTitle className="pl-1 pt-1">{label}</CModalTitle>
          <div className="text-right">
            <CPopover content={t('common.save')}>
              <CButton color="primary" variant="outline" className="ml-2" onClick={closeAndSave}>
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
          <CAlert color="danger">
            The parameters you enter cannot be validated and may cause the radio to misbehave or
            stop functioning. Please be careful as you add these parameters
          </CAlert>
          <CInput
            className="mb-3 w-75 float-left mr-4"
            id="description"
            type="text"
            required
            value={newParam}
            onChange={onChange}
            placeholder="Enter a valid url parameter combination (example: name=john)"
          />
          <CButton
            className="float-left"
            color="primary"
            variant="outline"
            onClick={addParam}
            disabled={!testParam(newParam)}
          >
            <CIcon content={cilPlus} />
          </CButton>
          <CDataTable
            addTableClasses="ignore-overflow table-sm"
            items={tempValue.map((v) => ({ value: v }))}
            fields={columns}
            hover
            border
            scopedSlots={{
              remove: (item) => (
                <td className="align-middle text-center">
                  <CButton color="primary" variant="outline" size="sm" onClick={() => remove(item)}>
                    <CIcon content={cilMinus} />
                  </CButton>
                </td>
              ),
            }}
          />
        </CModalBody>
      </CModal>
    </CFormGroup>
  );
};

HostApdIfaceRaw.propTypes = {
  value: PropTypes.instanceOf(Array).isRequired,
  save: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  firstCol: PropTypes.string,
  secondCol: PropTypes.string,
  length: PropTypes.number.isRequired,
};

HostApdIfaceRaw.defaultProps = {
  firstCol: 6,
  secondCol: 6,
};

export default HostApdIfaceRaw;
