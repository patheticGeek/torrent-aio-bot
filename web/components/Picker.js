import React, { useState } from "react";
import PropTypes from "prop-types";

function Picker({ label, labelProps, wrapperClass, onChange, id, options, ...props }) {
  const [value, setValue] = useState("");

  return (
    <div className={`form-group${wrapperClass ? ` ${wrapperClass}` : ""}`}>
      <label htmlFor={id} {...labelProps}>
        {label}
      </label>
      <select value={value} className="form-control" id={id} onChange={e => onChange(e.target.value)} {...props}>
        <option>Select one</option>
        {options &&
          options.map(opt => (
            <option value={opt.value} key={opt.value} onClick={e => setValue(e.target.value)}>
              {opt.name}
            </option>
          ))}
      </select>
    </div>
  );
}

Picker.defaultProps = {
  onChange: text => console.log("Value: ", text)
};

Picker.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  wrapperClass: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, name: PropTypes.string.isRequired }))
    .isRequired
};

export default Picker;
