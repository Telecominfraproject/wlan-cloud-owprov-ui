import React from 'react';
import PropTypes from 'prop-types';
import Globals from './components/Globals';
import Base from './components/Base';
import Unit from './components/Unit';
import Metrics from './components/Metrics';
import Radios from './components/Radios';
import Interfaces from './components/Interfaces';
import Services from './components/Services';

const DeviceConfigurationBody = ({
  parentConfiguration,
  index,
  refresh,
  refreshConfig,
  activeSection,
  setCanSave,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
  setFields,
}) => {
  const deleteConfigBlock = () => {
    const newFullConfiguration = parentConfiguration;
    const newBlocks = newFullConfiguration.configuration;
    newBlocks.splice(index, 1);
    newFullConfiguration.configuration = newBlocks;

    refreshConfig(newFullConfiguration);
  };

  return (
    <div>
      {activeSection === 'globals' && (
        <div>
          <Globals
            deleteConfig={deleteConfigBlock}
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
            deleteConfig={deleteConfigBlock}
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
            deleteConfig={deleteConfigBlock}
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
          <Base
            deleteConfig={deleteConfigBlock}
            fields={baseFields}
            updateWithId={updateBaseWithId}
            refresh={refresh}
          />
          <Radios
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
          <Base
            deleteConfig={deleteConfigBlock}
            fields={baseFields}
            updateWithId={updateBaseWithId}
            refresh={refresh}
          />
          <Interfaces
            fields={fields}
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
            deleteConfig={deleteConfigBlock}
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
    </div>
  );
};

DeviceConfigurationBody.propTypes = {
  parentConfiguration: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  refresh: PropTypes.func.isRequired,
  refreshConfig: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  setCanSave: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
};

export default DeviceConfigurationBody;
