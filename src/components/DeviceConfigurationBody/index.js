import React from 'react';
import PropTypes from 'prop-types';
import Globals from './components/Globals';
import Unit from './components/Unit';
import Metrics from './components/Metrics';
import Radios from './components/Radios';
import Interfaces from './components/Interfaces';
import Services from './components/Services';

const DeviceConfigurationBody = ({
  refresh,
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
}) => (
  <div>
    {activeSection === 'globals' && (
      <div>
        <Globals
          deleteConfig={deleteActive}
          refresh={refresh}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
        />
      </div>
    )}
    {activeSection === 'unit' && (
      <div>
        <Unit
          deleteConfig={deleteActive}
          refresh={refresh}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
        />
      </div>
    )}
    {activeSection === 'metrics' && (
      <div>
        <Metrics
          deleteConfig={deleteActive}
          refresh={refresh}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
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
        />
      </div>
    )}
    {activeSection === 'services' && (
      <div>
        <Services
          deleteConfig={deleteActive}
          refresh={refresh}
          baseFields={baseFields}
          updateBaseWithId={updateBaseWithId}
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          batchSetField={batchSetField}
        />
      </div>
    )}
  </div>
);

DeviceConfigurationBody.propTypes = {
  refresh: PropTypes.func.isRequired,
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
};

export default DeviceConfigurationBody;
