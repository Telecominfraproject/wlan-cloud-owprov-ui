/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  CRow,
  CCol,
  CButton,
  CPopover,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useToggle } from 'ucentral-libs';
import { cilX, cilTrash } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { RADIOS_FORM } from 'components/DeviceConfigurationBody/constants';
import General from '../General';
import SingleRadio from './SingleRadio';

const bands = ['2G', '5G-lower', '5G-upper', '5G', '6G'];

const Radios = ({
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
  setFields,
  disabled,
}) => {
  const { t } = useTranslation();
  const [show, toggle] = useToggle(false);
  const [availableBands, setAvailableBands] = useState(bands);

  const toggleModal = () => {
    const createdBands = fields.radios ? fields.radios.map((r) => r.band.value) : [];
    const newAvailableBands = [];
    bands.forEach((b) => {
      if (!createdBands.includes(b)) newAvailableBands.push(b);
    });
    setAvailableBands(newAvailableBands);
    toggle();
  };

  const deleteRadio = (index) => {
    const newArray = fields.radios;
    newArray.splice(index, 1);
    const newRadios = { radios: newArray };
    setFields(newRadios, true);
  };

  const addRadio = (e) => {
    const newForm = {
      ...RADIOS_FORM,
      ...{
        band: {
          type: 'select',
          value: e.target.id,
          error: false,
          required: true,
          options: ['2G', '5G', '5G-lower', '5G-upper', '6G'],
        },
      },
    };
    const newArray = fields.radios ? [...fields.radios, newForm] : [newForm];
    const newRadios = { radios: newArray };
    setFields(newRadios, true);
    toggle();
  };

  return (
    <div className="px-4">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Radios</h5>
          <div className="float-right">
            <CPopover content={t('common.delete')}>
              <CButton
                color="primary"
                variant="outline"
                onClick={deleteConfig}
                className="ml-1"
                disabled={disabled}
              >
                <CIcon content={cilTrash} />
              </CButton>
            </CPopover>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <General fields={baseFields} updateWithId={updateBaseWithId} disabled={disabled} />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          {fields.radios?.map((radio, index) => (
            <SingleRadio
              key={index}
              fields={fields}
              radio={radio}
              index={index}
              updateWithId={updateWithId}
              updateField={updateField}
              deleteRadio={deleteRadio}
              disabled={disabled}
            />
          ))}
        </CCol>
      </CRow>
      <CRow>
        <CCol className="pb-3">
          <CButton color="primary" block onClick={toggleModal} disabled={disabled}>
            {t('configuration.add_radio')}
          </CButton>
        </CCol>
      </CRow>
      <CModal show={show} onClose={toggle}>
        <CModalHeader className="p-1">
          <CModalTitle className="pl-1 pt-1">{t('configuration.add_radio')}</CModalTitle>
          <div className="text-right">
            <CPopover content={t('common.close')}>
              <CButton
                color="primary"
                variant="outline"
                className="ml-2"
                onClick={toggle}
                disabled={disabled}
              >
                <CIcon content={cilX} />
              </CButton>
            </CPopover>
          </div>
        </CModalHeader>
        <CModalBody>
          <CRow className="pb-4">
            <CCol>{t('configuration.choose_radio_band')}</CCol>
          </CRow>
          <CRow className="py-1">
            <CCol>
              <CButton
                block
                id="2G"
                color="primary"
                disabled={!availableBands.includes('2G')}
                onClick={addRadio}
              >
                2G
              </CButton>
            </CCol>
            <CCol>
              <CButton
                block
                id="5G"
                color="primary"
                disabled={!availableBands.includes('5G')}
                onClick={addRadio}
              >
                5G
              </CButton>
              <CButton
                block
                id="5G-lower"
                color="primary"
                disabled={!availableBands.includes('5G-lower')}
                onClick={addRadio}
              >
                5G-lower
              </CButton>
              <CButton
                block
                id="5G-upper"
                color="primary"
                disabled={!availableBands.includes('5G-upper')}
                onClick={addRadio}
              >
                5G-upper
              </CButton>
            </CCol>
            <CCol>
              <CButton
                block
                id="6G"
                color="primary"
                disabled={!availableBands.includes('6G')}
                onClick={addRadio}
              >
                6G
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </div>
  );
};

Radios.propTypes = {
  deleteConfig: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Radios;
