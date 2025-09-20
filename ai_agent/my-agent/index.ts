import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getFileChangesInDirectoryTool, writeReviewToMarkdownTool, generateCommitMessageTool } from "./tools";

const codeReviewAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
      writeReviewToMarkdownTool: writeReviewToMarkdownTool,
      generateCommitMessageTool: generateCommitMessageTool,
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

// Specify which directory the code review agent should review changes in your prompt
await codeReviewAgent(
  "Review the code changes in 'C:\\Users\\AhmedIbrahimOueslati\\OneDrive - Medius\\folders_to_take\\ALX_AIDEV\\poll-app' directory, make your reviews and suggestions file by file and don't forget to generate a commit message and write the review to a markdown file "
);

