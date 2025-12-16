import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Card({ title, description, action, children }: CardProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {action}
        </div>
      </div>
      <div className="px-6 py-6 text-gray-600">{children}</div>
    </div>
  );
}
