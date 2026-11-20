import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();

    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/ask-ivdd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userQuestion,
            context: {
              section: "Floating AI Assistant",
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer },
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-ai-container">

      {isOpen && (
        <div className="floating-ai-panel">

          <div className="floating-ai-header">
            <div>
              <strong>✦ DiscNet AI</strong>
              <p>Your IVDD research assistant</p>
            </div>

            <button onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="floating-ai-messages">

            {messages.length === 0 && (
              <div className="floating-ai-welcome">
                <h3>How can I help?</h3>
                <p>
                  Ask me about IVDD, proteins, pathways
                  or nutraceuticals.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`floating-message ${message.role}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div className="floating-message ai">
                Thinking...
              </div>
            )}

          </div>

          <form onSubmit={askAI} className="floating-ai-input">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask DiscNet AI..."
              disabled={loading}
            />

            <button type="submit" disabled={loading || !question.trim()}>
              ↑
            </button>
          </form>

        </div>
      )}

      <button
        className="floating-ai-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "×" : "✦ Ask AI"}
      </button>

    </div>
  );
}

export default FloatingAI;