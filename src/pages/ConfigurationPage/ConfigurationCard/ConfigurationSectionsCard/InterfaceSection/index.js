import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ConfigurationSectionShape } from 'constants/propShapes';
import { FieldArray, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Flex, Spacer, VStack } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import SectionGeneralCard from '../common/SectionGeneralCard';
import Interfaces from './Interfaces';
import { INTERFACES_SCHEMA } from './interfacesConstants';
import InterfaceExpertModal from './InterfaceExpertModal';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
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

        const newSection = {
          data: node.values,
          isDirty: node.dirty,
          invalidValues,
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
          <Flex>
            <Spacer />
            <InterfaceExpertModal />
            <DeleteButton ml={2} my={2} onClick={removeUnit} isDisabled={!editing} />
          </Flex>
          <VStack spacing={4}>
            <SectionGeneralCard editing={editing} />
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
