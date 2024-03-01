import "../../../../../mock-jlin142-kczheng/mock/src/styles/main.css";

/**
 * This is the interface for the input for REPLHistory.
 */
interface REPLHistoryProps {
  history: string[];
  commandHistory: string[];
  mode: string;
}

/**
 * This function handles the repl history. It updates based on input and current repl mode.
 * @param props the current repl states
 * @returns a history list of commands and outputs
 */
export function REPLHistory(props: REPLHistoryProps) {
  var error: string = "Invalid Mode";
  return (
    <div className="repl-history" aria-label="repl-history" data-testid="repl-history">
      {props.history.map((output, index) =>
        props.mode == "brief" ? (
          props.commandHistory[index] == "view" ||
          props.commandHistory[index].startsWith("search ") ? (
            htmlTable(output, index)
          ) : (
            <p>{output}</p>
          )
        ) : props.mode == "verbose" ? (
          props.commandHistory[index] == "view" ||
          props.commandHistory[index].startsWith("search ") ? (
            <div>
              <p>Command: {props.commandHistory[index]}</p>
              <p>Output: </p>
              {htmlTable(output, index)}
            </div>
          ) : (
            <div>
              <p>Command: {props.commandHistory[index]}</p>
              <p>Output: {output}</p>
            </div>
          )
        ) : (
          <p>Invalid Mode</p>
        )
      )}
    </div>
  );
}

/**
 * This function formats a html table.
 * 
 * @param output formatted string
 * @param index index of table
 * @returns formatted html table
 */
function htmlTable(output: string, index: number) {
  return (
    <table key={index} style={{ margin: "auto" }}>
      <tbody>
        {output.split("~new row~").map((row: string, rowIndex) => (
          <tr key={rowIndex}>
            {row.split("~space~").map((word, wordIndex) => (
              <td key={wordIndex}>{word}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
