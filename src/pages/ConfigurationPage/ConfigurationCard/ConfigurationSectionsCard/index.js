import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Center,
  Heading,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import CardBody from 'components/Card/CardBody';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetConfiguration } from 'hooks/Network/Configurations';
import { useTranslation } from 'react-i18next';
import GlobalsSection from './GlobalsSection';
import { GLOBALS_SCHEMA } from './GlobalsSection/globalsConstants';
import { UNIT_SCHEMA } from './UnitSection/unitConstants';
import UnitSection from './UnitSection';
import AddSubsectionModal from './AddSubsectionModal';
import ViewJsonConfigModal from './ViewJsonConfigModal';
import ViewConfigErrorsModal from './ViewConfigErrorsModal';
import { METRICS_SCHEMA } from './MetricsSection/metricsConstants';
import MetricsSection from './MetricsSection';
import { SERVICES_SCHEMA } from './ServicesSection/servicesConstants';
import ServicesSection from './ServicesSection';
import { RADIOS_SCHEMA } from './RadiosSection/radiosConstants';
import RadiosSection from './RadiosSection';
import { INTERFACES_SCHEMA } from './InterfaceSection/interfacesConstants';
import InterfacesSection from './InterfaceSection';
import ImportConfigurationButton from './ImportConfigurationButton';

const propTypes = {
  configId: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  setSections: PropTypes.func.isRequired,
  label: PropTypes.string,
};

const defaultProps = {
  label: null,
};

const getActiveConfigurations = (configurations) =>
  configurations.map((config) => Object.keys(JSON.parse(config.configuration))[0]);

const getConfigurationData = (configurations, section) => {
  const data = configurations.find((conf) => Object.keys(JSON.parse(conf.configuration))[0] === section);

  if (section === 'interfaces') {
    return { ...data, configuration: JSON.parse(data.configuration).interfaces };
  }

  return { ...data, configuration: JSON.parse(data.configuration)[section] };
};

