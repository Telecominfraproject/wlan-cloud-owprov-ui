import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  subsectionPicker: PropTypes.node,
  buttons: PropTypes.node,
};

const defaultProps = {
  subsectionPicker: null,
  buttons: null,
};

const SectionGeneralCard = ({ editing, subsectionPicker, buttons }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader display="flex">
        <div>
          <Heading size="md" borderBottom="1px solid" mt={1}>
            {t('common.general_info')}
          </Heading>
        </div>
        <Spacer />
        {buttons}
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <StringField name="name" label={t('common.name')} isRequired isDisabled={!editing} />
          <StringField name="description" label={t('common.description')} isDisabled={!editing} />
          {subsectionPicker}
          <NumberField
            name="weight"
            label={t('configurations.weight')}
            isDisabled={!editing}
            isRequired
            min={0}
            w={24}
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

SectionGeneralCard.propTypes = propTypes;
SectionGeneralCard.defaultProps = defaultProps;
export default React.memo(SectionGeneralCard);
