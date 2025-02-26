import React, { useEffect } from 'react'
import { deleteUser } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

function DeleteBtn({ id }) {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    //set language
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        i18n.changeLanguage(savedLanguage); // Set language from localStorage
    }, []);


    return (
        <button
            className="bg-red-400 text-white py-1 px-4 rounded hover:bg-red-500 transition-all"
            onClick={() => {
                dispatch(deleteUser(id));
            }}
        >
            {t("DELETE")}
        </button>
    )
}

export default DeleteBtn