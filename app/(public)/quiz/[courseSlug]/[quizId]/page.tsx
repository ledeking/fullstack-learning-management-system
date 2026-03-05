import { notFound } from "next/navigation";
import { getQuiz } from "@/actions/quizzes";
import { QuizForm } from "@/components/quiz/quiz-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function QuizPage({
  params,
}: {
  params: { courseSlug: string; quizId: string };
}) {
  const data = await getQuiz(params.quizId);

  if (!data) {
    notFound();
  }

  const { quiz, previousSubmission } = data;

  return (
    <div className="container py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground mt-4">
            <span>Passing Score: {quiz.passingScore}%</span>
            {quiz.timeLimit && <span>Time Limit: {quiz.timeLimit} minutes</span>}
          </div>
        </CardHeader>
        <CardContent>
          {previousSubmission ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Previous Attempt</h3>
                <p>
                  Score: <span className="font-bold">{previousSubmission.score.toFixed(1)}%</span>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      previousSubmission.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {previousSubmission.passed ? "Passed" : "Failed"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Submitted: {new Date(previousSubmission.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                You can retake this quiz. Your previous answers are shown below.
              </p>
            </div>
          ) : null}

          <QuizForm quiz={quiz} previousSubmission={previousSubmission} />
        </CardContent>
      </Card>
    </div>
  );
}
