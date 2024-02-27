import "../styles/main.css";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  // CHANGED
  history: string[];
  commandHistory: string[];
}
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="repl-history">
      {/* This is where command history will go */}
      {/* TODO: To go through all the pushed commands... try the .map() function! */}
      {/* CHANGED */}
      {props.history.map((command, index) =>
        props.commandHistory[index] == "view" ||
        props.commandHistory[index].startsWith("search ") ? (
          htmlTable(command, index)
        ) : (
          <p>{command}</p>
        )
      )}
    </div>
  );
}

function htmlTable(command: string, index: number) {
  return (
    <table key={index} style={{ margin: "auto" }}>
      <tbody>
        {command.split("~new row~").map((row: string, rowIndex) => (
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
