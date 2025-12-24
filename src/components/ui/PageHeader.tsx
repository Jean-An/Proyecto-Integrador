
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionElement?: ReactNode;
}

export function PageHeader({ title, description, actionElement }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      {actionElement && <div>{actionElement}</div>}
    </div>
  );
}
