import "../styles/main.css";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  // CHANGED
  history: string[];
  commandHistory: string[];
  mode: string;
}
export function REPLHistory(props: REPLHistoryProps) {
  var error: string = "Inavlid Mode";
  return (
    <div className="repl-history" aria-label="repl-history">
      {/* This is where command history will go */}
      {/* TODO: To go through all the pushed commands... try the .map() function! */}
      {/* CHANGED */}
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
