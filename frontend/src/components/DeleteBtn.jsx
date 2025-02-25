import React from 'react'
import { deleteUser } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

function DeleteBtn({id}) {

    const dispatch=useDispatch();

    return (
        <button
            className="bg-red-400 text-white py-1 px-4 rounded hover:bg-red-500 transition-all"
            onClick={()=>{
                dispatch(deleteUser(id));
            }}
        >
            Delete
        </button>
    )
}

export default DeleteBtn