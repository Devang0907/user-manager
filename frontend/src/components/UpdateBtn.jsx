import React from 'react'
import {useNavigate } from 'react-router-dom'


function UpdateBtn({id}) {

    const navigate=useNavigate();

    return (
        <button
            className="bg-blue-400 text-white py-1 px-4 rounded hover:bg-blue-500 transition-all"
            onClick={()=>{
                navigate(`/update/${id}`)
            }}
        >
            Update
        </button>
    )
}

export default UpdateBtn