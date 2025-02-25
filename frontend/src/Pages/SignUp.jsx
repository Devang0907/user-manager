import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';



function SignUp() {

    const SignUpSchema = Yup.object().shape({
        email: Yup.string().email('Email is not valid').required('Email is required.'),
        password: Yup.string().required('Password is required.').min(3,"Minimum 3 character needed.")
    })

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const res = await axios.post("http://localhost:5000/admin/signup", values)
                    
                if (res.status == 201) {
                    alert("You are register as admin.")
                    navigate('/')
                }
            }
            catch (err) {
                alert("Admin already exist")
            }
        },
        validationSchema: SignUpSchema
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={formik.handleSubmit} className="w-1/3 mb-10">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border rounded w-full py-2 px-3"
                        required
                    />
                    {formik.errors.email && formik.touched.email && (
                        <div className="mt-1 text-red-500 text-xs p-1 rounded">
                            {formik.errors.email}
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border rounded w-full py-2 px-3"
                        required
                    />
                    {formik.errors.password && formik.touched.password && (
                        <div className="mt-1 text-red-500 text-xs p-1 rounded">
                            {formik.errors.password}
                        </div>
                    )}
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4">
                    Sign Up
                </button>
            </form>
            <p className="mb-4">Already have an account?  <Link className='text-blue-500' to='/'>Sign In</Link></p>
        </div>
    );
};

export default SignUp;