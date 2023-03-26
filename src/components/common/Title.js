import cn from "classnames";

export const Title = ({ title, className }) => {
    return (
        <h2 className={cn("text-2xl font-semibold text-gray-700 mb-4", className)}>
            {title}
        </h2>
    );
};
