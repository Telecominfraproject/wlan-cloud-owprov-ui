import * as React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import EntityConfigurations from './EntityConfigurations';
import EntityResources from './EntityResources';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';

type Props = {
  id: string;
};

const ConfigurationCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';

  return (
    <Card p={0}>
      <Tabs variant="enclosed" isLazy>
        <TabList mt={0} px={0}>
          <CardHeader>
            <Tab
              mb="-14px"
              style={{
                // borderBottom: '0px',
                borderWidth: '1px',
              }}
              _selected={{
                background: isLight ? 'white' : 'var(--chakra-colors-gray-700)',
                borderColor: 'unset',
                textColor: isLight ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-blue-300)',
                fontWeight: 'semibold',
                // borderTopRadius: '15px',
                borderTopColor: isLight ? 'black' : 'white',
                borderLeftColor: isLight ? 'black' : 'white',
                borderRightColor: isLight ? 'black' : 'white',
                borderWidth: '0.5px',
                borderBottom: '2px solid',
                borderBottomColor: isLight ? 'white' : 'gray.800',
              }}
            >
              {t('configurations.title')}
            </Tab>
            <Tab
              mb="-14px"
              style={{
                // borderBottom: '0px',
                borderWidth: '1px',
              }}
              _selected={{
                background: isLight ? 'white' : 'var(--chakra-colors-gray-700)',
                borderColor: 'unset',
                textColor: isLight ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-blue-300)',
                fontWeight: 'semibold',
                // borderTopRadius: '15px',
                borderTopColor: isLight ? 'black' : 'white',
                borderLeftColor: isLight ? 'black' : 'white',
                borderRightColor: isLight ? 'black' : 'white',
                borderWidth: '0.5px',
                borderBottom: '2px solid',
                borderBottomColor: isLight ? 'white' : 'gray.800',
              }}
            >
              {t('resources.title')}
            </Tab>
          </CardHeader>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box
              borderLeft="1px solid"
              borderRight="1px solid"
              borderBottom="1px solid"
              borderColor="var(--chakra-colors-chakra-border-color)"
              borderBottomLeftRadius="15px"
              borderBottomRightRadius="15px"
            >
              <EntityConfigurations id={id} />
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box
              borderLeft="1px solid"
              borderRight="1px solid"
              borderBottom="1px solid"
              borderColor="var(--chakra-colors-chakra-border-color)"
              borderBottomLeftRadius="15px"
              borderBottomRightRadius="15px"
            >
              <EntityResources id={id} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default ConfigurationCard;
