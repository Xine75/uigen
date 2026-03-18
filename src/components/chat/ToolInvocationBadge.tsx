import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  args?: Record<string, unknown>;
  result?: unknown;
  toolCallId: string;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getFilename(path: unknown): string {
  if (typeof path !== "string") return "";
  return path.split("/").pop() || path;
}

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName, state, args } = toolInvocation;
  const done = state === "result";
  const filename = getFilename(args?.path);

  if (toolName === "str_replace_editor" && filename) {
    const command = args?.command;
    switch (command) {
      case "create":
        return done ? `Created ${filename}` : `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return done ? `Edited ${filename}` : `Editing ${filename}`;
      case "view":
        return done ? `Viewed ${filename}` : `Viewing ${filename}`;
      case "undo_edit":
        return done ? `Reverted ${filename}` : `Reverting ${filename}`;
    }
  }

  if (toolName === "file_manager" && filename) {
    const command = args?.command;
    switch (command) {
      case "rename":
        return done ? `Renamed ${filename}` : `Renaming ${filename}`;
      case "delete":
        return done ? `Deleted ${filename}` : `Deleting ${filename}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const label = getLabel(toolInvocation);
  const done = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
