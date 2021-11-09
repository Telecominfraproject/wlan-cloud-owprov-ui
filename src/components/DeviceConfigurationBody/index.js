import React from 'react';
import PropTypes from 'prop-types';
import Globals from './components/Globals';
import Unit from './components/Unit';
import Metrics from './components/Metrics';
import Radios from './components/Radios';
import Interfaces from './components/Interfaces';
import Services from './components/Services';

const DeviceConfigurationBody = ({
  activeSection,
  setCanSave,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
  setFields,
  batchSetField,
  deleteActive,
  disabled,
}) => (
  <div>
    {activeSection === 'globals' && (
      <div>
        <Globals
          deleteConfig={deleteActive}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          disabled={disabled}
        />
      </div>
    )}
    {activeSection === 'unit' && (
      <div>
        <Unit
          deleteConfig={deleteActive}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          disabled={disabled}
        />
      </div>
    )}
    {activeSection === 'metrics' && (
      <div>
        <Metrics
          deleteConfig={deleteActive}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          disabled={disabled}
        />
      </div>
    )}
    {activeSection === 'radios' && (
      <div>
        <Radios
          deleteConfig={deleteActive}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          setCanSave={setCanSave}
          disabled={disabled}
        />
      </div>
    )}
    {activeSection === 'interfaces' && (
      <div>
        <Interfaces
          deleteConfig={deleteActive}
          fields={fields}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          setCanSave={setCanSave}
          disabled={disabled}
        />
      </div>
    )}
    {activeSection === 'services' && (
      <div>
        <Services
          deleteConfig={deleteActive}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          batchSetField={batchSetField}
          disabled={disabled}
        />
      </div>
    )}
  </div>
);

DeviceConfigurationBody.propTypes = {
  deleteActive: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  setCanSave: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  batchSetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default DeviceConfigurationBody;
