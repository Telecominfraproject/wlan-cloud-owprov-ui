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
import { RADIOS_SCHEMA } from './radiosConstants';
import Radios from './Radios';
import InternalFormAccess from '../common/InternalFormAccess';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const RadiosSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `radios.${k}`, error });
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

  const removeUnit = () => removeSub('radios');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <>
      <Flex>
        <Spacer />
      </Flex>
      <Formik
        key={formKey}
        innerRef={sectionRef}
        initialValues={sectionInformation.data}
        validationSchema={RADIOS_SCHEMA(t)}
      >
        {({ values }) => (
          <>
            <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
            <VStack spacing={4}>
              <SectionGeneralCard
                editing={editing}
                buttons={<DeleteButton onClick={removeUnit} isDisabled={!editing} />}
              />
              <FieldArray name="configuration">
                {(arrayHelpers) => (
                  <Radios
                    editing={editing}
                    arrayHelpers={arrayHelpers}
                    radioBands={values.configuration.map((radio) => radio.band)}
                    radioBandsLength={values.configuration.length}
                  />
                )}
              </FieldArray>
            </VStack>
          </>
        )}
      </Formik>
    </>
  );
};

RadiosSection.propTypes = propTypes;
export default React.memo(RadiosSection, isEqual);
