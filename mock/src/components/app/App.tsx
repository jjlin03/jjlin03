import { useState } from "react";
import "../../../../../mock-jlin142-kczheng/mock/src/styles/App.css";
import { LoginButton } from "../inputs/LoginButton";
import REPL from "../repl/REPL";

/**
 * This is the highest level component!
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <div className="App">
      <p className="App-header">
        <h1>Mock</h1>
        <LoginButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </p>

      {isLoggedIn && <REPL />}
    </div>
  );
}

export default App;
