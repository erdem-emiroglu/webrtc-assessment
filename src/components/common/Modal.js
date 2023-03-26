import {useState} from "react";
import {Title} from "@/components/common";

export const Modal = ({isOpen, onClose, children, title}) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-white flex">
            <div
                className="relative p-4 sm:p-6 mx-auto my-8 sm:my-16 md:my-32 max-w-3xl w-full h-auto max-h-full overflow-auto bg-white rounded shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                <Title title={title}/>
                {children}
            </div>
        </div>
    );
};
