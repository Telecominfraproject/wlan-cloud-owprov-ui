import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CSwitch } from '@coreui/react';
import { useTranslation } from 'react-i18next';

const ImportChoices = ({ testResults, choices, setChoices }) => {
  const { t } = useTranslation();

  const toggleUnassigned = () =>
    setChoices({ ...choices, ...{ assignUnassigned: !choices.assignUnassigned } });

  const toggleReassign = () => setChoices({ ...choices, ...{ reassign: !choices.reassign } });

  return (
    <div>
      <CRow className="py-2" hidden={testResults.foundNotAssigned.length === 0}>
        <CCol>
          <CRow>
            <CCol>
              <p>{t('inventory.import_existing_devices_explanation')}</p>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="4">
              <p>{t('inventory.import_existing_devices')}</p>
            </CCol>
            <CCol>
              <CSwitch
                color="primary"
                defaultChecked={choices.assignUnassigned}
                onClick={toggleUnassigned}
                labelOn={t('common.yes')}
                labelOff={t('common.no')}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="py-2" hidden={testResults.foundAssigned.length === 0}>
        <CCol>
          <CRow>
            <CCol>
              <p>{t('inventory.import_assigned_devices_explanation')}</p>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="4">
              <p>{t('inventory.import_assigned_devices')}</p>
            </CCol>
            <CCol>
              <CSwitch
                color="primary"
                defaultChecked={choices.reassign}
                onClick={toggleReassign}
                labelOn={t('common.yes')}
                labelOff={t('common.no')}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </div>
  );
};

ImportChoices.propTypes = {
  testResults: PropTypes.instanceOf(Object).isRequired,
  choices: PropTypes.instanceOf(Object).isRequired,
  setChoices: PropTypes.func.isRequired,
};
export default ImportChoices;
