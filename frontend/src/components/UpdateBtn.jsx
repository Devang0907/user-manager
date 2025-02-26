import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";

function UpdateBtn({ id }) {

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    //set language
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        i18n.changeLanguage(savedLanguage); // Set language from localStorage
    }, []);

    return (
        <button
            className="bg-blue-400 text-white py-1 px-4 rounded hover:bg-blue-500 transition-all"
            onClick={() => {
                navigate(`/update/${id}`)
            }}
        >
             {t("UPDATE")}
        </button>
    )
}

export default UpdateBtn