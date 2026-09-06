import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Check, X, Award, RotateCw, Sparkles } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number; // Index of the correct option
  reward: number; // Points awarded
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: "1",
    question: "Thể loại truyện nào mang lại cảm giác ấm áp, hồi phục tâm hồn sau những mệt mỏi?",
    options: [
      "Kinh dị giật gân",
      "Chữa lành (Healing)",
      "Trinh thám hồi hộp",
      "Hành động viễn tưởng"
    ],
    answer: 1,
    reward: 20
  },
  {
    id: "2",
    question: "Để tưới nước giúp 'Cây Cảm Xúc' trong tiệm lớn lên, độc giả có thể làm gì?",
    options: [
      "Tắt trình duyệt và đợi qua ngày",
      "Gửi một lời bôi nhọ nhân vật",
      "Thả tim nhân vật, gửi thư, hoặc thả đèn lồng",
      "Báo cáo lỗi trang web"
    ],
    answer: 2,
    reward: 20
  },
  {
    id: "3",
    question: "Linh vật biểu tượng trang trí trên nóc Tiệm Nhỏ Nhà Wyn là gì?",
    options: [
      "Bánh kem dâu ngọt ngào",
      "Chiếc kẹo mút lấp lánh",
      "Kem ốc quế mát lạnh (Cone Ice Cream)",
      "Cốc trà sữa trân châu"
    ],
    answer: 2,
    reward: 20
  },
  {
    id: "4",
    question: "Nơi nào để viết lời nhắn ẩn danh thả trôi lung linh trên bầu trời đêm của tiệm?",
    options: [
      "Bảng xếp hạng",
      "Bầu Trời Đèn Lồng",
      "Vòng quay Gacha may mắn",
      "Bảng quản trị"
    ],
    answer: 1,
    reward: 20
  },
  {
    id: "5",
    question: "Tông màu sắc chủ đạo mặc định khi vừa bước chân vào Tiệm Nhỏ Nhà Wyn là màu gì?",
    options: [
      "Màu đen hắc ám huyền bí",
      "Màu hồng ngọt ngào lãng mạn",
      "Màu xanh ngọc chữa lành êm dịu",
      "Màu xám tối giản u buồn"
    ],
    answer: 1,
    reward: 20
  }
];

export default function TriviaQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setEarnedPoints(prev => prev + currentQuestion.reward);
      
      // Reward points directly via custom event
      window.dispatchEvent(
        new CustomEvent("add-points", { detail: { amount: currentQuestion.reward } })
      );
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Extra 50 point bonus for finishing the quiz!
      window.dispatchEvent(
        new CustomEvent("add-points", { detail: { amount: 50 } })
      );
      setEarnedPoints(prev => prev + 50);
      window.dispatchEvent(new CustomEvent("water-tree"));
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setEarnedPoints(0);
    setQuizFinished(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-stone-900 border border-primary-100 dark:border-stone-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {!quizFinished ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
              <span>Đố vui tiệm nhỏ</span>
              <span className="text-primary-500">
                Câu {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-400 transition-all duration-350"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 bg-primary-50/40 dark:bg-stone-800/40 rounded-2xl border border-primary-100/50 dark:border-stone-700/50">
            <h4 className="text-sm font-serif font-semibold text-stone-800 dark:text-stone-100 leading-relaxed flex gap-2">
              <HelpCircle className="w-5 h-5 text-primary-400 shrink-0" />
              {currentQuestion.question}
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              let btnClass = "bg-slate-50 dark:bg-stone-800/40 border-slate-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800";
              
              if (selectedOption === idx) {
                btnClass = "bg-primary-50 dark:bg-primary-950/20 border-primary-400 text-primary-600 dark:text-primary-400 font-bold";
              }

              if (isAnswered) {
                if (idx === currentQuestion.answer) {
                  btnClass = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (selectedOption === idx) {
                  btnClass = "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-600 dark:text-red-400 font-bold";
                } else {
                  btnClass = "opacity-50 bg-slate-50 dark:bg-stone-800/40 border-slate-200 dark:border-stone-700 text-stone-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQuestion.answer && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                  {isAnswered && selectedOption === idx && idx !== currentQuestion.answer && (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex gap-2.5">
            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="w-full py-3 bg-primary-400 hover:bg-primary-500 disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Trả lời
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950 rounded-full flex items-center justify-center border-2 border-amber-300">
              <Award className="w-8 h-8 text-amber-500 fill-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center gap-1">
              Hoàn Thành Đố Vui! <Sparkles className="w-4 h-4 text-amber-400" />
            </h4>
            <p className="text-xs text-stone-400 dark:text-stone-500 leading-relaxed">
              Bạn đã trả lời đúng <span className="text-emerald-500 font-bold text-sm">{score}</span> trên tổng số {QUIZ_QUESTIONS.length} câu đố ngọt ngào.
            </p>
          </div>

          <div className="p-4 bg-amber-50/40 dark:bg-stone-800/40 rounded-2xl border border-amber-100/50 dark:border-stone-700/50 max-w-sm mx-auto">
            <div className="flex justify-between items-center text-xs text-stone-600 dark:text-stone-300">
              <span>Độ chính xác:</span>
              <span className="font-bold">{score * 20}%</span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-600 dark:text-stone-300 mt-1.5">
              <span>Điểm thưởng tích lũy:</span>
              <span className="font-bold text-amber-500">+{earnedPoints} 💎</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-2 italic text-center">
              (Bao gồm bonus +50 💎 hoàn thành trò chơi)
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl shadow-inner transition cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            <RotateCw className="w-4 h-4" /> Chơi lại
          </button>
        </div>
      )}
    </div>
  );
}
