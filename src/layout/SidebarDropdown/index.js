/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SidebarDropdown = ({ name, children, onClick }) => {
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);

  return (
    <li className={show ? 'c-sidebar-nav-dropdown c-show' : 'c-sidebar-nav-dropdown'}>
      <a
        role="button"
        className="c-sidebar-nav-dropdown-toggle"
        onClick={() => {
          onClick();
          toggle();
        }}
        tabIndex="0"
        aria-label="menu dropdown"
      >
        {name}
      </a>
      <ul className="c-sidebar-nav-dropdown-items">{children}</ul>
    </li>
  );
};

SidebarDropdown.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.node,
};

SidebarDropdown.defaultProps = {
  onClick: () => null,
  name: '',
  children: <></>,
};

export default SidebarDropdown;
