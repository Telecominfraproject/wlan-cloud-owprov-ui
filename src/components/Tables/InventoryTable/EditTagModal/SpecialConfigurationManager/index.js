import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Button, Center, Heading, Spacer, useToast } from '@chakra-ui/react';
import { useGetConfiguration } from 'hooks/Network/Configurations';
import ConfigurationSectionsCard from 'pages/ConfigurationPage/ConfigurationCard/ConfigurationSectionsCard';
import { BASE_SECTIONS } from 'constants/configuration';
import DeleteButton from 'components/Buttons/DeleteButton';
import SpecialConfigurationForm from './SpecialConfigurationForm';

const convertConfigManagerData = (form, sections) => {
  if (form === null || sections === null) return null;

  const newObj = {
    __form: {
      isDirty: form.dirty || sections.isDirty,
      isValid: sections.invalidValues.length === 0,
    },
    data: {
      ...form.values,
      configuration: sections.activeConfigurations.map((conf) => {
        const deviceConfig = sections.data[conf].data.configuration;
        const config = { ...sections.data[conf].data, configuration: {} };
        if (conf === 'interfaces') config.configuration = { interfaces: deviceConfig };
        else config.configuration[conf] = deviceConfig;
        return config;
      }),
    },
  };
  return newObj;
};

const propTypes = {
  editing: PropTypes.bool.isRequired,
  configId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isEnabledByDefault: PropTypes.bool,
  isOnlySections: PropTypes.bool,
};

const defaultProps = {
  configId: null,
  isEnabledByDefault: false,
  isOnlySections: false,
};

const SpecialConfigurationManager = ({
  editing,
  configId,
  onChange,
  isEnabledByDefault,
  isOnlySections,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [sections, setSections] = useState(isEnabledByDefault ? BASE_SECTIONS : null);
  const [form, setForm] = useState(isEnabledByDefault ? {} : null);
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty ||
          !isEqual(form.values, node.values))
      ) {
        setForm(node);
      }
    },
    [form],
  );
  const { data: configuration } = useGetConfiguration({ t, toast, id: configId });

  const handleCreateClick = useCallback(() => {
    setSections(BASE_SECTIONS);
    setForm({});
  }, []);
  const handleDeleteClick = useCallback(() => {
    setSections(null);
    setForm(null);
  }, []);

  useEffect(
    () => {
      const newConfig = convertConfigManagerData(form, sections);
      onChange(newConfig);
    },
    [form, sections],
    isEqual,
  );

  useEffect(() => {
    if (configuration) {
      setSections(BASE_SECTIONS);
      setForm({});
    } else if (!isEnabledByDefault) {
      setSections(null);
      setForm(null);
    }
  }, [configuration]);

  if (sections === null || form === null) {
    return (
      <Center>
        <Button onClick={handleCreateClick} colorScheme="blue" isDisabled={!editing}>
          {t('configurations.start_special_creation')}
        </Button>
      </Center>
    );
  }

  return (
    <>
      {!isOnlySections && (
        <>
          <Heading display="flex" size="md" mb={2}>
            {t('common.base_information')}
            <Spacer />
            <DeleteButton onClick={handleDeleteClick} isDisabled={!editing} />
          </Heading>
          <SpecialConfigurationForm
            editing={editing}
            formRef={formRef}
            configuration={configuration}
          />
        </>
      )}
      <ConfigurationSectionsCard
        label={t('configurations.configuration_sections')}
        editing={editing}
        configId={configId}
        setSections={setSections}
      />
    </>
  );
};

SpecialConfigurationManager.propTypes = propTypes;
SpecialConfigurationManager.defaultProps = defaultProps;
export default React.memo(SpecialConfigurationManager);
