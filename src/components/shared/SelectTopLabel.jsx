import React from 'react'

const SelectTopLabel = ({ 
    label, 
    info, 
    placeholder = "Select an option", 
    isRequired, 
    isOptional, 
    className = "mb-5",
    value,
    onChange,
    options = [],
    loading = false,
    disabled = false,
    ...props 
}) => {
    return (
        <div className={`${className}`}>
            <label className="form-label">
                {label}
                {isRequired ? <span className="text-danger">*</span> : ""}
                {isOptional ? <span className="fw-normal text-muted text-capitalize"> (Optional)</span> : ""}
            </label>
            <select 
                className="form-label form-control" 
                value={value || ''}
                onChange={onChange}
                disabled={disabled || loading}
                {...props}
            >
                <option value="">{loading ? "Loading..." : placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <small className="form-text text-muted">{info}</small>
        </div>
    )
}

export default SelectTopLabel