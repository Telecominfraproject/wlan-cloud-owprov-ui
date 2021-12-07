import * as React from 'react';
import PropTypes from 'prop-types';

const HeartShape = ({ className }) => (
  <svg
    width="16"
    height="16"
    fill="currentColor"
    className={className}
    viewBox="0 0 475.528 475.528"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path
          d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
        c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
        C-54.844,154.658,26.437,351.092,237.376,436.245z"
        />
      </g>
    </g>
  </svg>
);

HeartShape.propTypes = {
  className: PropTypes.string,
};

HeartShape.defaultProps = {
  className: '',
};

export default HeartShape;
