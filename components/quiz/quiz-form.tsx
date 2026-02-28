"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitQuiz } from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { Quiz, Question, QuizSubmission } from "@prisma/client";

type QuizFormProps = {
  quiz: Quiz & { questions: Question[] };
  previousSubmission: QuizSubmission | null;
};

export function QuizForm({ quiz, previousSubmission }: QuizFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>(
    previousSubmission?.answers as Record<string, string> || {}
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitQuiz(quiz.id, answers);
      setResult(result);
      setSubmitted(true);
      toast.success(
        result.passed
          ? `Congratulations! You passed with ${result.score.toFixed(1)}%`
          : `You scored ${result.score.toFixed(1)}%. Keep trying!`
      );
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && result) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Quiz Results</h3>
            <div className="text-4xl font-bold">
              {result.score.toFixed(1)}%
            </div>
            <p className={`text-lg font-semibold ${result.passed ? "text-green-600" : "text-red-600"}`}>
              {result.passed ? "Passed" : "Failed"}
            </p>
            <p className="text-muted-foreground">
              You got {result.correctAnswers} out of {result.totalQuestions} questions correct.
            </p>
            <Button onClick={() => router.back()}>
              Back to Course
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {quiz.questions.map((question, index) => (
        <Card key={question.id}>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">
                Question {index + 1}: {question.question}
              </h3>
              <p className="text-sm text-muted-foreground">
                {question.points} point{question.points !== 1 ? "s" : ""}
              </p>
            </div>

            {question.type === "MULTIPLE_CHOICE" ? (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) =>
                  setAnswers({ ...answers, [question.id]: value })
                }
              >
                {(question.options as string[]).map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={String(optIndex)}
                      id={`${question.id}-${optIndex}`}
                    />
                    <Label
                      htmlFor={`${question.id}-${optIndex}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) =>
                  setAnswers({ ...answers, [question.id]: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${question.id}-true`} />
                  <Label htmlFor={`${question.id}-true`} className="cursor-pointer">
                    True
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${question.id}-false`} />
                  <Label htmlFor={`${question.id}-false`} className="cursor-pointer">
                    False
                  </Label>
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </form>
  );
}
