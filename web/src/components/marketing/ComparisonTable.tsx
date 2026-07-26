import type { Comparison } from "@/lib/seo/content";

export function ComparisonTable({ comparison }: { comparison: Comparison }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Feature comparison of {comparison.productA} and {comparison.productB}
        </caption>
        <thead className="bg-white/[0.06]">
          <tr>
            <th scope="col" className="p-4 font-semibold">Feature</th>
            <th scope="col" className="p-4 font-semibold">{comparison.productA}</th>
            <th scope="col" className="p-4 font-semibold">{comparison.productB}</th>
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.feature} className="border-t border-white/10">
              <th scope="row" className="p-4 font-medium text-white">{row.feature}</th>
              <td className="p-4 text-zinc-300">{row.productA}</td>
              <td className="p-4 text-zinc-300">{row.productB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
