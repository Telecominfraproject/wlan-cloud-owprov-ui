import * as React from 'react';
import { Box, Wrap, WrapItem } from '@chakra-ui/react';
import { Form } from 'formik';
import { useTranslation } from 'react-i18next';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import RrmFormField from 'components/CustomFields/RrmFormField';
import SelectField from 'components/FormFields/SelectField';

type Props = {
  isDisabled: boolean;
};

const VenueBehaviorsForm = ({ isDisabled }: Props) => {
  const { t } = useTranslation();

  const options = [
    { value: 'yes', label: t('common.yes') },
    { value: 'no', label: t('common.no') },
    { value: 'inherit', label: t('common.inherit') },
  ];

  return (
    <Form>
      <Wrap>
        <WrapItem>
          <IpDetectionModalField name="sourceIP" isDisabled={isDisabled} />
        </WrapItem>
        <WrapItem>
          <Box>
            <RrmFormField namePrefix="deviceRules" isDisabled={isDisabled} />
          </Box>
        </WrapItem>
        <WrapItem>
          <Box w="200px">
            <SelectField
              name="deviceRules.rcOnly"
              label={t('configurations.rc_only')}
              isDisabled={isDisabled}
              options={options}
              w="100px"
            />
          </Box>
        </WrapItem>
        <WrapItem>
          <Box w="200px">
            <SelectField
              name="deviceRules.firmwareUpgrade"
              label={t('configurations.firmware_upgrade')}
              isDisabled={isDisabled}
              options={options}
              w="100px"
            />
          </Box>
        </WrapItem>
      </Wrap>
    </Form>
  );
};

export default VenueBehaviorsForm;
