import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAskContext } from "../services/dockingContext";
import { useActiveDocking } from "../services/activeDocking";
import { PROTEINS, COMPOUNDS, nameOf } from "../data/proteins";
import { cleanAnswer } from "../services/cleanAnswer";
function Interpretation() {
  const active = useActiveDocking();
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
      const context = await getAskContext("AI Interpretation");
      const response = await fetch(
        "http://127.0.0.1:5000/api/ask-ivdd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userQuestion,
            context,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: cleanAnswer(data.answer) },
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
    <div className="page-content interpretation-page">

      {/* Page heading */}
      <div className="interpretation-heading">
        <div>
          <p className="eyebrow">DISCNET AI ASSISTANT</p>
          <h1>AI Interpretation</h1>
          <p>
            Explore IVDD mechanisms, protein interactions,
            pathways and nutraceutical research.
          </p>
          <p className="active-docking-note">
            {active
              ? `Currently open on Docking page: ${nameOf(COMPOUNDS, active.compound)} & ${nameOf(PROTEINS, active.protein)}`
              : "Tip: run a pair on the Docking page and ask about it here."}
          </p>
        </div>

        <div className="ai-status">
          <span className="status-dot"></span>
          AI Assistant
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-panel">

        <div className="chat-messages">

          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="welcome-icon">✦</div>

              <h2>What would you like to explore?</h2>

              <p>
                Ask DiscNet AI about intervertebral disc
                degeneration, molecular docking and
                nutraceutical interactions.
              </p>

              <div className="suggestion-list">
                <button
                  onClick={() =>
                    setQuestion("What is intervertebral disc degeneration?")
                  }
                >
                  What is IVDD?
                  <span>↗</span>
                </button>

                <button
                  onClick={() =>
                    setQuestion("How does NF-κB contribute to IVDD?")
                  }
                >
                  Explain the NF-κB pathway
                  <span>↗</span>
                </button>

                <button
                  onClick={() =>
                    setQuestion("How do nutraceuticals interact with IVDD-related proteins?")
                  }
                >
                  Nutraceutical-protein interactions
                  <span>↗</span>
                </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role}`}
            >
              <div className="message-avatar">
                {message.role === "user" ? "Y" : "✦"}
              </div>

              <div className="message-body">
                <div className="message-name">
                  {message.role === "user" ? "You" : "DiscNet AI"}
                </div>

                <div className="message-bubble">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai">
              <div className="message-avatar">✦</div>

              <div className="message-body">
                <div className="message-name">DiscNet AI</div>

                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Input area */}
        <form className="chat-input-area" onSubmit={askAI}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about IVDD, proteins, pathways..."
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI(e);
              }
            }}
          />

          <div className="input-footer">
            <span>Press Enter to send · Shift + Enter for a new line</span>

            <button
              type="submit"
              disabled={loading || !question.trim()}
            >
              {loading ? "Thinking..." : "Send ↗"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Interpretation;