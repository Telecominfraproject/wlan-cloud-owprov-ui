import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationMulti,
  ConfigurationIntField,
  ConfigurationMultiWithInput,
  ConfigurationElement,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const OnlineCheck = ({ fields, updateField, updateWithId }) => {
  const { t } = useTranslation();
  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="online-check"
                label="online-check"
                field={fields['online-check']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            }
            enabled={fields['online-check'].enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationMultiWithInput
                  t={t}
                  id="online-check.ping-hosts"
                  label="ping-hosts"
                  field={fields['online-check']['ping-hosts']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
                <ConfigurationMultiWithInput
                  t={t}
                  id="online-check.download-hosts"
                  label="download-hosts"
                  field={fields['online-check']['download-hosts']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
                <ConfigurationIntField
                  id="online-check.check-interval"
                  label="check-interval"
                  field={fields['online-check']['check-interval']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
                <ConfigurationIntField
                  id="online-check.check-threshold"
                  label="check-threshold"
                  field={fields['online-check']['check-threshold']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
                <ConfigurationMulti
                  id="online-check.action"
                  label="action"
                  field={fields['online-check'].action}
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
};

OnlineCheck.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default OnlineCheck;
