import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from "react-i18next";
import api from '../api';

function SignIn() {
    const { t, i18n } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email(t("EMAIL_INVALID")).required(t("REQUIRED")),
        password: Yup.string().required(t("REQUIRED"))
    });

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        i18n.changeLanguage(savedLanguage); // Set language from localStorage
    }, []);

    const handleLanguageChange = (e) => {
        const selectedLang = e.target.value;
        i18n.changeLanguage(selectedLang);
        localStorage.setItem("language", selectedLang);
    };


    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            setIsSubmitting(true); // Start loading
            try {
                const res = await api.post("/admin/signin", values);

                if (res.status === 201) {
                    const token = res.data.token;
                    localStorage.setItem("token", token);
                    navigate("/landing");
                } else {
                    alert(res.data.message || "Login failed. Please try again.");
                }
            } catch (err) {
                if (err.response) {
                    alert(err.response.data.message || "Login failed. Please check your credentials.");
                } else if (err.request) {
                    alert("No response from server. Please try again later.");
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
                console.error("Login error:", err);
            } finally {
                setIsSubmitting(false); // Stop loading
            }
        },
        validationSchema: LoginSchema
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">{t("LOGIN")}</h2>

            <select onChange={handleLanguageChange} value={i18n.language}>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
            </select>

            <form onSubmit={formik.handleSubmit} className="w-1/3">
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2">
                        {t("EMAIL")}
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
                        {t("PASSWORD")}
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

                <p className="mb-4">{t("NO_ACCOUNT")}  <Link className='text-blue-500' to='/signup'>{t("SIGN_UP")} </Link></p>

                <button
                    type="submit"
                    className={`text-white rounded py-2 px-4 w-full ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500'}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t("LOADING") : t("LOGIN")}
                </button>
            </form>
        </div>
    );
}

export default SignIn;
