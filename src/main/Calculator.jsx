import React, { useReducer } from "react";
import "./Calculator.css";

import Button from "../components/Button";
import Display from "../components/Display";

const initialState = {
  displayValue: "0",
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0,
};

function formReducer(state, action) {
  if ("reset" in action) return initialState;
  if (!("payload" in action)) return state;
  return { ...state, ...action.payload };
}

export default function Calculator() {
  const [form, setForm] = useReducer(formReducer, initialState);

  const clearMemory = () => {
    setForm({ reset: true });
  };

  const setOperation = (operation) => {
    if (form.current === 0) {
      setForm({ payload: { operation, current: 1, clearDisplay: true } });
    } else {
      const equals = operation === "=";
      const currentOperation = form.operation;

      const values = [...form.values];
      try {
        // eslint-disable-next-line
        values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`);
      } catch (e) {
        values[0] = form.values[0];
      }
      values[1] = 0;

      setForm({
        payload: {
          displayValue: values[0],
          operation: equals ? null : operation,
          current: equals ? 0 : 1,
          clearDisplay: !equals,
          values,
        },
      });
    }
  };

  const addDigit = (n) => {
    if (n === "." && form.displayValue.includes(".")) {
      return;
    }

    const clearDisplay = form.displayValue === "0" || form.clearDisplay;
    const currentValue = clearDisplay ? "" : form.displayValue;
    const displayValue = currentValue + n;
    setForm({ payload: { displayValue, clearDisplay: false } });

    if (n !== ".") {
      const i = form.current;
      const newValue = parseFloat(displayValue);
      const values = [...form.values];
      values[i] = newValue;
      setForm({ payload: { values } });
    }
  };

  return (
    <div className="calculator">
      <Display value={form.displayValue} />
      <Button label="AC" click={clearMemory} triple />
      <Button label="/" click={setOperation} operation />
      <Button label="7" click={addDigit} />
      <Button label="8" click={addDigit} />
      <Button label="9" click={addDigit} />
      <Button label="*" click={setOperation} operation />
      <Button label="4" click={addDigit} />
      <Button label="5" click={addDigit} />
      <Button label="6" click={addDigit} />
      <Button label="-" click={setOperation} operation />
      <Button label="1" click={addDigit} />
      <Button label="2" click={addDigit} />
      <Button label="3" click={addDigit} />
      <Button label="+" click={setOperation} operation />
      <Button label="0" click={addDigit} double />
      <Button label="." click={addDigit} />
      <Button label="=" click={setOperation} operation />
    </div>
  );
}
