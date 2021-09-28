import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationElement,
  ConfigurationSectionToggler,
  ConfigurationIntField,
  ConfigurationMultiWithInput,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const AirtimePolicies = ({ fields, updateField, updateWithId }) => {
  const { t } = useTranslation();
  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="airtime-policies"
                label="airtime-policies"
                field={fields['airtime-policies']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            }
            enabled={fields['airtime-policies'].enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationMultiWithInput
                  t={t}
                  id="airtime-policies.dns-match"
                  label="dns-match"
                  field={fields['airtime-policies']['dns-match']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
                <ConfigurationIntField
                  id="airtime-policies.dns-weight"
                  label="dns-weight"
                  field={fields['airtime-policies']['dns-weight']}
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
};

AirtimePolicies.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default AirtimePolicies;
