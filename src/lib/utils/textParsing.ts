/**
 * Parse structured text that may contain colons separating title and content
 */
export function parseStructuredText(text: string): {
  hasTitle: boolean;
  title?: string;
  content: string;
} {
  if (text.includes(":")) {
    const parts = text.split(":");
    return {
      hasTitle: true,
      title: parts[0].trim(),
      content: parts.slice(1).join(":").trim(),
    };
  }

  return {
    hasTitle: false,
    content: text,
  };
}

/**
 * Parse timeline event from various formats
 */
export function parseTimelineEvent(event: any): {
  date: string;
  description: string;
} {
  let date = "";
  let description = "";

  if (typeof event === "object") {
    date = event.date || "";
    description = event.description || "";
  } else if (typeof event === "string" && event.includes("::")) {
    const parts = event.split("::");
    date = parts[0] || "";
    description = parts.slice(1).join(":") || event;
  } else {
    description = event;
  }

  return { date, description };
}

/**
 * Parse Q&A content with proper formatting
 */
export function parseQnAContent(qa: { question: string; answer: string }): {
  question: string;
  answer: string;
} {
  return {
    question: qa.question.trim(),
    answer: qa.answer.trim(),
  };
}
