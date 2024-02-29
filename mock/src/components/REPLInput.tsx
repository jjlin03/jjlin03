import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { topNBAScorers, topNBARebounders } from "./mockedJson";

const CSVMap = new Map<string, string[][]>([
  ["topNBAScorers", topNBAScorers],
  ["topNBARebounders", topNBARebounders],
]);

// const SearchMap = new Map<string, string>([
//   [
//     "<Rank> <1>",
//     "Rank~space~Name~space~Team~space~Pts~new row~1~space~Luka Doncic~space~DAL~space~34.3",
//   ],
// ]);

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

// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
export function REPLInput(props: REPLInputProps) {
  const functionMap = new Map<string, REPLFunction>();
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  // TODO WITH TA : add a count state
  const [count, setCount] = useState<number>(0);

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    setCount(count + 1);
    // CHANGED
    var nextHistory: string;
    commandString = commandString.trim(); // added
    var inputs: string[] = commandString.split(" <");
    const command = inputs[0]
    if (functionMap.has(command)) {
      const currFunc = functionMap.get(command)
      if (currFunc != undefined){
        nextHistory = String(currFunc(inputs))
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

  const loadCSVFile:REPLFunction = (inputs:Array<string>) => {
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
  }

  const viewCSVFile: REPLFunction = (inputs: Array<string>) => {
    if (props.file[0].length == 0) {
      return "No file loaded";
    } else {
      return htmlFormat(props.file);
    }
  };

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
  } 

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

  function searchHtmlFormat(array: string[][], column: string, value: string) {
    var ret: string = "";
    var col_ind: number = -1;
    // header
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

  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
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
