import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { ConfigurationSectionShape } from 'constants/propShapes';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Flex, SimpleGrid, Spacer } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import { GLOBALS_SCHEMA } from './globalsConstants';
import SectionGeneralCard from '../common/SectionGeneralCard';
import Globals from './Globals';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const GlobalsSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(createUuid());
  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `globals.${k}`, error });
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

  const removeUnit = () => removeSub('globals');

  useEffect(() => {
    if (!editing) {
      setFormKey(createUuid());
    }
  }, [editing]);

  return (
    <>
      <Flex>
        <Spacer />
        <DeleteButton my={2} onClick={removeUnit} isDisabled={!editing} />
      </Flex>
      <Formik
        key={formKey}
        innerRef={sectionRef}
        initialValues={sectionInformation.data}
        validationSchema={GLOBALS_SCHEMA(t)}
      >
        <SimpleGrid minChildWidth="400px" spacing={4}>
          <SectionGeneralCard editing={editing} />
          <Globals editing={editing} />
        </SimpleGrid>
      </Formik>
    </>
  );
};

GlobalsSection.propTypes = propTypes;
export default React.memo(GlobalsSection, isEqual);
