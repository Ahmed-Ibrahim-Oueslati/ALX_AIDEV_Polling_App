import { tool } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";

const excludeFiles = ["dist", "bun.lock"];

const fileChange = z.object({
  rootDir: z.string().min(1).describe("The root directory"),
});

type FileChange = z.infer<typeof fileChange>;

async function getFileChangesInDirectory({ rootDir }: FileChange) {
  const git = simpleGit(rootDir);
  const summary = await git.diffSummary();
  const diffs: { file: string; diff: string }[] = [];

  for (const file of summary.files) {
    if (excludeFiles.includes(file.file)) continue;
    const diff = await git.diff(["--", file.file]);
    diffs.push({ file: file.file, diff });
  }

  return diffs;
}

export const getFileChangesInDirectoryTool = tool({
  description: "Gets the code changes made in given directory",
  inputSchema: fileChange,
  execute: getFileChangesInDirectory,
});

const commitMessageInput = z.object({
  rootDir: z.string().min(1).describe("The root directory to analyze for commit message"),
});

type CommitMessageInput = z.infer<typeof commitMessageInput>;

async function generateCommitMessage({ rootDir }: CommitMessageInput) {
  const git = simpleGit(rootDir);
  const summary = await git.diffSummary();
  const changedFiles = summary.files.map(f => f.file).join(", ");
  return `chore: update ${changedFiles}`;
}

export const generateCommitMessageTool = tool({
  description: "Generates a commit message based on code changes in the directory",
  inputSchema: commitMessageInput,
  execute: generateCommitMessage,
});

const markdownReviewInput = z.object({
  review: z.string().min(1).describe("The review content to write to markdown"),
  filePath: z.string().min(1).describe("The markdown file path to write to"),
});

type MarkdownReviewInput = z.infer<typeof markdownReviewInput>;

async function writeReviewToMarkdown({ review, filePath }: MarkdownReviewInput) {
  const fs = await import("fs/promises");
  await fs.writeFile(filePath, review, "utf8");
  return { success: true, filePath };
}

export const writeReviewToMarkdownTool = tool({
  description: "Writes the code review to a markdown file",
  inputSchema: markdownReviewInput,
  execute: writeReviewToMarkdown,
});