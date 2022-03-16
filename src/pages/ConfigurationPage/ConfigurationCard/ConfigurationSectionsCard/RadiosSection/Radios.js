import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import RadioPicker from './RadioPicker';
import SingleRadio from './SingleRadio';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  radioBands: PropTypes.arrayOf(PropTypes.string).isRequired,
  radioBandsLength: PropTypes.number.isRequired,
};

const Radios = ({ editing, arrayHelpers, radioBands, radioBandsLength }) => (
  <>
    {radioBandsLength >= 1 && <SingleRadio index={0} remove={arrayHelpers.remove} editing={editing} />}
    {radioBandsLength >= 2 && <SingleRadio index={1} remove={arrayHelpers.remove} editing={editing} />}
    {radioBandsLength >= 3 && <SingleRadio index={2} remove={arrayHelpers.remove} editing={editing} />}
    {radioBandsLength >= 4 && <SingleRadio index={3} remove={arrayHelpers.remove} editing={editing} />}
    {radioBandsLength >= 5 && <SingleRadio index={4} remove={arrayHelpers.remove} editing={editing} />}
    <RadioPicker radios={radioBands} editing={editing} arrayHelpers={arrayHelpers} />
  </>
);

Radios.propTypes = propTypes;
export default React.memo(Radios, isEqual);
