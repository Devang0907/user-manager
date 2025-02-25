import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function VerifyEmailPage() {
    const navigate = useNavigate();
    const { token } = useParams();

    const handleVerify = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/admin/verify/${token}`);
            navigate('/');
            alert(res.data.message);
        } catch (error) {
            alert("Invalid or expired token");
            console.error("Error fetching data:", error);
        }
    };

    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                    Thank You for SignUp
                </h2>
                <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                  To verify yourself, click the button below:
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={handleVerify}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        verify me
                    </button>
                </div>
            </div>
        </main>
    )
}

export default VerifyEmailPage