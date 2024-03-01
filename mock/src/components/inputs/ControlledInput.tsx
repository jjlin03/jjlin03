import "../../../../../mock-jlin142-kczheng/mock/src/styles/main.css";
import { Dispatch, SetStateAction } from 'react';

/**
 * This is the interface for the input for ControlledInput.
 */
interface ControlledInputProps {
    value: string, 
    setValue: Dispatch<SetStateAction<string>>,
    ariaLabel: string 
  }
  
  /**
   * This function covers the functionality of the command box.
   * @param param0 This input implements the ControlledInputProps interface.
   * @returns new command box
   */
  export function ControlledInput({value, setValue, ariaLabel}: ControlledInputProps) {
    return (
      <input type="text" className="repl-command-box"
            value={value} 
            placeholder="Enter command here!"
            onChange={(ev) => setValue(ev.target.value)}
            aria-label={ariaLabel}>
      </input>
    );
  }