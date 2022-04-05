import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import MultiSelectField from 'components/FormFields/MultiSelectField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const DhcpSnooping = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>{t('configurations.dhcp_snooping')}</CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <MultiSelectField
            name="configuration.dhcp-snooping.filters"
            label="filters"
            definitionKey="metrics.dhcp-snooping.filters"
            hasVirtualAll
            canSelectAll
            options={[
              { value: 'ack', label: 'ack' },
              { value: 'discover', label: 'discover' },
              { value: 'offer', label: 'offer' },
              { value: 'request', label: 'request' },
              { value: 'solicit', label: 'solicit' },
              { value: 'reply', label: 'reply' },
              { value: 'renew', label: 'renew' },
            ]}
            isRequired
            isDisabled={!editing}
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

DhcpSnooping.propTypes = propTypes;
export default React.memo(DhcpSnooping);
