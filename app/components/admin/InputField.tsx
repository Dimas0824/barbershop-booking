import type { TextareaHTMLAttributes, InputHTMLAttributes } from "react";

type BaseProps = {
  label?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function InputField({ label, textarea, rows = 3, className = "", ...props }: InputProps) {
  const baseClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-black " +
    className;

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-gray-600">{label}</label>}
      {textarea ? <textarea className={baseClass} rows={rows} {...props} /> : <input className={baseClass} {...props} />}
    </div>
  );
}
