import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationMulti,
  ConfigurationStringField,
  ConfigurationElement,
} from 'ucentral-libs';

const OpenFlow = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="open-flow"
              label="open-flow"
              field={fields['open-flow']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          }
          enabled={fields['open-flow'].enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="open-flow.controller"
                label="controller"
                field={fields['open-flow'].controller}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationMulti
                id="open-flow.mode"
                label="mode"
                field={fields['open-flow'].mode}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
              <ConfigurationStringField
                id="open-flow.ca-certificate"
                label="ca-certificate"
                field={fields['open-flow']['ca-certificate']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationStringField
                id="open-flow.ssl-certificate"
                label="ssl-certificate"
                field={fields['open-flow']['ssl-certificate']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationStringField
                id="open-flow.private-key"
                label="private-key"
                field={fields['open-flow']['private-key']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
            </CCol>
          </CRow>
        </ConfigurationElement>
      </CCol>
    </CRow>
  </div>
);

OpenFlow.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default OpenFlow;
