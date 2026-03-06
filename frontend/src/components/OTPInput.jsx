import React, { useRef, useState } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val && !/^\d$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    const code = newValues.join('');
    if (code.length === length && newValues.every((v) => v !== '')) {
      onComplete(code);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, length);
    if (!/^\d+$/.test(pasted)) return;

    const newValues = [...values];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setValues(newValues);

    const focusIndex = Math.min(pasted.length, length - 1);
    inputs.current[focusIndex].focus();

    if (pasted.length === length) {
      onComplete(pasted);
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;
