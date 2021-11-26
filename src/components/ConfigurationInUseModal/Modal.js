import React from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { useHistory } from 'react-router-dom';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

const listLink = (id, url, history) => (
  <li key={createUuid()}>
    <CButton color="link" onClick={() => history.push(url)}>
      {id}
    </CButton>
  </li>
);

const ConfigurationInUseModal = ({ t, show, toggle, config, details }) => {
  const history = useHistory();

  return (
    <CModal size="lg" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{config?.name}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <h6>{t('entity.entities')}</h6>
        <ul>{details?.ent?.map((ent) => listLink(ent.name, `/entity/${ent.uuid}`, history))}</ul>
        <h6>{t('entity.venues')}</h6>
        <ul>{details?.ven?.map((ven) => listLink(ven.name, `/venues/${ven.uuid}`, history))}</ul>
        <h6>Devices</h6>
        <ul>
          {details?.inv?.map((dev) => (
            <li key={createUuid()}>{dev.name}</li>
          ))}
        </ul>
      </CModalBody>
    </CModal>
  );
};

ConfigurationInUseModal.propTypes = {
  t: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  config: PropTypes.instanceOf(Object),
  details: PropTypes.instanceOf(Object),
};

ConfigurationInUseModal.defaultProps = {
  config: null,
  details: null,
};

export default ConfigurationInUseModal;
