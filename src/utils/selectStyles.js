export default {
  control: (provided) => ({
    ...provided,
    minHeight: '35px',
    height: '35px',
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: '35px',
    padding: '0 6px',
  }),

  input: (provided) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '35px',
  }),
};
