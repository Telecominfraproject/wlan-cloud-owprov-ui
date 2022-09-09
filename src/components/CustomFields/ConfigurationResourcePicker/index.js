import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { useGetAllResources } from 'hooks/Network/Resources';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import ResourcePicker from './ResourcePicker';

const propTypes = {
  name: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  defaultValue: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  blockedIds: PropTypes.arrayOf(PropTypes.string),
};

const ConfigurationResourcePicker = ({ name, prefix, defaultValue, isDisabled, blockedIds }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [{ value }, , { setValue }] = useField(name);
  const { data: resources, isFetching } = useGetAllResources({ t, toast });

  const availableResources = useMemo(() => {
    if (resources)
      return resources
        .filter((resource) => resource.variables[0]?.prefix === prefix && !blockedIds?.includes(resource.id))
        .map((resource) => ({ value: resource.id, label: resource.name }));
    return [];
  }, [resources, blockedIds]);

  const getValue = () => {
    if (!value || !value.__variableBlock) return '';
    return value.__variableBlock[0];
  };

  const onChange = useCallback((e) => {
    if (e.target.value === '') setValue(defaultValue(t, true).cast());
    else {
      const newObj = {};
      newObj.__variableBlock = [e.target.value];
      setValue(newObj);
    }
  }, []);

  return (
    <ResourcePicker
      value={getValue()}
      onChange={onChange}
      resources={availableResources}
      isDisabled={isDisabled || isFetching || !resources}
    />
  );
};

ConfigurationResourcePicker.propTypes = propTypes;
export default ConfigurationResourcePicker;
