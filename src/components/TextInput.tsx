import React, { forwardRef, InputHTMLAttributes } from "react";
import { createUseStyles } from "react-jss";

interface TextInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const useStyle = createUseStyles({
  title: {
    display: "block",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: 7,
    marginTop: "0.7rem",
    border: "thin solid black",
  },
});

const TextInput = forwardRef<HTMLInputElement, TextInput>(
  ({ label, ...props }, ref) => {
    const { input, title } = useStyle();

    return (
      <div>
        <label htmlFor={props.id} className={title}>
          {label}
          <input {...props} ref={ref} className={input} />
        </label>
      </div>
    );
  }
);

export default TextInput;
