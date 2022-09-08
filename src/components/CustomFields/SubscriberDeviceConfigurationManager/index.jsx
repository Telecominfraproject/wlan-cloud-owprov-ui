import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Button, Center } from '@chakra-ui/react';
import ConfigurationSectionsCard from 'pages/ConfigurationPage/ConfigurationCard/ConfigurationSectionsCard';
import { BASE_SECTIONS } from 'constants/configuration';

const convertConfigManagerData = (sections) => {
  if (sections === null) return null;

  const newObj = {
    __form: {
      isDirty: sections.isDirty,
      isValid: sections.invalidValues.length === 0,
    },
    data: sections.activeConfigurations.map((conf) => {
      const deviceConfig = sections.data[conf].data.configuration;
      const config = { ...sections.data[conf].data, configuration: {} };
      if (conf === 'interfaces') config.configuration = { interfaces: deviceConfig };
      else config.configuration[conf] = deviceConfig;
      return config;
    }),
  };
  return newObj;
};

const propTypes = {
  editing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  isEnabledByDefault: PropTypes.bool,
  isDeletePossible: PropTypes.bool,
  configuration: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

const defaultProps = {
  isEnabledByDefault: false,
  isDeletePossible: false,
  configuration: null,
};

const SubscriberDeviceConfigurationManager = ({
  editing,
  onChange,
  isEnabledByDefault,
  isDeletePossible,
  configuration,
}) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState(isEnabledByDefault ? BASE_SECTIONS : null);

  const handleCreateClick = useCallback(() => {
    setSections(BASE_SECTIONS);
  }, []);
  const handleDeleteClick = useCallback(() => {
    setSections(null);
  }, []);

  useEffect(
    () => {
      const newConfig = convertConfigManagerData(sections);
      onChange(newConfig);
    },
    [sections],
    isEqual,
  );

  useEffect(() => {
    if (configuration) {
      setSections(BASE_SECTIONS);
    }
  }, [configuration]);

  if (sections === null) {
    return (
      <Center>
        <Button onClick={handleCreateClick} colorScheme="blue" isDisabled={!editing} my={4}>
          {t('configurations.start_special_creation')}
        </Button>
      </Center>
    );
  }

  return (
    <ConfigurationSectionsCard
      label={t('configurations.configuration_sections')}
      editing={editing}
      defaultConfig={configuration}
      setSections={setSections}
      onDelete={isDeletePossible ? handleDeleteClick : null}
    />
  );
};

SubscriberDeviceConfigurationManager.propTypes = propTypes;
SubscriberDeviceConfigurationManager.defaultProps = defaultProps;
export default React.memo(SubscriberDeviceConfigurationManager);
