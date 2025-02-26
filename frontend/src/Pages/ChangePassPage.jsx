import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance

function ChangePassPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Set language from localStorage on component load
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        i18n.changeLanguage(savedLanguage);
    }, []);

    // Yup Validation Schema
    const schema = Yup.object().shape({
        email: Yup.string().email(t("EMAIL_INVALID")).required(t("REQUIRED")),
        oldPassword: Yup.string().required(t("REQUIRED")),
        newPassword: Yup.string()
            .min(3, t("PASSWORD_MIN"))
            .required(t("REQUIRED"))
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            oldPassword: "",
            newPassword: ""
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            try {
                const response = await api.post("/admin/change_pass", values);

                setMessage(response.data.message);
                navigate("/landing"); // Redirect after success
            } catch (error) {
                setMessage(error.response?.data?.message || t("ERROR_OCCURED"));
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="w-full max-w-xl mx-auto mt-20">
            <form
                className="bg-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={formik.handleSubmit}
            >
                <h2 className="text-xl font-bold mb-4">{t("CHANGE_PASSWORD")}</h2>

                {/* Email Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        {t("EMAIL")}
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        id="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-red-500 text-xs">{formik.errors.email}</div>
                    )}
                </div>

                {/* Old Password Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">
                        {t("OLD_PASSWORD")}
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        id="oldPassword"
                        type="password"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.oldPassword && formik.errors.oldPassword && (
                        <div className="text-red-500 text-xs">{formik.errors.oldPassword}</div>
                    )}
                </div>

                {/* New Password Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                        {t("NEW_PASSWORD")}
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        id="newPassword"
                        type="password"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.newPassword && formik.errors.newPassword && (
                        <div className="text-red-500 text-xs">{formik.errors.newPassword}</div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        disabled={loading}
                    >
                        {loading ? t("LOADING") : t("CHANGE_PASSWORD")}
                    </button>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <p className="mt-4 text-center text-sm font-bold text-blue-600">{message}</p>
                )}
            </form>
        </div>
    );
}

export default ChangePassPage;
