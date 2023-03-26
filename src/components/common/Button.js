import cn from "classnames";

// add config for type/variant -> className mapping

export const Button = ({ title, onClick, className }) => {
    return (
        <button
            className={cn("button", className)}
            onClick={onClick}
        >
            {title}
        </button>
    );
};
