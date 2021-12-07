import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';

const EntityTooltip = ({ data }) => {
  const { t } = useTranslation();

  return (
    <ReactTooltip
      className="map-tooltip"
      id={data.tooltipId}
      effect="solid"
      globalEventOff="click"
      clickable
      border
      arrowColor="white"
      delayHide={100}
    >
      <div>
        <h5 className="mb-1">
          <u>{data.entityName}</u>
        </h5>
        {data.extraData.description.trim().length > 0 ? (
          <h6 className="font-italic mb-1">{data.extraData.description}</h6>
        ) : null}
        <CRow>
          <CCol>
            {data.extraData.devices.length} {t('common.devices')}
          </CCol>
        </CRow>
        <CRow>
          <CCol>{`${data.extraData.contacts.length} ${t('contact.title')}`}</CCol>
        </CRow>
        <CRow>
          <CCol>{`${data.extraData.locations.length} ${t('location.title')}`}</CCol>
        </CRow>
        <CRow>
          <CCol>RRM: {data.extraData.rrm.length > 0 ? data.extraData.rrm : 'inherit'}</CCol>
        </CRow>
      </div>
    </ReactTooltip>
  );
};

EntityTooltip.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(EntityTooltip);
