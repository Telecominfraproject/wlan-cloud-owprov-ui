import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import FileInputFieldModal from 'components/FormFields/FileInputFieldModal';
import { useTranslation } from 'react-i18next';
import { testPemCertificate, testPemPrivateKey } from 'constants/formTests';
import ToggleField from 'components/FormFields/ToggleField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import { SERVICES_USER_SCHEMA } from './servicesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Ieee8021x = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>Ieee8021x</CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <ToggleField
            name="configuration.ieee8021x.use-local-certificates"
            label="use-local-certificates"
            definitionKey="service.ieee8021x.use-local-certificates"
            isDisabled={!editing}
            isRequired
          />
          <FileInputFieldModal
            name="configuration.ieee8021x.ca-certificate"
            fileName="configuration.ieee8021x.ca-certificate-filename"
            label="ca-certificate"
            definitionKey="service.ieee8021x.ca-certificate"
            explanation={t('form.certificate_file_explanation')}
            test={testPemCertificate}
            acceptedFileTypes=".pem"
            isDisabled={!editing}
            isRequired
          />
          <FileInputFieldModal
            name="configuration.ieee8021x.private-key"
            fileName="configuration.ieee8021x.private-key-filename"
            label="private-key"
            definitionKey="service.ieee8021x.private-key"
            explanation={t('form.key_file_explanation')}
            test={testPemPrivateKey}
            acceptedFileTypes=".pem"
            isDisabled={!editing}
            isRequired
          />
          <FileInputFieldModal
            name="configuration.ieee8021x.server-certificate"
            fileName="configuration.ieee8021x.server-certificate-filename"
            label="server-certificate"
            definitionKey="service.ieee8021x.server-certificate"
            explanation={t('form.pem_file_explanation')}
            acceptedFileTypes=".pem"
            isDisabled={!editing}
            isRequired
          />
          <ObjectArrayFieldModal
            name="configuration.ieee8021x.users"
            label="users"
            definitionKey="service.ieee8021x.users"
            editing={editing}
            fields={
              <>
                <StringField name="mac" label="mac" isRequired />
                <StringField name="user-name" label="user-name" isRequired />
                <StringField name="password" label="password" isRequired hideButton />
                <NumberField name="vlan-id" label="vlan-id" isDisabled={!editing} isRequired w={24} />
              </>
            }
            columns={[
              {
                id: 'user-name',
                Header: 'user-name',
                Footer: '',
                accessor: 'user-name',
              },
              {
                id: 'mac',
                Header: 'mac',
                Footer: '',
                accessor: 'mac',
                customWidth: '150px',
              },
              {
                id: 'vlan-id',
                Header: 'vlan-id',
                Footer: '',
                accessor: 'vlan-id',
                customWidth: '100px',
              },
            ]}
            schema={SERVICES_USER_SCHEMA}
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

Ieee8021x.propTypes = propTypes;
export default React.memo(Ieee8021x);
