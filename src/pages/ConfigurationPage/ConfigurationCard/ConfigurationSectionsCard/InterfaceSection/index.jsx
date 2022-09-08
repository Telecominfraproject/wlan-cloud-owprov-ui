import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ConfigurationSectionShape } from 'constants/propShapes';
import { FieldArray, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { VStack } from '@chakra-ui/react';
import { WAN_OPTIONS } from 'components/CustomFields/ConfigurationSelectPortsField/Input';
import DeleteButton from 'components/Buttons/DeleteButton';
import SectionGeneralCard from '../common/SectionGeneralCard';
import Interfaces from './Interfaces';
import { INTERFACES_SCHEMA } from './interfacesConstants';
import InterfaceExpertModal from './InterfaceExpertModal';
import InternalFormAccess from '../common/InternalFormAccess';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const warningTests = (values) => {
  const warnings = [];

  // Test for missing WAN port
  let foundWan = false;
  for (const config of values.configuration) {
    if (config.ethernet?.length > 0) {
      for (let i = 0; i < config.ethernet[0]['select-ports'].length; i += 1) {
        if (
          config.ethernet[0]['select-ports'][i] === 'WAN*' ||
          WAN_OPTIONS.includes(config.ethernet[0]['select-ports'][i])
        ) {
          foundWan = true;
          break;
        }
      }
    }
  }
  if (!foundWan)
    warnings.push({
      warning: 'Missing interface with WAN select-port',
      explanation: "There needs to be at least one interface with a WAN port within it's select-ports",
    });

  return warnings;
};

const InterfaceSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `interfaces.${k}`, error });
        }
        const warnings = warningTests(node.values);
        const newSection = {
          data: node.values,
          isDirty: node.dirty,
          invalidValues,
          warnings,
        };

        if (!isEqual(sectionInformation, newSection)) {
          setSection(newSection);
        }
      }
    },
    [sectionInformation],
  );

  const removeUnit = () => removeSub('interfaces');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={sectionInformation.data}
      validationSchema={INTERFACES_SCHEMA(t)}
    >
      {({ values }) => (
        <>
          <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
          <VStack spacing={4}>
            <SectionGeneralCard
              editing={editing}
              buttons={
                <>
                  <InterfaceExpertModal editing={editing} />
                  <DeleteButton ml={2} onClick={removeUnit} isDisabled={!editing} />
                </>
              }
            />
            <FieldArray name="configuration">
              {(arrayHelpers) => (
                <Interfaces
                  editing={editing}
                  arrayHelpers={arrayHelpers}
                  interfacesLength={values.configuration.length}
                />
              )}
            </FieldArray>
          </VStack>
        </>
      )}
    </Formik>
  );
};

InterfaceSection.propTypes = propTypes;
export default React.memo(InterfaceSection, isEqual);