const ConfigurationSectionsCard = ({ configId, editing, setSections, label }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [globals, setGlobals] = useState({
    data: GLOBALS_SCHEMA(t).cast(),
    isDirty: false,
    invalidValues: [],
  });
  const [unit, setUnit] = useState({
    data: UNIT_SCHEMA(t).cast(),
    isDirty: false,
    invalidValues: [],
  });
  const [metrics, setMetrics] = useState({
    data: METRICS_SCHEMA(t).cast(),
    isDirty: false,
    invalidValues: [],
  });
  const [services, setServices] = useState({
    data: SERVICES_SCHEMA(t).cast(),
    isDirty: false,
    invalidValues: [],
  });
  const [radios, setRadios] = useState({
    data: RADIOS_SCHEMA(t).cast(),
    isDirty: false,
    invalidValues: [],
  });
  const [interfaces, setInterfaces] = useState({
    data: INTERFACES_SCHEMA(t).cast(),
    isDirty: false,
    invalidValues: [],
  });
  const [activeConfigurations, setActiveConfigurations] = useState([]);
  const setConfigSectionsFromArray = (arr) => {
    setActiveConfigurations([]);

    setTimeout(() => {
      const newActiveConfigs = getActiveConfigurations(arr);

      if (newActiveConfigs.includes('globals')) {
        setGlobals({
          data: getConfigurationData(arr, 'globals'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('unit')) {
        setUnit({
          data: getConfigurationData(arr, 'unit'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('metrics')) {
        setMetrics({
          data: getConfigurationData(arr, 'metrics'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('services')) {
        setServices({
          data: getConfigurationData(arr, 'services'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('radios')) {
        setRadios({
          data: getConfigurationData(arr, 'radios'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('interfaces')) {
        setInterfaces({
          data: getConfigurationData(arr, 'interfaces'),
          isDirty: false,
          invalidValues: [],
        });
      }

      setActiveConfigurations([...newActiveConfigs]);
    }, 200);
  };
  const { data: configuration, isFetching } = useGetConfiguration({
    t,
    toast,
    id: configId,
    onSuccess: (data) => {
      setConfigSectionsFromArray(data.configuration);
    },
  });

  const addSubsection = useCallback(
    (sub) => {
      const newSubs = activeConfigurations;
      newSubs.push(sub);
      setActiveConfigurations([...newSubs]);
    },
    [activeConfigurations, setActiveConfigurations],
  );

  const removeSub = useCallback(
    (sub) => {
      if (sub === 'globals')
        setGlobals({
          ...{
            data: GLOBALS_SCHEMA(t).cast(),
            isDirty: false,
            invalidValues: [],
          },
        });
      if (sub === 'unit')
        setUnit({
          ...{
            data: UNIT_SCHEMA(t).cast(),
            isDirty: false,
            invalidValues: [],
          },
        });
      if (sub === 'metrics')
        setMetrics({
          ...{
            data: METRICS_SCHEMA(t).cast(),
            isDirty: false,
            invalidValues: [],
          },
        });
      if (sub === 'services')
        setServices({
          ...{
            data: SERVICES_SCHEMA(t).cast(),
            isDirty: false,
            invalidValues: [],
          },
        });
      if (sub === 'radios')
        setRadios({
          ...{
            data: RADIOS_SCHEMA(t).cast(),
            isDirty: false,
            invalidValues: [],
          },
        });
      if (sub === 'interfaces')
        setInterfaces({
          ...{
            data: INTERFACES_SCHEMA(t).cast(),
            isDirty: false,
            invalidValues: [],
          },
        });
      const newSubs = activeConfigurations.filter((conf) => conf !== sub);
      setActiveConfigurations([...newSubs]);
    },
    [activeConfigurations, setActiveConfigurations],
  );

  const importConfig = (newConf) => {
    setConfigSectionsFromArray(newConf);
  };

  useEffect(() => {
    if (!editing && configuration) {
      const newActiveConfigs = getActiveConfigurations(configuration.configuration);

      if (newActiveConfigs.includes('globals')) {
        setGlobals({
          data: getConfigurationData(configuration.configuration, 'globals'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('unit')) {
        setUnit({
          data: getConfigurationData(configuration.configuration, 'unit'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('metrics')) {
        setMetrics({
          data: getConfigurationData(configuration.configuration, 'metrics'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('services')) {
        setServices({
          data: getConfigurationData(configuration.configuration, 'services'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('radios')) {
        setRadios({
          data: getConfigurationData(configuration.configuration, 'radios'),
          isDirty: false,
          invalidValues: [],
        });
      }
      if (newActiveConfigs.includes('interfaces')) {
        setInterfaces({
          data: getConfigurationData(configuration.configuration, 'interfaces'),
          isDirty: false,
          invalidValues: [],
        });
      }

      setActiveConfigurations(newActiveConfigs);
    }
  }, [editing]);

  useEffect(() => {
    setSections({
      isLoaded: true,
      isDirty:
        globals.isDirty ||
        unit.isDirty ||
        metrics.isDirty ||
        services.isDirty ||
        radios.isDirty ||
        interfaces.isDirty ||
        activeConfigurations.length !==
          (configuration ? getActiveConfigurations(configuration?.configuration).length : 0),
      invalidValues: [
        ...globals.invalidValues,
        ...unit.invalidValues,
        ...metrics.invalidValues,
        ...services.invalidValues,
        ...radios.invalidValues,
        ...interfaces.invalidValues,
      ],
      activeConfigurations,
      data: {
        globals,
        unit,
        metrics,
        services,
        radios,
        interfaces,
      },
    });
  }, [globals, unit, metrics, services, radios, interfaces, activeConfigurations, configuration]);

  return (
    <Card px={label ? 0 : undefined}>
      <CardHeader mb="10px" display="flex">
        <Box pt={1}>
          <Heading size="md">{label ?? configuration?.name}</Heading>
        </Box>
        <Spacer />
        <Box>
          <ViewConfigErrorsModal
            errors={{
              globals: globals.invalidValues,
              unit: unit.invalidValues,
              metrics: metrics.invalidValues,
              services: services.invalidValues,
              radios: radios.invalidValues,
              interfaces: interfaces.invalidValues,
            }}
            activeConfigurations={activeConfigurations}
            isDisabled={isFetching}
          />
          <ViewJsonConfigModal
            configurations={{
              globals: globals.data,
              unit: unit.data,
              metrics: metrics.data,
              services: services.data,
              radios: radios.data,
              interfaces: interfaces.data,
            }}
            activeConfigurations={activeConfigurations}
            isDisabled={isFetching}
          />
          <ImportConfigurationButton isDisabled={!editing} setConfig={importConfig} />
          <AddSubsectionModal editing={editing} activeSubs={activeConfigurations} addSub={addSubsection} />
        </Box>
      </CardHeader>
      <CardBody>
        {!configuration && isFetching ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <Box display="unset" position="unset" w="100%">
              <Tabs variant="enclosed" w="100%">
                <TabList>
                  {activeConfigurations.includes('globals') && <Tab>{t('configurations.globals')}</Tab>}
                  {activeConfigurations.includes('unit') && <Tab>{t('configurations.unit')}</Tab>}
                  {activeConfigurations.includes('metrics') && <Tab>{t('configurations.metrics')}</Tab>}
                  {activeConfigurations.includes('services') && <Tab>{t('configurations.services')}</Tab>}
                  {activeConfigurations.includes('radios') && <Tab>{t('configurations.radios')}</Tab>}
                  {activeConfigurations.includes('interfaces') && <Tab>{t('configurations.interfaces')}</Tab>}
                </TabList>
                <TabPanels>
                  {activeConfigurations.includes('globals') && (
                    <TabPanel>
                      <GlobalsSection
                        editing={editing}
                        setSection={setGlobals}
                        sectionInformation={globals}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  )}
                  {activeConfigurations.includes('unit') && (
                    <TabPanel>
                      <UnitSection
                        editing={editing}
                        setSection={setUnit}
                        sectionInformation={unit}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  )}
                  {activeConfigurations.includes('metrics') && (
                    <TabPanel>
                      <MetricsSection
                        editing={editing}
                        setSection={setMetrics}
                        sectionInformation={metrics}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  )}
                  {activeConfigurations.includes('services') && (
                    <TabPanel>
                      <ServicesSection
                        editing={editing}
                        setSection={setServices}
                        sectionInformation={services}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  )}
                  {activeConfigurations.includes('radios') && (
                    <TabPanel>
                      <RadiosSection
                        editing={editing}
                        setSection={setRadios}
                        sectionInformation={radios}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  )}
                  {activeConfigurations.includes('interfaces') && (
                    <TabPanel>
                      <InterfacesSection
                        editing={editing}
                        setSection={setInterfaces}
                        sectionInformation={interfaces}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </Box>
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

ConfigurationSectionsCard.propTypes = propTypes;
ConfigurationSectionsCard.defaultProps = defaultProps;

export default React.memo(ConfigurationSectionsCard);
