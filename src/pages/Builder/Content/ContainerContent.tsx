import React from "react";

function ContainerContent() {
  return (
    <div className="text-[12px] text-[var(--color-dark)]/40 text-center py-4">
      Style properties are available in other panels (Spacing, Background, Border, etc.)
    </div>
  );
}

export default React.memo(ContainerContent);
