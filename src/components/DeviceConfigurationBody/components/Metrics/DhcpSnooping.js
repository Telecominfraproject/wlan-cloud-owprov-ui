import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationMulti } from 'ucentral-libs';

const DhcpSnooping = ({ fields, updateField }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationSectionToggler
          id="dhcp-snooping"
          label="dhcp-snooping"
          field={fields['dhcp-snooping']}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields['dhcp-snooping'].enabled}>
      <CRow>
        <CCol>
          <ConfigurationMulti
            id="dhcp-snooping.filters"
            label="filters"
            field={fields['dhcp-snooping'].filters}
            updateField={updateField}
            firstCol="3"
            secondCol="9"
            disabled={false}
          />
        </CCol>
        <CCol />
      </CRow>
    </CCollapse>
  </div>
);

DhcpSnooping.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default DhcpSnooping;
