import React from 'react';
import PropTypes from 'prop-types';
import { CAlert, CRow, CCol, CSwitch } from '@coreui/react';
import { useTranslation } from 'react-i18next';

const ImportChoices = ({ testResults, choices, setChoices }) => {
  const { t } = useTranslation();

  const toggleUnassign = () => setChoices({ ...choices, ...{ unassign: !choices.unassign } });

  return (
    <CRow className="py-1" hidden={testResults.assigned.length === 0}>
      <CCol>
        <CRow>
          <CCol>
            <p>{t('inventory.bulk_delete_assigned')}</p>
          </CCol>
          <CCol>
            <CSwitch
              color="primary"
              defaultChecked={choices.reassign}
              onClick={toggleUnassign}
              labelOn={t('common.yes')}
              labelOff={t('common.no')}
            />
          </CCol>
        </CRow>
        <CRow className="pt-3">
          <CCol sm="4">
            <CAlert color="danger">{t('inventory.bulk_delete_assigned_warning')}</CAlert>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  );
};

ImportChoices.propTypes = {
  testResults: PropTypes.instanceOf(Object).isRequired,
  choices: PropTypes.instanceOf(Object).isRequired,
  setChoices: PropTypes.func.isRequired,
};
export default ImportChoices;
