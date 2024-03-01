import { useState } from "react";
import "../../../../../mock-jlin142-kczheng/mock/src/styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

/* 
  You'll want to expand this component (and others) for the sprints! Remember 
  that you can pass "props" as function arguments. If you need to handle state 
  at a higher level, just move up the hooks and pass the state/setter as a prop.
  
  This is a great top level component for the REPL. It's a good idea to have organize all components in a component folder.
  You don't need to do that for this gearup.
*/

/**
 * This function handles the high level REPL functionality. It organizes both the repl input and repl history.
 * @returns new repl inputs and repl history
 */
export default function REPL() {
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [file, setFile] = useState<string[][]>([[]]);
  const [mode, setMode] = useState<string>("brief");

  return (
    <div className="repl">
      <REPLHistory
        history={history}
        commandHistory={commandHistory}
        mode={mode}
      />
      <hr></hr>
      <REPLInput
        history={history}
        setHistory={setHistory}
        commandHistory={commandHistory}
        setCommandHistory={setCommandHistory}
        file={file}
        setFile={setFile}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}
