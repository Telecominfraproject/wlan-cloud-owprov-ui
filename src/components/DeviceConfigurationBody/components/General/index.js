import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CFormGroup, CLabel } from '@coreui/react';
import {
  ConfigurationStringField,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';
import Select from 'react-select';

const General = ({ fields, updateWithId, subFields, onSubChange }) => {
  const [activated, setActivated] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (subFields) {
      const newOptions = [];
      const newActivated = [];
      for (const [key, field] of Object.entries(subFields)) {
        if (key !== 'enabled') {
          newOptions.push({ value: key, label: key });
          if (field.enabled) newActivated.push({ value: key, label: key });
        }
      }
      setOptions(newOptions);
      setActivated(newActivated);
    }
  }, [subFields]);

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <CFormGroup row className="py-1 pb-0 mb-0">
                <h6 className="mt-1 pr-5">General Information</h6>
              </CFormGroup>
            }
            enabled
          >
            <CRow>
              <CCol xl="6" xxl="4">
                <ConfigurationStringField
                  id="name"
                  label="name"
                  field={fields.name}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Required"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationStringField
                  id="description"
                  label="description"
                  field={fields.description}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationIntField
                  id="weight"
                  label="weight"
                  field={fields.weight}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
              </CCol>
              <CCol hidden={subFields === null} xl="6" xxl="4">
                <CFormGroup row className="py-1">
                  <CLabel col sm="3" htmlFor="name">
                    Sections
                  </CLabel>
                  <CCol sm="9">
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      name="Subsystems"
                      options={options}
                      onChange={onSubChange}
                      value={activated}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </CCol>
                </CFormGroup>
              </CCol>
            </CRow>
          </ConfigurationElement>
        </CCol>
      </CRow>
    </div>
  );
};

General.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  subFields: PropTypes.instanceOf(Object),
  onSubChange: PropTypes.func,
};

General.defaultProps = {
  subFields: null,
  onSubChange: null,
};

export default General;
