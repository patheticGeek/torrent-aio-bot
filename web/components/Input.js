import React from "react";
import PropTypes from "prop-types";

function Input({ label, labelProps, wrapperClass, onChange, id, ...props }) {
  return (
    <div className={`form-group ${wrapperClass ? wrapperClass : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input className="form-control" id={id} onChange={e => onChange(e.target.value)} {...props} />
    </div>
  );
}

Input.defaultProps = {
  type: "text",
  onChange: text => console.log("Value: ", text)
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  wrapperClass: PropTypes.string,
  type: PropTypes.oneOf(["text", "password", "number"]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool
};

export default Input;
