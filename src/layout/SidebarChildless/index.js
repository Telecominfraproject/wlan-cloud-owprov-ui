/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEntity } from 'ucentral-libs';
import { getChildlessPadding } from 'utils/sidebarHelper';

const SidebarChildless = ({ uuid, name, onClick, path }) => {
  const { entity } = useEntity();
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);
  return (
    <li className="c-sidebar-nav-item">
      <a
        role="button"
        className={`c-sidebar-nav-link ${uuid === entity?.uuid ? 'bg-light text-dark' : ''}`}
        onClick={() => {
          onClick();
          toggle();
        }}
        tabIndex="0"
        aria-label="menu dropdown"
        style={{ paddingLeft: `${getChildlessPadding(path)}px` }}
      >
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
};

SidebarChildless.defaultProps = {
  onClick: () => null,
  name: '',
};

export default SidebarChildless;
