import clsx from "clsx";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        status.includes("setuju") || status === "aktif"
          ? "bg-emerald-100 text-emerald-700"
          : status.includes("tolak") || status.includes("perlu")
            ? "bg-rose-100 text-rose-700"
            : "bg-sky-100 text-sky-700",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
