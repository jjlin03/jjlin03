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
    " <Rank> <1>",
    "Rank~space~Name~space~Team~space~Pts~new row~1~space~Luka Doncic~space~DAL~space~34.3",
  ],
]);

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
    if (commandString.startsWith("load_file ")) {
      nextHistory = loadCSVFile(commandString.substring(9));
    } else if (commandString == "view") {
      nextHistory = viewCSVFile();
    } else if (commandString.startsWith("search ")) {
      nextHistory = searchCSVFile(commandString.substring(6));
    } else if (commandString.startsWith("mode ")) {
      nextHistory = determineMode(commandString.substring(5));
    } else {
      nextHistory = "Invalid Command";
    }
    props.setCommandHistory([...props.commandHistory, commandString]);
    props.setHistory([...props.history, nextHistory]);
    setCommandString("");
  }

  function loadCSVFile(CSVFile: string) {
    if (
      CSVFile.length < 3 ||
      CSVFile.substring(0, 2) !== " <" ||
      CSVFile.charAt(CSVFile.length - 1) !== ">"
    ) {
      return "Incorrect formatting: please put <> around your filename";
    }

    var thisFile = CSVMap.get(CSVFile.substring(2, CSVFile.length - 1));
    if (thisFile !== undefined) {
      props.setFile(thisFile);
      return "File successfully found";
    } else {
      return "File not found";
    }
  }

  function viewCSVFile() {
    if (props.file[0].length == 0) {
      return "No file loaded";
    } else {
      return htmlFormat(props.file);
    }
  }

  function searchCSVFile(CSVFile: string) {
    const params: string[] = CSVFile.split(" <");
    if (
      (params.length !== 2 && params.length !== 3) ||
      params[1].charAt(params[1].length - 1) !== ">" ||
      (params.length == 3 && params[2].charAt(params[2].length - 1) !== ">")
    ) {
      return "Incorrect formatting: please put <> around optional column followed by value";
    }

    const query = SearchMap.get(CSVFile);
    if (query !== undefined) {
      return query;
    } else {
      return "Search value not mocked";
    }
  }

  function determineMode(newMode: string) {
    if (newMode == "brief") {
      props.setMode(newMode);
      return "Mode set to brief";
    } else if (newMode == "verbose") {
      props.setMode(newMode);
      return "Mode set to verbose";
    } else {
      return "Invalid mode: must be brief or verbose";
    }
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
      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
    </div>
  );
}
