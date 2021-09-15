import React from 'react';
import PropTypes from 'prop-types';

const DeviceConfigurationBody = ({ config }) => {
  // If config is null, it means we want to create a new one
  if (config === null) {
    return <div> creating </div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(config, null, '\t')}</pre>
    </div>
  );
};

DeviceConfigurationBody.propTypes = {
  config: PropTypes.instanceOf(Object),
};

DeviceConfigurationBody.defaultProps = {
  config: null,
};

export default DeviceConfigurationBody;
