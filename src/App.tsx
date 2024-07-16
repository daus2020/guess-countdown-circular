import React, { useState, useEffect, ChangeEvent } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";

const App: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [guessCount, setGuessCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(45);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && !isGameOver && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsGameOver(true);
      setMessage("Time is up!");
    }
    return () => clearInterval(interval);
  }, [hasStarted, isGameOver, timer]);

  const handleGuess = () => {
    if (isGameOver || !hasStarted) return;

    const numGuess = parseInt(guess);
    setGuessCount(guessCount + 1);

    const newMessage =
      numGuess === targetNumber
        ? "Congratulations! You guessed the number!"
        : numGuess < targetNumber
        ? "Too low! Try again."
        : "Too high! Try again.";

    setMessage(newMessage);
    numGuess === targetNumber && setIsGameOver(true);
    setGuess("");
  };

  const handleReset = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("");
    setGuessCount(0);
    setTimer(45);
    setIsGameOver(false);
    setHasStarted(false);
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const getProgressBarColor = (): string => {
    if (timer > 30) return "#4caf50"; // Green
    if (timer > 10) return "#ffeb3b"; // Yellow
    return "#f44336"; // Red
  };

  return (
    <div className="App">
      <h1>Guess the Number Game</h1>
      {hasStarted ? (
        <>
          <p>Guess a number between 1 and 100</p>
          <input
            type="number"
            value={guess}
            onChange={handleInputChange}
            disabled={isGameOver}
          />
          <button onClick={handleGuess} disabled={isGameOver}>
            Guess
          </button>
          <button onClick={handleReset}>Reset</button>
          <p>{message}</p>
          <p>Number of guesses: {guessCount}</p>
          <p>Time elapsed: {45 - timer} seconds</p>
          <div className="circular-progress-bar">
            <CircularProgressbar
              value={timer}
              maxValue={45}
              text={`${timer}`}
              styles={buildStyles({
                pathColor: getProgressBarColor(),
                textColor: getProgressBarColor(),
                trailColor: "#f3f3f3",
                transition: "stroke-dashoffset 0.5s ease 0s",
              })}
            />
          </div>
        </>
      ) : (
        <button onClick={handleStart}>Start Game</button>
      )}
    </div>
  );
};

export default App;
