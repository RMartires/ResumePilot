export function ObjectiveList({ objectives }: { objectives: string[] }) {
  return (
    <ol className="space-y-4">
      {objectives.map((objective, index) => (
        <li key={objective} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <span className="text-sm font-semibold text-blue-300">Example {index + 1}</span>
          <p className="mt-2 leading-7 text-zinc-300">{objective}</p>
        </li>
      ))}
    </ol>
  );
}
