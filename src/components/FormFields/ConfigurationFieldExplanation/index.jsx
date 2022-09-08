import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useAuth } from 'contexts/AuthProvider';

const findDefinition = (definitionKey, CONFIGURATION_DESCRIPTIONS) => {
  if (!definitionKey || !CONFIGURATION_DESCRIPTIONS) return null;
  const split = definitionKey.split('.');
  const { length } = split;
  if (length < 2) return null;
  const start = split.slice(0, length - 1);
  const end = split[length - 1];
  return CONFIGURATION_DESCRIPTIONS[start.slice(0, length - 1).join('.')]?.properties[end]?.description ?? null;
};

const propTypes = {
  definitionKey: PropTypes.string,
};

const defaultProps = {
  definitionKey: null,
};

const ConfigurationFieldExplanation = ({ definitionKey }) => {
  const { configurationDescriptions } = useAuth();
  const definition = useMemo(
    () => findDefinition(definitionKey, configurationDescriptions),
    [configurationDescriptions],
  );
  if (!definition) return null;

  return (
    <Tooltip hasArrow label={definition}>
      <InfoIcon ml={2} mb="2px" />
    </Tooltip>
  );
};

ConfigurationFieldExplanation.propTypes = propTypes;
ConfigurationFieldExplanation.defaultProps = defaultProps;
export default React.memo(ConfigurationFieldExplanation);
