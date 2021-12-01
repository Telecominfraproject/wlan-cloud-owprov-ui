/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEntity } from 'ucentral-libs';
import { getChildlessPadding } from 'utils/sidebarHelper';
import { cilGlobeAlt, cilSitemap, cilBank } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const getIcon = (uuid, isVenue) => {
  if (uuid === '0000-0000-0000' && !isVenue)
    return <CIcon size="xl" content={cilGlobeAlt} className="mr-3" />;
  if (!isVenue) return <CIcon size="xl" content={cilSitemap} className="mr-3" />;
  return <CIcon size="xl" content={cilBank} className="mr-3" />;
};

const SidebarChildless = ({ uuid, name, onClick, path, isVenue }) => {
  const { entity } = useEntity();
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);
  return (
    <li className="c-sidebar-nav-item">
      <a
        role="button"
        className={`c-sidebar-nav-link font-weight-bold ${
          uuid === entity?.uuid ? 'bg-light text-dark' : ''
        }`}
        onClick={() => {
          onClick();
          toggle();
        }}
        tabIndex="0"
        aria-label="menu dropdown"
        style={{ paddingLeft: `${getChildlessPadding(path)}px` }}
      >
        {getIcon(uuid, isVenue)}
        <div className="text-truncate" style={{ width: '256px' }}>
          {name}
        </div>
      </a>
    </li>
  );
};

SidebarChildless.propTypes = {
  uuid: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  name: PropTypes.string,
  path: PropTypes.string.isRequired,
  isVenue: PropTypes.bool.isRequired,
};

SidebarChildless.defaultProps = {
  onClick: () => null,
  name: '',
};

export default SidebarChildless;
