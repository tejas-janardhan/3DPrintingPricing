import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gray-800 group-[.toaster]:text-gray-50 group-[.toaster]:border-gray-50 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-50",
          actionButton:
            "group-[.toast]:bg-gray-50 group-[.toast]:text-gray-800",
          cancelButton:
            "group-[.toast]:bg-gray-700 group-[.toast]:text-gray-50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
