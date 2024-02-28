import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { topNBAScorers, topNBARebounders } from "./mockedJson";

const CSVMap = new Map<string, string[][]>([
  ["topNBAScorers", topNBAScorers],
  ["topNBARebounders", topNBARebounders],
]);

const SearchMap = new Map<string, string>([
  [
    "<Rank> <1>",
    "Rank~space~Name~space~Team~space~Pts~new row~1~space~Luka Doncic~space~DAL~space~34.3",
  ],
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
    if (commandString.startsWith("load_file ")) {
      nextHistory = String(loadCSVFile(commandString.split(/\s+/)));
    } else if (commandString == "view") {
      nextHistory = String(viewCSVFile(commandString.split(/\s+/))); // placeholder input for viewCSV
    } else if (commandString.startsWith("search ")) {
      nextHistory = String(searchCSVFile(commandString.split(" <")));
    } else if (commandString.startsWith("mode ")) {
      nextHistory = String(determineMode(commandString.split(/\s+/)));
    } else {
      nextHistory = "Invalid Command";
    }
    props.setCommandHistory([...props.commandHistory, commandString]);
    props.setHistory([...props.history, nextHistory]);
    setCommandString("");
  }

  const loadCSVFile:REPLFunction = (CSVFile:Array<string>) => {
    var filepath = CSVFile[1];
    if (
      filepath.length < 3 ||
      filepath.charAt(0) !== "<" || // changed
      filepath.charAt(filepath.length - 1) !== ">"
    ) {
      return "Incorrect formatting: please put <> around your filename";
    }
    // everything but <>
    var thisFile = CSVMap.get(filepath.substring(1, filepath.length - 1));
    if (thisFile !== undefined) {
      props.setFile(thisFile);
      return "File successfully found";
    } else {
      return "File not found";
    }
  }

  const viewCSVFile: REPLFunction = (CSVFile: Array<string>) => {
      if (props.file[0].length == 0) {
        return "No file loaded";
      } else {
        return htmlFormat(props.file);
      }
    };

  const searchCSVFile:REPLFunction = (CSVFile: Array<string>) => {
    if (CSVFile.length !== 3) {
      return "Incorrect formatting: search query must have form: search <column> <value>";
    }
    var column = CSVFile[1];
    var value = CSVFile[2];
    if (
      column.charAt(column.length - 1) !== ">" ||
      value.charAt(value.length - 1) !== ">"
    ) {
      return "Incorrect formatting: search query must have form: search <column> <value>";
    }

    var query = searchHtmlFormat(
      props.file, 
      column.substring(0, column.length - 1),
      value.substring(0, value.length - 1)
      );

    // var query = SearchMap.get("<" + column + " <" + value);
    if (query !== undefined) {
      return query;
    } else {
      return "Search value not mocked";
    }
  }

  const determineMode: REPLFunction = (CSVFile: Array<String>) => {
    if (CSVFile.length !== 2) {
      return "Input must be of form: mode mode";
    }
    var newMode = String(CSVFile[1]);

    if (newMode == "brief" || newMode == "verbose") {
      props.setMode(newMode);
      return "Mode set to " + newMode;
    } else {
      return "Invalid mode: mode must be brief or verbose";
    }
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
