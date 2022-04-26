import { object, number } from 'yup';

export default (t, useDefault = false) => {
  const shape = object()
    .shape({
      id: number().required(t('form.required')).moreThan(0).lessThan(4051).default(1080),
    })
    .default({
      id: 0,
    });

  return useDefault ? shape : shape.nullable().default(undefined);
};
