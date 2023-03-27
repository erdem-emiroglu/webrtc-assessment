import {useState} from "react";
import {Title} from "@/components/common";

export const Modal = ({isOpen, onClose, children, title}) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal__wrapper">
            <div
                className="modal__container">
                <button
                    onClick={onClose}
                    className="modal__close"
                >
                    &times;
                </button>
                <div className="text-center">
                    <Title title={title}/>
                </div>
                {children}
            </div>
        </div>
    );
};
