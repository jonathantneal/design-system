import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { themeGet } from "styled-system";
import { theme, themeColor } from "../theme";

const TRACK_HEIGHT = 3;

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: inline-flex;
`;

const trackStyle = css`
  background-color: transparent;
  border-radius: 9999px;
  height: ${TRACK_HEIGHT}px;
`;

const thumbStyle = css`
  appearance: none;
  background-color: white;
  border: none;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px ${themeColor("grays.4")};
  height: ${themeGet("space.3")};
  margin-top: -6px;
  transition: transform 100ms ease;
  width: ${themeGet("space.3")};
`;

const thumbFocusStyle = css`
  box-shadow: inset 0 0 0 1px ${themeColor("blues.4")};
`;

const Input = styled.input`
  appearance: none;
  background: transparent;
  cursor: pointer;
  display: block;
  padding: ${themeGet("space.1")} 0;
  margin: 0;
  width: 100%;

  &::-webkit-slider-runnable-track {
    ${trackStyle}
  }

  &::-moz-range-track {
    ${trackStyle}
  }

  &::-webkit-slider-thumb {
    ${thumbStyle}
  }

  &::-moz-range-thumb {
    ${thumbStyle}
  }

  &:hover {
    &::-webkit-slider-thumb {
      box-shadow: inset 0 0 0 1px ${themeColor("grays.5")};
    }
  }

  &:focus {
    outline: none;

    &::-webkit-slider-thumb {
      ${thumbFocusStyle}
    }

    &::-moz-range-thumb {
      ${thumbFocusStyle}
    }
  }

  /* remove focus border in Firefox:
	https://css-tricks.com/sliding-nightmare-understanding-range-input */
  ::-moz-focus-outer {
    border: 0;
  }
`;

Input.defaultProps = { theme };

const Track = styled.div`
  ${trackStyle}
	background-color: ${themeColor("grays.3")};
	position: absolute;
  left: 0;
  top: 50%;
  right: 0;
	z-index: -1;
  transform: translateY(-50%);
`;

const InnerTrack = styled.div`
  ${trackStyle}
  height: 100%;
  background-color: ${themeColor("blues.3")};
`;

export const Slider = props => {
  const isControlled = Boolean(props.value) && Boolean(props.onChange);
  const { min, max } = props;
  const [value, setValue] = useState(props.value || props.defaultValue);
  const percentage = ((value - min) * 100) / (max - min || 100);

  useEffect(() => setValue(props.value), [props.value]);

  const handleChange = event => {
    const newValue = event.target.value;
    setValue(newValue);

    if (isControlled) {
      props.onChange(event);
    }
  };

  const handleKeyDown = event => {
    if (props.onKeyDown) {
      props.onKeyDown(event);
    }

    if (event.shiftKey) {
      event.preventDefault();
      const { keyCode } = event;

      if (keyCode === 37 || keyCode === 40) {
        setValue(Math.max(props.min, parseInt(value, 10) - props.largeStep));
      } else if (keyCode === 39 || keyCode === 38) {
        setValue(Math.min(props.max, parseInt(value, 10) + props.largeStep));
      }
    }
  };

  return (
    <Wrapper>
      <Input
        {...props}
        type="range"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Track>
        <InnerTrack style={{ width: `${percentage}%` }} />
      </Track>
    </Wrapper>
  );
};

Slider.defaultProps = {
  defaultValue: 0,
  step: "1",
  largeStep: 10,
  min: 0,
  max: 100,
};