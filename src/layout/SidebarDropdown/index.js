/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEntity } from 'ucentral-libs';
import { getDropdownPadding } from 'utils/sidebarHelper';

const SidebarDropdown = ({ uuid, name, children, onClick, path }) => {
  const { entity } = useEntity();
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);

  return (
    <li className={show ? 'c-sidebar-nav-dropdown c-show' : 'c-sidebar-nav-dropdown'}>
      <a
        role="button"
        className={`c-sidebar-nav-dropdown-toggle ${
          uuid === entity?.uuid ? 'bg-light text-dark' : ''
        }`}
        onClick={() => {
          onClick();
          toggle();
        }}
        tabIndex="0"
        aria-label="menu dropdown"
        style={{ paddingLeft: `${getDropdownPadding(path)}px` }}
      >
        <div className="text-truncate" style={{ width: '256px' }}>
          {name}
        </div>
      </a>
      <ul className="c-sidebar-nav-dropdown-items">{children}</ul>
    </li>
  );
};

SidebarDropdown.propTypes = {
  uuid: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.node,
  path: PropTypes.string.isRequired,
};

SidebarDropdown.defaultProps = {
  onClick: () => null,
  name: '',
  children: <></>,
};

export default SidebarDropdown;
