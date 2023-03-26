export const Input = ({label, name, type, value, onChange, placeholder = "Enter your text here"}) => {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block text-xs sm:text-sm md:text-base text-gray-700 font-bold mb-2"
            >
                {label}
            </label>
            <input
                className="appearance-none border rounded w-full py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm md:text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={value}
                onChange={onChange}
                name={name}
                id={name}
                type={type}
                placeholder="Enter your text here"
            />
        </div>
    )
}

