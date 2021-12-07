import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';

const VenueTooltip = ({ data }) => {
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
          <h6 className="font-italic">{data.extraData.description}</h6>
        ) : null}
        <CRow>
          <CCol>
            {data.extraData.devices.length} {t('common.devices')}
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            {`${t('contact.contact')}: ${data.extraData.extendedInfo.contact?.name ?? 'None'}`}
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            {`${t('configuration.location')}: ${
              data.extraData.extendedInfo.location?.name ?? 'None'
            }`}
          </CCol>
        </CRow>
        <CRow>
          <CCol>RRM: {data.extraData.rrm.length > 0 ? data.extraData.rrm : 'inherit'}</CCol>
        </CRow>
      </div>
    </ReactTooltip>
  );
};

VenueTooltip.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(VenueTooltip);
