import React from 'react';
import { useNavigate } from 'react-router-dom'
import cryptoRandomString from 'crypto-random-string';
import { useDispatch } from 'react-redux';
import { addUsers } from '../redux/slices/userSlice';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function AddForm() {
  const phoneRegExp = /^[0-9]{10}$/g;
  const random_id = cryptoRandomString({ length: 4 });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    name: Yup.string('only in alphabets').required('Required.'),
    email: Yup.string().email('Email is not valid').required('Required.'),
    phoneNo: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
  })

  const formik = useFormik({
    initialValues: {
      id: random_id,
      name: '',
      email: '',
      phoneNo: '',
    },
    onSubmit: async (values) => {
      try {
        dispatch(addUsers(values))
        navigate('/landing')

      }
      catch (err) {
        console.log(err);
      }
    },
    validationSchema: schema
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-20">
      <form
        className="bg-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-9">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name && (
            <div className="mt-1 text-red-500 text-xs p-1 rounded">
              {formik.errors.name}
            </div>
          )}
        </div>
        <div className="mb-9">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            placeholder="Email Id"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <div className="mt-1 text-red-500 text-xs p-1 rounded">
              {formik.errors.email}
            </div>
          )}
        </div>
        <div className="mb-9">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNo"
          >
            Phone Number
          </label>
          <input
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNo"
            type="text"
            name="phoneNo"
            placeholder="Phone Number"
            value={formik.values.phoneNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phoneNo && formik.touched.phoneNo && (
            <div className="mt-1 text-red-500 text-xs p-1 rounded">
              {formik.errors.phoneNo}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          />
        </div>
      </form>
    </div>
  );
}

export default AddForm;
