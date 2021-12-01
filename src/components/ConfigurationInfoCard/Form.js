import React, { useEffect, useState } from 'react';
import {
  CForm,
  CInput,
  CLabel,
  CCol,
  CFormGroup,
  CInvalidFeedback,
  CFormText,
  CButton,
  CSwitch,
} from '@coreui/react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { SELECT_STYLES, FormattedDate } from 'ucentral-libs';

const EditConfigurationForm = ({
  t,
  disable,
  fields,
  updateField,
  updateFieldWithKey,
  editing,
  toggleInUseModal,
  deviceTypes,
  config,
}) => {
  const [typeOptions, setTypeOptions] = useState([]);
  const [chosenTypes, setChosenTypes] = useState([]);

  const parseOptions = () => {
    const options = [{ value: '*', label: 'All' }];
    const newOptions = deviceTypes.map((option) => ({
      value: option,
      label: option,
    }));
    options.push(...newOptions);
    setTypeOptions(options);

    const newChosenTypes = fields.deviceTypes.value.map((dType) => ({
      value: dType,
      label: dType === '*' ? 'All' : dType,
    }));

    setChosenTypes(newChosenTypes);
  };

  const typeOnChange = (chosenArray) => {
    const allIndex = chosenArray.findIndex((el) => el.value === '*');

    // If the All option was chosen before, we take it out of the array
    if (allIndex === 0 && chosenTypes.length > 0) {
      const newResults = chosenArray.slice(1);
      setChosenTypes(newResults);
      updateFieldWithKey('deviceTypes', {
        value: newResults.map((el) => el.value),
        error: false,
        notEmpty: true,
      });
    } else if (allIndex > 0) {
      setChosenTypes([{ value: '*', label: 'All' }]);
      updateFieldWithKey('deviceTypes', { value: ['*'], error: false, notEmpty: true });
    } else if (chosenArray.length > 0) {
      setChosenTypes(chosenArray);
      updateFieldWithKey('deviceTypes', {
        value: chosenArray.map((el) => el.value),
        error: false,
        notEmpty: true,
      });
    } else {
      setChosenTypes([]);
      updateFieldWithKey('deviceTypes', { value: [], error: false, notEmpty: true });
    }
  };

  useEffect(() => {
    parseOptions();
  }, [deviceTypes, config]);

  return (
    <CForm>
      <CFormGroup row>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
          <div>{t('user.name')}:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          {editing ? (
            <div>
              <CInput
                id="name"
                type="text"
                required
                value={fields.name.value}
                onChange={updateField}
                invalid={fields.name.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText hidden={!fields.name.error} color={fields.name.error ? 'danger' : ''}>
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.name.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
          <div>{t('user.description')}:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          {editing ? (
            <div>
              <CInput
                id="description"
                type="text"
                required
                value={fields.description.value}
                onChange={updateField}
                invalid={fields.description.error}
                disabled={disable}
                maxLength="50"
              />
              <CInvalidFeedback>{t('common.required')}</CInvalidFeedback>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.description.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
          <div>{t('configuration.device_types')}:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <Select
            isMulti
            styles={SELECT_STYLES}
            closeMenuOnSelect={false}
            name="Device Types"
            options={typeOptions}
            onChange={typeOnChange}
            value={chosenTypes}
            className={`basic-multi-select ${fields.deviceTypes.error ? 'border-danger' : ''}`}
            classNamePrefix="select"
            isDisabled={!editing}
          />
          <CFormText hidden={!fields.deviceTypes.error} color="danger">
            {t('configuration.need_device_type')}
          </CFormText>
        </CCol>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
          <div>RRM:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <div style={{ width: '120px' }}>
            <Select
              id="rrm"
              styles={SELECT_STYLES}
              value={{ value: fields.rrm.value, label: fields.rrm.value }}
              onChange={(v) => updateFieldWithKey('rrm', { value: v.value })}
              options={[
                { label: 'on', value: 'on' },
                { label: 'off', value: 'off' },
                { label: 'inherit', value: 'inherit' },
              ]}
              isDisabled={!editing}
            />
          </div>
          <CFormText color="danger" hidden={!fields.rrm.error}>
            {t('common.required')}
          </CFormText>
        </CCol>
        <CLabel col className="mb-2" md="5" lg="2" xl="2" xxl="1" htmlFor="firmwareUpgrade">
          Firmware Upgrade
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <div style={{ width: '120px' }}>
            <Select
              id="rrm"
              styles={SELECT_STYLES}
              value={{
                value: fields.firmwareUpgrade.value,
                label: fields.firmwareUpgrade.value,
              }}
              onChange={(v) => updateFieldWithKey('firmwareUpgrade', { value: v.value })}
              options={[
                { label: 'yes', value: 'yes' },
                { label: 'no', value: 'no' },
                { label: 'inherit', value: 'inherit' },
              ]}
              isDisabled={!editing}
            />
          </div>
        </CCol>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
          <div>{t('common.created')}:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <p className="mt-2 mb-0">
            <FormattedDate date={fields.created.value} />
          </p>
        </CCol>
        <CLabel col className="mb-2" md="5" lg="2" xl="2" xxl="1" htmlFor="firmwareRCOnly">
          Only Release Candidates
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <CSwitch
            id="firmwareRCOnly"
            color="primary"
            defaultChecked={fields.firmwareRCOnly.value}
            onClick={() =>
              updateFieldWithKey('firmwareRCOnly', { value: !fields.firmwareRCOnly.value })
            }
            size="lg"
            disabled={!editing || fields.firmwareUpgrade.value === 'no'}
          />
        </CCol>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
          <div>{t('common.modified')}:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <p className="mt-2 mb-0">
            <FormattedDate date={fields.modified.value} />
          </p>
        </CCol>
        <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="inUse">
          <div>{t('configuration.used_by')}:</div>
        </CLabel>
        <CCol md="7" lg="4" xl="4" xxl="5">
          <CButton
            disabled={fields.inUse.value.length === 0}
            className="ml-0 pl-0"
            color="link"
            onClick={toggleInUseModal}
          >
            {config?.parsedInUse}
          </CButton>
        </CCol>
      </CFormGroup>
    </CForm>
  );
};

EditConfigurationForm.propTypes = {
  t: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldWithKey: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  toggleInUseModal: PropTypes.func.isRequired,
  deviceTypes: PropTypes.instanceOf(Array).isRequired,
  config: PropTypes.instanceOf(Object),
};

EditConfigurationForm.defaultProps = {
  config: null,
};

export default EditConfigurationForm;
