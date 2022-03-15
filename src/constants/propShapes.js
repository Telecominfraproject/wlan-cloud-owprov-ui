import PropTypes from 'prop-types';

export const NoteShape = {
  note: PropTypes.string.isRequired,
  created: PropTypes.number.isRequired,
  createdBy: PropTypes.string.isRequired,
};

export const JobParameter = {
  tag: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export const SubscriberShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const ContactShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const EntityShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const LocationShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const TagShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  serialNumber: PropTypes.string.isRequired,
};

export const JobShape = {
  batch: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
  commonNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  completed: PropTypes.number.isRequired,
  completedNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  creator: PropTypes.string.isRequired,
  errorNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  id: PropTypes.string.isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape(JobParameter).isRequired).isRequired,
  started: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  submitted: PropTypes.number.isRequired,
};

export const RequirementsShape = {
  accessPolicy: PropTypes.string,
  passwordPolicy: PropTypes.string,
  passwordPattern: PropTypes.string,
};

export const DefaultRequirements = {
  accessPolicy: '',
  passwordPolicy: '',
  passwordPattern: '',
};

export const ConfigurationSectionShape = PropTypes.shape({
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    weight: PropTypes.number.isRequired,
    configuration: PropTypes.instanceOf(Object).isRequired,
  }),
  invalidValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]).isRequired,
    }),
  ).isRequired,
  isDirty: PropTypes.bool.isRequired,
});
