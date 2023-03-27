import cn from "classnames";

export const Title = ({ title, className }) => {
    return (
        <h2 className={cn("title", className)}>
            {title}
        </h2>
    );
};
