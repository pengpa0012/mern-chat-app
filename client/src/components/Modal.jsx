import React from 'react'

export const Modal = ({message, onCancel, onOk, show}) => {
  return (
    <div className={`fixed inset-0 z-10 bg-gray-900/75 ${show ? "opacity-1 pointer-events-all" : "opacity-0 pointer-events-none"} transition duration-400`}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 my-12 p-6 rounded-md bg-gray-800">
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
          <button onClick={onCancel} className="mr-2 bg-gray-600 hover:bg-gray-700 p-2 rounded-md">Cancel</button>
          <button onClick={onOk} className="bg-red-600 hover:bg-red-700 hover: py-2 px-4 rounded-md">Ok</button>
        </div>
      </div>
    </div>
  )
}
