import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { ConfigurationSectionShape } from 'constants/propShapes';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Flex, Spacer } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import Masonry from 'react-masonry-css';
import { getSubSectionDefaults, METRICS_SCHEMA } from './metricsConstants';
import SectionGeneralCard from '../common/SectionGeneralCard';
import Statistics from './Statistics';
import SubSectionPicker from '../common/SubSectionPicker';
import Health from './Health';
import WifiFrames from './WifiFrames';
import DhcpSnooping from './DhcpSnooping';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const MetricsSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(createUuid());

  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `metrics.${k}`, error });
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

  const isSubSectionActive = useCallback(
    (sub) =>
      sectionInformation.data.configuration.__selected_subcategories.includes(sub) &&
      sectionInformation.data.configuration !== undefined,
    [sectionInformation.data],
  );

  const onSubsectionsChange = useCallback(
    (newSubsections, setFieldValue) => {
      const toRemove = sectionInformation.data.configuration.__selected_subcategories.filter(
        (sub) => !newSubsections.includes(sub),
      );
      const toAdd = newSubsections.filter(
        (sub) => !sectionInformation.data.configuration.__selected_subcategories.includes(sub),
      );

      for (let i = 0; i < toRemove.length; i += 1) {
        setFieldValue(`configuration.${toRemove[i]}`, undefined);
      }
      for (let i = 0; i < toAdd.length; i += 1) {
        setFieldValue(`configuration.${toAdd[i]}`, getSubSectionDefaults(t, toAdd[i]));
      }

      setFieldValue('configuration.__selected_subcategories', newSubsections);
    },
    [sectionInformation.data],
    isEqual,
  );

  const removeUnit = () => removeSub('metrics');

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
        validationSchema={METRICS_SCHEMA(t)}
      >
        {({ setFieldValue }) => (
          <Masonry
            breakpointCols={{
              default: 3,
              1400: 2,
              1100: 1,
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            <SectionGeneralCard
              editing={editing}
              subsectionPicker={
                <SubSectionPicker
                  editing={editing}
                  subsections={['statistics', 'health', 'wifi-frames', 'dhcp-snooping']}
                  onSubsectionsChange={(sub) => onSubsectionsChange(sub, setFieldValue)}
                />
              }
            />
            {isSubSectionActive('statistics') && <Statistics editing={editing} />}
            {isSubSectionActive('health') && <Health editing={editing} />}
            {isSubSectionActive('wifi-frames') && <WifiFrames editing={editing} />}
            {isSubSectionActive('dhcp-snooping') && <DhcpSnooping editing={editing} />}
          </Masonry>
        )}
      </Formik>
    </>
  );
};

MetricsSection.propTypes = propTypes;
export default React.memo(MetricsSection, isEqual);
