import React from "react";

export default function PopUpService({ notify }) {
    return (
        <div
            className="card fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white shadow-lg md:w-[50%] w-[90%] h-[90%] overflow-y-scroll scrollbar-hide"
        >
            <div className="card-body ">
                {notify.map((item,index)=>(
                    <div>
                        <p className="card-title font-bold">{item.title}</p>
                        <p className="text-black dark:text-white">-{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}