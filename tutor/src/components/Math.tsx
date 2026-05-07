"use client";

import { InlineMath, BlockMath } from "react-katex";

export function MathInline({ tex }: { tex: string }) {
  return <InlineMath math={tex} />;
}

export function MathBlock({ tex }: { tex: string }) {
  return (
    <div className="my-3 overflow-x-auto">
      <BlockMath math={tex} />
    </div>
  );
}
