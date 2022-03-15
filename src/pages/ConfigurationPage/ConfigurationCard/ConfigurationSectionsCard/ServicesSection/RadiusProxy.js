import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { SimpleGrid } from '@chakra-ui/react';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import ToggleField from 'components/FormFields/ToggleField';
import { testPemCertificate, testPemPrivateKey } from 'constants/formTests';
import FileInputFieldModal from 'components/FormFields/FileInputFieldModal';
import { SERVICES_REALMS_SCHEMA } from './servicesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const RadiusProxy = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>Radius Proxy</CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <ObjectArrayFieldModal
            name="configuration.radius-proxy.realms"
            label="realms"
            editing={editing}
            fields={
              <>
                <StringField name="realm" label="realm" isRequired />
                <NumberField name="port" label="port" isDisabled={!editing} isRequired w={24} />
                <ToggleField
                  name="auto-discover"
                  label="auto-discover"
                  isDisabled={!editing}
                  isRequired
                />
                <StringField name="secret" label="secret" isRequired />
                <ToggleField
                  name="use-local-certificates"
                  label="use-local-certificates"
                  isDisabled={!editing}
                  isRequired
                />
                <FileInputFieldModal
                  name="ca-certificate"
                  fileName="ca-certificate-filename"
                  label="ca-certificate"
                  explanation={t('form.certificate_file_explanation')}
                  test={testPemCertificate}
                  acceptedFileTypes=".pem"
                  isDisabled={!editing}
                  isRequired
                />
                <FileInputFieldModal
                  name="certificate"
                  fileName="certificate-filename"
                  label="certificate"
                  explanation={t('form.certificate_file_explanation')}
                  test={testPemCertificate}
                  acceptedFileTypes=".pem"
                  isDisabled={!editing}
                  isRequired
                />
                <FileInputFieldModal
                  name="private-key"
                  fileName="private-key-filename"
                  label="private-key"
                  explanation={t('form.key_file_explanation')}
                  test={testPemPrivateKey}
                  acceptedFileTypes=".pem"
                  isDisabled={!editing}
                  isRequired
                />
                <StringField name="private-key-password" label="private-key-password" isRequired />
              </>
            }
            columns={[
              {
                id: 'realm',
                Header: 'realm',
                Footer: '',
                accessor: 'realm',
              },
              {
                id: 'port',
                Header: 'port',
                Footer: '',
                accessor: 'port',
                customWidth: '150px',
              },
              {
                id: 'secret',
                Header: 'secret',
                Footer: '',
                accessor: 'secret',
                customWidth: '100px',
              },
            ]}
            schema={SERVICES_REALMS_SCHEMA}
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

RadiusProxy.propTypes = propTypes;
export default React.memo(RadiusProxy);
