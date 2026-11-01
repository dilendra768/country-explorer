import { useFormik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  country: Yup.string()
    .trim()
    .required('Country name is required')
    .matches(/^[\p{L}\s]+$/u, 'Numbers and symbols are not allowed')
    .min(2, 'Please enter at least 2 letters'),
});

export default function SearchForm({ onSearch, initial = '' }: { onSearch: (term: string) => void; initial?: string }) {
  const formik = useFormik({
    initialValues: { country: initial },
    validationSchema: schema,
    onSubmit: (values) => onSearch(values.country.trim()),
  });
  const error = formik.touched.country && formik.errors.country;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="w-full max-w-xl">
      <div className="flex gap-2">
        <input
          name="country"
          type="text"
          placeholder="Search a country, e.g. Japan"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={!!error}
          className="flex-1 rounded border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
        />
        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
          Search
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.country}</p>}
    </form>
  );
}
