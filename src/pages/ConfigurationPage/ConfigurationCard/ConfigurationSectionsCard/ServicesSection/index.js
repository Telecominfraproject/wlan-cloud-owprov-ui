import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { ConfigurationSectionShape } from 'constants/propShapes';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { Flex, Spacer } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import Masonry from 'react-masonry-css';
import { getSubSectionDefaults, SERVICES_SCHEMA } from './servicesConstants';
import SectionGeneralCard from '../common/SectionGeneralCard';
import Ntp from './Ntp';
import SubSectionPicker from '../common/SubSectionPicker';
import Lldp from './Lldp';
import Mdns from './Mdns';
import Ssh from './Ssh';
import Rtty from './Rtty';
import Http from './Http';
import Log from './Log';
import Igmp from './Igmp';
import OnlineCheck from './OnlineCheck';
import WifiSteering from './WifiSteering';
import QualityOfService from './QualityOfService';
import FacebookWifi from './FacebookWifi';
import AirtimePolicies from './AirtimePolicies';
import OpenFlow from './OpenFlow';
import DataPlane from './DataPlane';
import Ieee8021x from './Ieee8021x';
import RadiusProxy from './RadiusProxy';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const ServicesSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());

  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `services.${k}`, error });
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

  const removeUnit = () => removeSub('services');

  useEffect(() => {
    if (!editing) setFormKey(uuid());
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
        validationSchema={SERVICES_SCHEMA(t)}
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
                  subsections={[
                    'airtime-policies',
                    'data-plane',
                    'facebook-wifi',
                    'http',
                    'ieee8021x',
                    'igmp',
                    'lldp',
                    'log',
                    'mdns',
                    'ntp',
                    'online-check',
                    'open-flow',
                    'quality-of-service',
                    'radius-proxy',
                    'rtty',
                    'ssh',
                    'wifi-steering',
                  ]}
                  onSubsectionsChange={(sub) => onSubsectionsChange(sub, setFieldValue)}
                />
              }
            />
            {isSubSectionActive('lldp') && <Lldp editing={editing} />}
            {isSubSectionActive('ntp') && <Ntp editing={editing} />}
            {isSubSectionActive('ssh') && <Ssh editing={editing} />}
            {isSubSectionActive('mdns') && <Mdns editing={editing} />}
            {isSubSectionActive('rtty') && <Rtty editing={editing} />}
            {isSubSectionActive('log') && <Log editing={editing} />}
            {isSubSectionActive('http') && <Http editing={editing} />}
            {isSubSectionActive('igmp') && <Igmp editing={editing} />}
            {isSubSectionActive('online-check') && <OnlineCheck editing={editing} />}
            {isSubSectionActive('wifi-steering') && <WifiSteering editing={editing} />}
            {isSubSectionActive('quality-of-service') && <QualityOfService editing={editing} />}
            {isSubSectionActive('facebook-wifi') && <FacebookWifi editing={editing} />}
            {isSubSectionActive('airtime-policies') && <AirtimePolicies editing={editing} />}
            {isSubSectionActive('open-flow') && <OpenFlow editing={editing} />}
            {isSubSectionActive('data-plane') && <DataPlane editing={editing} />}
            {isSubSectionActive('ieee8021x') && <Ieee8021x editing={editing} />}
            {isSubSectionActive('radius-proxy') && <RadiusProxy editing={editing} />}
          </Masonry>
        )}
      </Formik>
    </>
  );
};

ServicesSection.propTypes = propTypes;
export default React.memo(ServicesSection, isEqual);
