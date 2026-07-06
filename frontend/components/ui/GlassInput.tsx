import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  className?: string;
};

type GlassInputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    textarea?: false;
  };

type GlassTextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textarea: true;
  };

export function GlassInput(props: GlassInputProps | GlassTextareaProps) {
  const { label, className = "", textarea, ...fieldProps } = props;
  const fieldClass =
    "mt-2 w-full rounded-xl border border-white/60 bg-white/55 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/75 focus:ring-4 focus:ring-blue-500/10";

  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`}>
      {label}
      {textarea ? (
        <textarea
          className={`${fieldClass} min-h-28 resize-none`}
          {...(fieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={fieldClass}
          {...(fieldProps as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </label>
  );
}
