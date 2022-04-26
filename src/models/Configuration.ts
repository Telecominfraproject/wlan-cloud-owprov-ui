import { Note } from './Note';

export interface Configuration {
  name: string;
  description: string;
  id: string;
  notes: Note[];
}

interface ConfigurationNestedForm {
  isDirty: boolean;
  isValid: boolean;
}

export interface ConfigurationNestedProps {
  __form: ConfigurationNestedForm;
  data: Configuration[];
}
