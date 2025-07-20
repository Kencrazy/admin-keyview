import React from "react";

export default function BlockAction({ setDisplay }) {
  return (
    <div className="relative max-w-[290px] mx-auto  top-1/3 overflow-hidden rounded-lg bg-white text-left shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
      <div className="bg-white px-4 pb-4 pt-5">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-red-600"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-3 text-center">
          <span className="text-base font-semibold leading-6 text-gray-900">
            Activate account
          </span>
          <p className="mt-2 text-sm leading-5 text-gray-500">Your trial has ended! Unlock the full experience—activate your plan today and keep the journey going! It is only $1</p>
        </div>
        <div className="mt-3 bg-gray-50 px-4">
          <button
            type="button"
            onClick={()=>setDisplay(true)}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 border border-transparent cursor-pointer"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  );
}