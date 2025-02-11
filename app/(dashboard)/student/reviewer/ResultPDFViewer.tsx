import { ReviewerAttempt, ReviewerAttemptScope } from "@/lib/globals";
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
  title: { fontSize: 14, fontWeight: "bold" },
  text: { fontSize: 10, marginBottom: 5 },
  question: { fontSize: 11, marginBottom: 3, fontWeight: "bold" },
  answer: { fontSize: 10 },
});

interface DownloadResultProps {
  attempt: ReviewerAttempt;
}

const ResultDocument = ({ attempt }: DownloadResultProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Review Attempt Report</Text>
        <Text style={styles.text}>
          Student Name: {attempt.user.firstName} {attempt.user.lastName}
        </Text>
        <Text style={styles.text}>Student Email: {attempt.user.email}</Text>
        <Text style={styles.text}>
          Score: {attempt.score} / {attempt.questionAmount}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Topics Covered</Text>

        {attempt.scopes?.map((scope: ReviewerAttemptScope) => (
          <Text key={scope.id} style={styles.text}>
            {scope.topic?.title}{" "}
            {scope.subtopic ? `(${scope.subtopic.title})` : ""}
          </Text>
        ))}
       
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.title}>Topic</Text>
        {attempt.questions?.map((q, index) => (
          <View key={q.id}>
            <Text style={styles.question}>{index + 1}. {q.question.content}</Text>
            <Text style={styles.answer}>User Answer: {q.userAnswer || "Not Answered"}</Text>
            <Text style={styles.answer}>Correct Answer: {q.question.correctAnswer}</Text>
          </View>
        ))}
      </View> */}
    </Page>
  </Document>
);

const DownloadResult = ({ attempt }: DownloadResultProps) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    }}
  >
    {/* PDF Viewer */}
    <PDFViewer width="100%" height={600} style={{ border: "1px solid #ccc" }}>
      <ResultDocument attempt={attempt} />
    </PDFViewer>

    {/* Download Button
    <PDFDownloadLink
      document={<ResultDocument attempt={attempt} />}
      fileName={`review_attempt_${attempt.id}.pdf`}
      style={{ textDecoration: "none", padding: "10px 20px", backgroundColor: "#007bff", color: "white", borderRadius: "5px" }}
    >
      {({ loading }) => (loading ? "Generating PDF..." : "Download Result PDF")}
    </PDFDownloadLink> */}
  </div>
);

export default DownloadResult;
