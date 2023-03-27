export const Input = ({label, name, type, value, onChange, placeholder = "Enter your text here"}) => {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="input__label"
            >
                {label}
            </label>
            <input
                className="input"
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

