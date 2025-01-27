"use client";

import {
  checkAttemptAnswers,
  updateAttemptQuestionAnswer,
} from "@/actions/attemptQuestion.action";
import { getReviewerAttempt } from "@/actions/reviewerAttempt.action";
import Loading from "@/app/(dashboard)/loading";
import { ReviewerAttempt, ReviewerAttemptQuestion } from "@/lib/globals";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AttemptContextType {
  attempt: ReviewerAttempt | null;
  selectedScope: { topicId: string; subtopicId: string | null };
  loading: boolean;
  fetchAttempt: (attemptId: string) => Promise<void>;
  changeScope: (topicId: string, subtopicId: string | null) => void;
  updateAnswer: (questionId: string, userAnswer: string | null) => void;
  finishAttempt: () => void;
  filteredQuestions: ReviewerAttemptQuestion[];
}

const AttemptContext = createContext<AttemptContextType | undefined>(undefined);

interface AttemptProviderProps {
  children: ReactNode;
  attemptId: string;
}

export const AttemptProvider: React.FC<AttemptProviderProps> = ({
  children,
  attemptId,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [attempt, setAttempt] = useState<ReviewerAttempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedScope, setSelectedScope] = useState<{
    topicId: string;
    subtopicId: string | null;
  }>({ topicId: "", subtopicId: null });

  const changeScope = (topicId: string, subtopicId: string | null) => {
    setSelectedScope({ topicId, subtopicId });
  };

  const fetchAttempt = async (attemptId: string) => {
    setLoading(true);
    try {
      const fetchedAttempt = await getReviewerAttempt(attemptId);
      setAttempt(fetchedAttempt);

      if (fetchedAttempt && fetchedAttempt.scopes?.length > 0) {
        const defaultScope = fetchedAttempt.scopes[0];
        changeScope(defaultScope.topicId, defaultScope.subtopicId || null);
      }
    } catch (error) {
      console.error("Error fetching attempt:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (questionId: string, userAnswer: string | null) => {
    if (!attempt) return;

    updateAttemptQuestionAnswer(questionId, userAnswer);

    const updatedQuestions = attempt.questions?.map((q) =>
      q.id === questionId ? { ...q, userAnswer } : q
    );

    setAttempt({ ...attempt, questions: updatedQuestions });
  };

  const finishAttempt = async () => {
    if (attempt?.status == "Ongoing") {
      await checkAttemptAnswers(attempt.id);
      window.location.reload();
    } else {
      if (session?.user.role == "Student") {
        router.push("/student/reviewer");
      } else {
        router.push(
          `/${session?.user.role.toLowerCase()}/reviewers/${
            attempt?.reviewerId
          }`
        );
      }
    }
  };

  const filteredQuestions =
    attempt?.questions?.filter((q) => {
      const scopeMatch = attempt.scopes?.some(
        (s) =>
          s.topicId === selectedScope.topicId &&
          s.subtopicId === selectedScope.subtopicId
      );
      return (
        scopeMatch &&
        q.question.topicId === selectedScope.topicId &&
        (!selectedScope.subtopicId ||
          q.question.subtopicId === selectedScope.subtopicId)
      );
    }) || [];

  useEffect(() => {
    if (!attemptId) return;
    fetchAttempt(attemptId);
  }, [attemptId]);

  const value = {
    attempt,
    selectedScope,
    loading,
    fetchAttempt,
    changeScope,
    updateAnswer,
    finishAttempt,
    filteredQuestions,
  };

  if (loading) return <Loading />;

  return (
    <AttemptContext.Provider value={value}>{children}</AttemptContext.Provider>
  );
};

export const useAttempt = (): AttemptContextType => {
  const context = useContext(AttemptContext);
  if (!context) {
    throw new Error("useAttempt must be used within an AttemptProvider");
  }
  return context;
};
