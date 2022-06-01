import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import FileInputFieldModal from 'components/FormFields/FileInputFieldModal';
import { useTranslation } from 'react-i18next';
import { testPemCertificate, testPemPrivateKey } from 'constants/formTests';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const OpenFlow = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          Open Flow
        </Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <StringField
            name="configuration.open-flow.controller"
            label="controller"
            definitionKey="service.open-flow.controller"
            isDisabled={!editing}
            isRequired
          />
          <SelectField
            name="configuration.open-flow.mode"
            label="mode"
            definitionKey="service.open-flow.mode"
            isDisabled={!editing}
            isRequired
            options={[
              { value: 'pssl', label: 'pssl' },
              {
                value: 'ptcp',
                label: 'ptcp',
              },
              {
                value: 'ssl',
                label: 'ssl',
              },
              {
                value: 'tcp',
                label: 'tcp',
              },
            ]}
          />
          <FileInputFieldModal
            name="configuration.open-flow.ca-certificate"
            fileName="configuration.open-flow.ca-certificate-filename"
            label="ca-certificate"
            definitionKey="service.open-flow.ca-certificate"
            explanation={t('form.certificate_file_explanation')}
            test={testPemCertificate}
            acceptedFileTypes=".pem"
            isDisabled={!editing}
            isRequired
          />
          <FileInputFieldModal
            name="configuration.open-flow.private-key"
            fileName="configuration.open-flow.private-key-filename"
            label="private-key"
            definitionKey="service.open-flow.private-key"
            explanation={t('form.key_file_explanation')}
            test={testPemPrivateKey}
            acceptedFileTypes=".pem"
            isDisabled={!editing}
            isRequired
          />
          <FileInputFieldModal
            name="configuration.open-flow.ssl-certificate"
            fileName="configuration.open-flow.ssl-certificate-filename"
            label="ssl-certificate"
            definitionKey="service.open-flow.ssl-certificate"
            explanation={t('form.certificate_file_explanation')}
            acceptedFileTypes=".pem"
            test={testPemCertificate}
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

OpenFlow.propTypes = propTypes;
export default React.memo(OpenFlow);
