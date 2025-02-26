import React, { useState , useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from "react-i18next";
import api from '../api';

function SignUp() {
    const { t, i18n } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const SignUpSchema = Yup.object().shape({
        email: Yup.string().email(t("EMAIL_INVALID")).required(t("REQUIRED")),
        password: Yup.string().required(t("REQUIRED")).min(3, "Minimum 3 characters needed.")
    });

    //set language
    useEffect(() => {
            const savedLanguage = localStorage.getItem("language") || "en";
            i18n.changeLanguage(savedLanguage); // Set language from localStorage
        }, []);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            setIsSubmitting(true); // Start loading
            try {
                const res = await api.post("/admin/signup", values);

                if (res.status === 201) {
                    alert(t("VERIFICATION_EMAIL_SENT"));
                    navigate('/');
                }
            } catch (err) {
                if (err.response) {
                    alert(err.response.data.message || "Registration failed. Please try again.");
                } else if (err.request) {
                    alert(t("SERVER_NO_RESPONSE"));
                } else {
                    alert(t("UNEXPECTED_ERROR"));
                }
                console.error("Signup error:", err);
            } finally {
                setIsSubmitting(false); // Stop loading
            }
        },
        validationSchema: SignUpSchema
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">{t("SIGN_UP")}</h2>
            <form onSubmit={formik.handleSubmit} className="w-1/3 mb-10">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">{t("EMAIL")}</label>
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
                    <label className="block text-sm font-medium mb-2" htmlFor="password">{t("PASSWORD")}</label>
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
                <button
                    type="submit"
                    className={`text-white rounded py-2 px-4 w-full ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500'}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t("LOADING") : t("SIGN_UP")}
                </button>
            </form>
            <p className="mb-4"> {t("ACCOUNT")} <Link className='text-blue-500' to='/'>{t("SIGN_IN")}</Link></p>
        </div>
    );
}

export default SignUp;
