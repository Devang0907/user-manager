import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function SignIn() {
    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email is not valid').required('Email is required.'),
        password: Yup.string().required('Password is required.')
    })

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            try{
            const res = await axios.post("http://localhost:5000/admin/signin",values);

            if(res.status==200){
                const token=res.data.token;
                console.log(token);
                localStorage.setItem('token', token);
                navigate('/landing');
            }
        }
        catch(err){
            alert("invalid credentials.");
        }
        },
        validationSchema: LoginSchema
    });


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={formik.handleSubmit} className="w-1/3">
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2">
                        Email
                    </label>
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
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2">
                        Password
                    </label>
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

                <p className="mb-4">Don't have an account?  <Link className='text-blue-500' to='/signup'>Sign Up</Link></p>


                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded py-2 px-4">
                    Login
                </button>
            </form>
        </div>
    );
}

export default SignIn;
