import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationMulti,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const Statistics = ({ fields, updateWithId, updateField }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="statistics"
              label="statistics"
              field={fields.statistics}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          }
          enabled={fields.statistics.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationIntField
                id="statistics.interval"
                label="interval"
                field={fields.statistics.interval}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <ConfigurationMulti
                id="statistics.types"
                label="types"
                field={fields.statistics.types}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            </CCol>
          </CRow>
        </ConfigurationElement>
      </CCol>
    </CRow>
  </div>
);

Statistics.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Statistics;
