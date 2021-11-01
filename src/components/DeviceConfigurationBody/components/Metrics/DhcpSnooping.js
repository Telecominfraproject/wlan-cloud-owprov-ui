import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationElement,
  ConfigurationSectionToggler,
  ConfigurationMulti,
} from 'ucentral-libs';

const DhcpSnooping = ({ fields, updateField, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="dhcp-snooping"
              label="dhcp-snooping"
              field={fields['dhcp-snooping']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields['dhcp-snooping'].enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationMulti
                id="dhcp-snooping.filters"
                label="filters"
                field={fields['dhcp-snooping'].filters}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={disabled}
              />
            </CCol>
          </CRow>
        </ConfigurationElement>
      </CCol>
    </CRow>
  </div>
);

DhcpSnooping.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default DhcpSnooping;
