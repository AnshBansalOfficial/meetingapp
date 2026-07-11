export interface TranscriptLine {
  id: string;
  speakerId: string;
  speakerName: string;
  text: string;
  startTime: number;
  endTime: number;
  lineOrder: number;
}

export interface HighlightedLine extends TranscriptLine {
  highlighted: boolean;
  highlightedText: React.ReactNode;
}

export function searchTranscript(
  lines: TranscriptLine[],
  query: string
): HighlightedLine[] {
  if (!query.trim()) {
    return lines.map((line) => ({
      ...line,
      highlighted: false,
      highlightedText: line.text,
    }));
  }

  const lowerQuery = query.toLowerCase();

  return lines.map((line) => {
    const lowerText = line.text.toLowerCase();
    const isHighlighted = lowerText.includes(lowerQuery);

    if (!isHighlighted) {
      return {
        ...line,
        highlighted: false,
        highlightedText: line.text,
      };
    }

    // Split text and highlight matches
    const parts: (string | { type: 'highlight'; text: string })[] = [];
    let lastIndex = 0;
    let matchIndex: number;

    while ((matchIndex = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
      if (matchIndex > lastIndex) {
        parts.push(line.text.substring(lastIndex, matchIndex));
      }
      parts.push({
        type: 'highlight',
        text: line.text.substring(matchIndex, matchIndex + query.length),
      });
      lastIndex = matchIndex + query.length;
    }

    if (lastIndex < line.text.length) {
      parts.push(line.text.substring(lastIndex));
    }

    return {
      ...line,
      highlighted: true,
      highlightedText: parts,
    };
  });
}

export function findNearestTimestamp(
  lines: TranscriptLine[],
  searchText: string
): number | null {
  const lowerSearch = searchText.toLowerCase();

  for (const line of lines) {
    if (line.text.toLowerCase().includes(lowerSearch)) {
      return line.startTime;
    }
  }

  return null;
}
