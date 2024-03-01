import { Dispatch, SetStateAction, useState } from "react";
import "../../../../../mock-jlin142-kczheng/mock/src/styles/main.css";
import { ControlledInput } from "../inputs/ControlledInput";
import { topNBAScorers, topNBARebounders } from "../data/mockedJson";

const CSVMap = new Map<string, string[][]>([
  ["topNBAScorers", topNBAScorers],
  ["topNBARebounders", topNBARebounders],
]);


/**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
 * the command is done executing.
 *
 * The arguments passed in the input (which need not be named "args") should
 * *NOT* contain the command-name prefix.
 */
export interface REPLFunction {
  (args: Array<string>): String | String[][];
}

/**
 * This is the interface for the input for REPLInput
 */
interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  // CHANGED
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  file: string[][];
  setFile: Dispatch<SetStateAction<string[][]>>;
  commandHistory: string[];
  setCommandHistory: Dispatch<SetStateAction<string[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

/**
 * This function handles all of the command box input functionality.
 * 
 * @param props current states of our repl
 * @returns new command box and button 
 */
export function REPLInput(props: REPLInputProps) {
  const functionMap = new Map<string, REPLFunction>();
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  /**
   * This function is triggered when the button is clicked.
   * It updates the states according to the command box value.
   *
   * @param commandString command to be executed
   */
  function handleSubmit(commandString: string) {
    setCount(count + 1);
    var nextHistory: string;
    commandString = commandString.trim(); // added
    var inputs: string[] = commandString.split(" <");
    const command = inputs[0];
    if (functionMap.has(command)) {
      const currFunc = functionMap.get(command);
      if (currFunc != undefined) {
        nextHistory = String(currFunc(inputs));
      } else {
        nextHistory = "Invalid Command";
      }
    } else {
      nextHistory = "Invalid Command";
    }
    props.setCommandHistory([...props.commandHistory, commandString]);
    props.setHistory([...props.history, nextHistory]);
    setCommandString("");
  }

  /**
   * This function loads the csv file.
   *
   * @param inputs splitted array of command string input
   * @returns string indicating return success or failure message
   */
  const loadCSVFile: REPLFunction = (inputs: Array<string>) => {
    var filepath: string = inputs[1];
    if (filepath.charAt(filepath.length - 1) !== ">") {
      return "Incorrect formatting: please put <> around your filename";
    }
    var thisFile = CSVMap.get(filepath.substring(0, filepath.length - 1));
    if (thisFile !== undefined) {
      props.setFile(thisFile);
      return "File successfully found";
    } else {
      return "File not found";
    }
  };

  /**
   * This function views the csv file
   *
   * @param inputs splitted array of command string input
   * @returns html formatted view of csv file
   */
  const viewCSVFile: REPLFunction = (inputs: Array<string>) => {
    if (props.file[0].length == 0) {
      return "No file loaded";
    } else {
      return htmlFormat(props.file);
    }
  };

  /**
   * This function searches the csv file
   *
   * @param inputs splitted array of command string input
   * @returns subset of html table based on search value
   */
  const searchCSVFile: REPLFunction = (inputs: Array<string>) => {
    var query;
    if (inputs.length === 3) {
      var column = inputs[1];
      var value = inputs[2];
      if (
        column.charAt(column.length - 1) !== ">" ||
        value.charAt(value.length - 1) !== ">"
      ) {
        return "Incorrect formatting: search query must have form: search <column> <value>";
      }
      query = searchHtmlFormat(
        props.file,
        column.substring(0, column.length - 1),
        value.substring(0, value.length - 1)
      );
    } else if (inputs.length === 2) {
      var value = inputs[1];
      if (value.charAt(value.length - 1) !== ">") {
        return "Incorrect formatting: search query must have form: search <column> <value>";
      }
      query = searchHtmlFormatNoColumn(
        props.file,
        value.substring(0, value.length - 1)
      );
    } else {
      return "Incorrect formatting: search query must have form: search <column> <value>";
    }

    if (query !== undefined) {
      return query;
    } else {
      return "Search value not mocked";
    }
  };

  /**
   * This function changes the mode of our repl
   *
   * @param inputs splitted array of command string input
   * @returns string indicating new (possibly changed) mode
   */
  const determineMode: REPLFunction = (inputs: Array<String>) => {
    if (inputs.length !== 2) {
      return "Input must be of form: mode <mode>";
    }
    var newMode = String(inputs[1].substring(0, inputs[1].length - 1));

    if (newMode == "brief" || newMode == "verbose") {
      props.setMode(newMode);
      return "Mode set to " + newMode;
    } else {
      return "Invalid mode: mode must be <brief> or <verbose>";
    }
  };

  /**
   * This function formats a html table that needs to be searched over w/o column
   * @param array file array to be turned into html table format
   * @param value value to be searched
   * @returns html formated table
   */
  function searchHtmlFormatNoColumn(array: string[][], value: string) {
    var ret: string = "";
    for (var j = 0; j < array[0].length; j++) {
      if (j !== 0) {
        ret += "~space~";
      }
      ret += array[0][j];
    }
    ret += "~new row~";

    for (var i = 1; i < array.length; i++) {
      var tmp: string = "";
      var b = false;
      for (var j = 0; j < array[0].length; j++) {
        if (j !== 0) {
          tmp += "~space~";
        }
        if (array[i][j] === value) {
          b = true;
        }
        tmp += array[i][j];
      }
      tmp += "~new row~";
      if (b) {
        ret += tmp;
      }
    }
    return ret;
  }

  /**
   * This function formats a html table that needs to be searched over 1/ column
   * @param array file array to be turned into html table format
   * @param column column value to be searched
   * @param value value to be searched
   * @returns html formated table
   */
  function searchHtmlFormat(array: string[][], column: string, value: string) {
    var ret: string = "";
    var col_ind: number = -1;
    for (var j = 0; j < array[0].length; j++) {
      if (j !== 0) {
        ret += "~space~";
      }
      ret += array[0][j];
      if (column === array[0][j]) {
        col_ind = j;
      }
    }
    ret += "~new row~";
    if (j === -1) {
      return ret;
    }

    for (var i = 1; i < array.length; i++) {
      var tmp: string = "";
      for (var j = 0; j < array[0].length; j++) {
        if (j !== 0) {
          tmp += "~space~";
        }
        tmp += array[i][j];
      }
      tmp += "~new row~";
      if (array[i][col_ind] === value) {
        ret += tmp;
      }
    }
    return ret;
  }

  /**
   * This function formats a html table
   * @param array file array to be formatted
   * @returns formatted string
   */
  function htmlFormat(array: string[][]) {
    var ret: string = "";
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[0].length; j++) {
        if (j !== 0) {
          ret += "~space~";
        }
        ret += array[i][j];
      }
      ret += "~new row~";
    }
    return ret;
  }

  functionMap.set("load_file", loadCSVFile);
  functionMap.set("view", viewCSVFile);
  functionMap.set("search", searchCSVFile);
  functionMap.set("mode", determineMode);

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
    </div>
  );
}
