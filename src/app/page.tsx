"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { AlignJustify, Moon, Sun } from "lucide-react";

const LockCodeCracker = () => {
  const [isDarkMode, setDarkMode] = useState<boolean>(true);
  const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
  const [lockCode, setLockCode] = useState<string>("");
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<
    {
      code: string;
      correctPosition: number;
      correctNumberWrongPosition: number;
      nonExistent: number;
    }[]
  >([]);
  const [error, setError] = useState<string>("");
  const [finished, setFinised] = useState<boolean>(false);
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const generateLockCode = () => {
    let code;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (code.length !== 4 || new Set(code).size !== 4);
    return code;
  };

  useEffect(() => {
    const code = generateLockCode();
    setLockCode(code);
  }, []);

  const analyzeGuess = (guess: string, lockCode: string) => {
    let correctPosition = 0;
    let correctNumberWrongPosition = 0;
    let nonExistent = 0;

    const guessCount: { [key: string]: number } = {};
    const lockCodeCount: { [key: string]: number } = {};

    for (let i = 0; i < 4; i++) {
      if (guess[i] === lockCode[i]) {
        correctPosition++;
      } else {
        guessCount[guess[i]] = (guessCount[guess[i]] || 0) + 1;
        lockCodeCount[lockCode[i]] = (lockCodeCount[lockCode[i]] || 0) + 1;
      }
    }

    for (const digit in guessCount) {
      if (lockCodeCount.hasOwnProperty(digit)) {
        correctNumberWrongPosition += Math.min(
          guessCount[digit],
          lockCodeCount[digit]
        );
      } else {
        nonExistent += guessCount[digit];
      }
    }

    return { correctPosition, correctNumberWrongPosition, nonExistent };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (guess.length !== 4 || !/^\d{4}$/.test(guess)) {
      setError("Please enter a valid 4-digit code.");
      return;
    }

    if (new Set(guess).size !== 4) {
      setError("The digits must be different.");
      return;
    }

    setError("");
    const { correctPosition, correctNumberWrongPosition, nonExistent } =
      analyzeGuess(guess, lockCode);

    setGuesses([
      ...guesses,
      { code: guess, correctPosition, correctNumberWrongPosition, nonExistent },
    ]);

    if (correctPosition === 4) {
      setFinised(true);
      setGuesses([]);
    }

    setGuess("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("webfontloader").then((WebFont) => {
        WebFont.load({
          google: {
            families: ["Merriweather"],
          },
        });
      });
    }
  }, []);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${
        isDarkMode
          ? "from-indigo-900 via-purple-900 to-violet-800 text-white"
          : "from-indigo-100 via-purple-100 to-violet-200 text-indigo-800"
      } flex flex-col items-center font-[Merriweather]`}
    >
      <ToastContainer />
      <nav className="flex items-center w-full bg-white/10 backdrop-blur-xl p-4 gap-5">
        <h1 className="flex-1 md:text-xl font-semibold">CodeCrack</h1>
        <div className="md:flex space-x-5 hidden">
          <button
            className="cursor-pointer"
            onClick={() => toast.info("Competitive is comming soon")}
          >
            Competitive
          </button>
          <button
            className="cursor-pointer"
            onClick={() => toast.info("Leaderboard is comming soon")}
          >
            Leaderboard
          </button>
          <button
            className="cursor-pointer"
            onClick={() => toast.info("Other Games is comming soon")}
          >
            Other Games
          </button>
        </div>
        <button className="cursor-pointer" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <img
          width="40"
          height="40"
          src="https://img.icons8.com/office/40/user-male-circle.png"
          alt="user-male-circle"
          className="cursor-pointer"
          onClick={() => toast.info("Profile is comming soon")}
        />
        <AlignJustify
          className="md:hidden flex"
          onClick={() => setShowDropdownMenu((prev) => !prev)}
        />
      </nav>
      {showDropdownMenu && (
        <div
          className={`flex flex-col gap-3 py-2 w-full ${
            isDarkMode ? "bg-white/20" : "bg-white/60"
          }`}
        >
          <button
            className="cursor-pointer"
            onClick={() => toast.info("Competitive is comming soon")}
          >
            Competitive
          </button>
          <button
            className="cursor-pointer"
            onClick={() => toast.info("Leaderboard is comming soon")}
          >
            Leaderboard
          </button>
          <button
            className="cursor-pointer"
            onClick={() => toast.info("Other Games is comming soon")}
          >
            Other Games
          </button>
        </div>
      )}
      <main className="p-4 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md rounded-xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div
            className={`bg-gradient-to-r ${
              isDarkMode
                ? "from-indigo-600 via-purple-600 to-violet-600 text-white"
                : "from-indigo-300 via-purple-300 to-violet-300 text-indigo-800"
            }  p-6`}
          >
            <h1 className="text-2xl font-bold text-center">
              Lock Code Cracker Game
            </h1>
            <p
              className={`text-center mt-2 ${
                isDarkMode ? "text-indigo-100" : "text-indigo-900"
              }`}
            >
              Guess the 4-digit code with different numbers in the fewest
              attempts possible.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex justify-center space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      ref={inputRefs[i]}
                      id={`digit-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={guess[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!/^\d?$/.test(val)) return;
                        const newGuess = guess.split("");
                        newGuess[i] = val;
                        setGuess(newGuess.join(""));
                        if (val && i < 3) {
                          inputRefs[i + 1].current?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          if (!guess[i]) {
                            if (i > 0) {
                              inputRefs[i - 1].current?.focus();
                              const newGuess = guess.split("");
                              newGuess[i - 1] = "";
                              setGuess(newGuess.join(""));
                              e.preventDefault();
                            }
                          } else {
                            const newGuess = guess.split("");
                            newGuess[i] = "";
                            setGuess(newGuess.join(""));
                            e.preventDefault();
                          }
                        }
                      }}
                      className={`w-12 h-12 text-center text-xl ${
                        isDarkMode
                          ? "text-white bg-white/20 focus:ring-indigo-500 placeholder:text-indigo-200"
                          : "text-indigo-900 bg-white/80 focus:ring-indigo-300 placeholder:text-indigo-700"
                      }  border border-white/30 rounded-lg focus:outline-none focus:ring-2 `}
                    />
                  ))}
                </div>
                {guesses.map((guess, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex w-full justify-center py-2"
                  >
                    <div className="flex space-x-2">
                      {guess.code.split("").map((digit, i) => {
                        let bgColor = "bg-gray-500";
                        if (digit === lockCode[i]) {
                          bgColor = "bg-green-500";
                        } else if (lockCode.includes(digit)) {
                          bgColor = "bg-blue-500";
                        }
                        return (
                          <div
                            key={i}
                            className={`w-12 h-12 flex items-center justify-center rounded-md text-white font-medium border border-white ${bgColor}`}
                          >
                            {digit}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg"
                    role="alert"
                  >
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`w-1/2 bg-gradient-to-r ${
                    isDarkMode
                      ? "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:ring-indigo-500"
                      : "from-indigo-300 to-purple-300 hover:from-indigo-200 hover:to-purple-200 text-indigo-900 focus:ring-indigo-600"
                  }  font-medium py-3 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2  transition-all duration-200 cursor-pointer`}
                >
                  Submit Guess
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setGuesses([]);
                    const code = generateLockCode();
                    setLockCode(code);
                    setFinised(false);
                  }}
                  className={`w-1/2 ${
                    isDarkMode
                      ? "bg-white/20 hover:bg-white/30 text-white focus:ring-indigo-500"
                      : "bg-white/70 hover:bg-white/80 text-indigo-800 focus:ring-indigo-300"
                  }  font-medium py-3 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2  transition-all duration-200 cursor-pointer`}
                >
                  Restart
                </motion.button>
              </div>
            </form>
            {finished && (
              <h1 className="text-green-500 text-center">
                You successfully crack the code
              </h1>
            )}
          </div>
        </motion.div>
      </main>
      <footer className="w-full p-10 flex justify-center bg-white/10 backdrop-blur-xl">
        <h1>CodeCrack @2025 All Rights Reserved</h1>
      </footer>
    </div>
  );
};

export default LockCodeCracker;
// Zod Schema
export const Schema = {
  commentary: "",
  template: "nextjs-developer",
  title: "Lock Code Cracker",
  description:
    "This is a code cracking game where players guess a 4-digit lock code in the fewest attempts possible.",
  additional_dependencies: ["framer-motion"],
  has_additional_dependencies: true,
  install_dependencies_command: "npm install framer-motion",
  port: 3000,
  file_path: "pages/index.tsx",
  code: "<see code above>",
};
