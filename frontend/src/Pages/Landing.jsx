import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import DeleteBtn from '../components/DeleteBtn';
import UpdateBtn from '../components/UpdateBtn';
import { useTranslation } from "react-i18next";

function Landing() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

 //set language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage); // Set language from localStorage
  }, []);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

 
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
};

  const createUser = () => {
    navigate('/add');
  };

  const logoutAdmin = () => {
    localStorage.removeItem("token");
    navigate('/');
  }

  const changePass = () => {
    navigate('/changePassword')
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-slate-200 p-4 shadow-md">
        <div className='flex'>
        <span className="text-slate-900 text-3xl font-bold ml-4">{t("USER_LIST")}</span>
        <div className='ml-5 flex items-center'>
        <select onChange={handleLanguageChange} value={i18n.language}>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
            </select>
        </div>
        </div>
       

        <div>
          <button
            className="bg-green-500 text-white font-medium mx-5 px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
            onClick={createUser}
          >
           {t("ADD_USER")}
          </button>
          <button
            className="bg-cyan-600 text-white font-medium px-6 mr-5 py-2 rounded-lg hover:bg-cyan-700 transition-all"
            onClick={changePass}
          >
            {t("CHANGE_PASSWORD")}  
          </button>
          <button
            className="bg-red-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
            onClick={logoutAdmin}
          >
            {t("LOGOUT")}
          </button>
        </div>

      </nav>

      {/* Content Section */}
      <div className="p-4">
        {/* Status Messages */}
        {status === 'loading' && <p className="text-gray-500">{t("LOADING")}</p>}
        {status === 'failed' && <p className="text-red-500">You are not authorized.</p>}
        {status === 'succeeded' && users.length === 0 && (
          <h1 className="text-center text-gray-700 text-lg">{t("NO_USERS_FOUND")}</h1>
        )}

        {/* Users Table */}
        {status === 'succeeded' && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              {/* Table Header */}
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-lg font-semibold">{t("NAME")}</th>
                  <th className="py-2 px-4 border-b text-left text-lg font-semibold">{t("EMAIL")}</th>
                  <th className="py-2 px-4 border-b text-left text-lg font-semibold">{t("PHONE")}</th>
                  <th className="py-2 px-4 border-b text-left text-lg font-semibold">{t("ACTION")}</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.phoneNo}</td>
                    <td className="py-2 px-4 flex space-x-4">
                      <DeleteBtn id={user.id} />
                      <UpdateBtn id={user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing;
