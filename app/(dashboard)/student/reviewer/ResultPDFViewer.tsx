import { ReviewerAttempt } from "@/lib/globals";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  text: { fontSize: 10, marginBottom: 5 },
  question: { fontSize: 11, marginBottom: 3, fontWeight: "bold" },
  answer: { fontSize: 10 },
  topicScore: { 
    fontSize: 10, 
    marginBottom: 5,
    marginLeft: 10 
  },
});

interface DownloadResultProps {
  attempt: ReviewerAttempt;
}

interface TopicScore {
  topicId: string;
  title: string;
  correctCount: number;
  totalCount: number;
  totalPoints: number;
  earnedPoints: number;
  subtopics: {
    [key: string]: {
      title: string;
      correctCount: number;
      totalCount: number;
      totalPoints: number;
      earnedPoints: number;
    };
  };
}

const calculateTopicScores = (attempt: ReviewerAttempt): { [key: string]: TopicScore } => {
  const topicScores: { [key: string]: TopicScore } = {};

  // Initialize topic scores based on scopes
  attempt.scopes?.forEach((scope) => {
    if (scope.topicId && scope.topic) {
      if (!topicScores[scope.topicId]) {
        topicScores[scope.topicId] = {
          topicId: scope.topicId,
          title: scope.topic.title,
          correctCount: 0,
          totalCount: 0,
          totalPoints: 0,
          earnedPoints: 0,
          subtopics: {},
        };
      }
      
      if (scope.subtopicId && scope.subtopic) {
        topicScores[scope.topicId].subtopics[scope.subtopicId] = {
          title: scope.subtopic.title,
          correctCount: 0,
          totalCount: 0,
          totalPoints: 0,
          earnedPoints: 0,
        };
      }
    }
  });

  // Calculate scores for each question
  attempt.questions?.forEach((attemptQuestion) => {
    const question = attemptQuestion.question;
    const topicId = question.topicId;
    const subtopicId = question.subtopicId;

    if (topicId && topicScores[topicId]) {
      topicScores[topicId].totalCount++;
      topicScores[topicId].totalPoints += question.points;

      if (attemptQuestion.userAnswer === question.correctAnswer) {
        topicScores[topicId].correctCount++;
        topicScores[topicId].earnedPoints += question.points;
      }

      if (subtopicId && topicScores[topicId].subtopics[subtopicId]) {
        const subtopic = topicScores[topicId].subtopics[subtopicId];
        subtopic.totalCount++;
        subtopic.totalPoints += question.points;

        if (attemptQuestion.userAnswer === question.correctAnswer) {
          subtopic.correctCount++;
          subtopic.earnedPoints += question.points;
        }
      }
    }
  });

  return topicScores;
};

const ResultDocument = ({ attempt }: DownloadResultProps) => {
  const topicScores = calculateTopicScores(attempt);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Review Attempt Report</Text>
          <Text style={styles.text}>
            Student Name: {attempt.user.firstName} {attempt.user.lastName}
          </Text>
          <Text style={styles.text}>Student Email: {attempt.user.email}</Text>
          <Text style={styles.text}>
            Overall Score: {attempt.score} / {attempt.questionAmount}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Topics Covered</Text>
          {Object.values(topicScores).map((topicScore) => (
            <View key={topicScore.topicId}>
              <Text style={styles.text}>
                {topicScore.title} - Score: {topicScore.earnedPoints}/{topicScore.totalPoints} points 
                ({topicScore.correctCount}/{topicScore.totalCount} questions)
              </Text>
              
              {Object.values(topicScore.subtopics).map((subtopic, index) => (
                <Text key={index} style={styles.topicScore}>
                  • {subtopic.title} - Score: {subtopic.earnedPoints}/{subtopic.totalPoints} points
                  ({subtopic.correctCount}/{subtopic.totalCount} questions)
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const DownloadResult = ({ attempt }: DownloadResultProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <PDFViewer width="100%" height={600} style={{ border: "1px solid #ccc" }}>
        <ResultDocument attempt={attempt} />
      </PDFViewer>
    </div>
  );
};