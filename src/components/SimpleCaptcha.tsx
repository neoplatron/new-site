import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const generateQuestion = () => {
  const operations = ["+", "-", "×"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number, answer: number;
  
  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 5;
      num2 = 3;
      answer = 8;
  }
  
  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer: answer.toString(),
  };
};

const SimpleCaptcha = ({ onVerify }: SimpleCaptchaProps) => {
  const [captcha, setCaptcha] = useState(() => generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateQuestion());
    setUserAnswer("");
    setStatus("idle");
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    if (userAnswer.trim() === "") {
      setStatus("idle");
      onVerify(false);
      return;
    }

    if (userAnswer.trim() === captcha.answer) {
      setStatus("correct");
      onVerify(true);
    } else {
      setStatus("incorrect");
      onVerify(false);
    }
  }, [userAnswer, captcha.answer, onVerify]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text dark:text-d-text">
        Security Check *
      </label>
      <div className="flex items-center gap-4 p-4 bg-bg dark:bg-d-bg rounded-lg border border-border dark:border-d-border">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg select-none">
              {captcha.question}
            </span>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="p-2 text-text-muted hover:text-primary transition-colors"
              title="Get new question"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="w-24">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value.replace(/[^0-9-]/g, ""))}
            placeholder="Answer"
            className={`w-full px-3 py-2 rounded-lg border text-center font-mono text-lg transition-colors
              ${status === "correct" 
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                : status === "incorrect" 
                  ? "border-red-400 bg-red-50 dark:bg-red-900/20" 
                  : "border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light"
              }
              text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary/50`}
            maxLength={4}
          />
        </div>
      </div>
      {status === "correct" && (
        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
          ✓ Verified
        </p>
      )}
      {status === "incorrect" && userAnswer.trim() !== "" && (
        <p className="text-sm text-red-500 dark:text-red-400">
          Incorrect answer. Please try again.
        </p>
      )}
    </div>
  );
};

export default SimpleCaptcha;
