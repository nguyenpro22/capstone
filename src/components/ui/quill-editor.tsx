"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
// Import our local CSS instead of the package CSS
import "@/styles/quill.css";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-32 w-full border rounded-md bg-muted/20 dark:bg-muted/40 animate-pulse" />
  ),
});

interface SimpleQuillEditorProps {
  value: string;
  onChange: (data: string) => void;
  error?: boolean;
  placeholder?: string;
}

export default function SimpleQuillEditor({
  value,
  onChange,
  error,
  placeholder,
}: SimpleQuillEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [quillInstance, setQuillInstance] = useState<any>(null);

  // Ensure component is mounted before rendering Quill
  useEffect(() => {
    setMounted(true);
    console.log("🔍 SimpleQuillEditor mounted");

    // Find the Quill instance after component is mounted
    if (mounted) {
      // Wait a bit for the editor to initialize
      const timer = setTimeout(() => {
        const quillEditor = document.querySelector(".quill-editor .ql-editor");
        if (quillEditor) {
          // Walk up to find the ReactQuill instance
          let parent = quillEditor.parentElement;
          while (parent && !parent.className.includes("quill-editor")) {
            parent = parent.parentElement;
          }

          if (parent) {
            const quill = (parent as any).__quill;
            if (quill) {
              console.log("🔍 Quill instance found");
              setQuillInstance(quill);
            }
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Handle image upload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleImageUpload = () => {
    if (!quillInstance) {
      console.log("❌ Quill instance not found");
      return;
    }

    console.log("🔍 Image upload handler triggered");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.style.display = "none";

    // Append to body and remove after selection
    document.body.appendChild(input);

    input.onchange = async () => {
      if (!input.files?.length) {
        document.body.removeChild(input);
        return;
      }

      const file = input.files[0];
      console.log("🔍 File selected:", file.name);

      try {
        console.log("🚀 Sending API request to /api/upload-image");

        // Create FormData for upload
        const formData = new FormData();
        formData.append("image", file);

        // Upload image to your server
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        console.log(`📡 API response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 API response data:", data);
        const imageUrl = data.url;

        // Insert the image at cursor position
        const range = quillInstance.getSelection(true);
        quillInstance.insertEmbed(range.index, "image", imageUrl);
        quillInstance.setSelection(range.index + 1);

        console.log("🖼️ Image inserted successfully");
      } catch (error) {
        console.error("❌ Error uploading image:", error);
        alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
      } finally {
        document.body.removeChild(input);
      }
    };

    input.click();
  };

  // Update toolbar handlers when quill instance changes
  useEffect(() => {
    if (quillInstance) {
      console.log("🔧 Setting up image handler");
      const toolbar = quillInstance.getModule("toolbar");
      toolbar.addHandler("image", handleImageUpload);
    }
  }, [handleImageUpload, quillInstance]);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "blockquote", "code-block"],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["clean"],
        ],
      },
    }),
    []
  );

  // Quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "blockquote",
    "code-block",
    "indent",
    "align",
  ];

  if (!mounted) {
    return (
      <div className="h-32 w-full border rounded-md bg-muted/20 dark:bg-muted/40 animate-pulse" />
    );
  }

  return (
    <div
      className={`quill-container ${
        error ? "border border-destructive dark:border-red-500 rounded-md" : ""
      }`}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Nhập nội dung..."}
        className={`quill-editor rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
          error ? "quill-error" : ""
        }`}
      />
      <style jsx global>{`
        /* Light mode styles */
        .ql-toolbar.ql-snow {
          border: 1px solid #e2e8f0;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #ffffff;
        }

        .ql-container.ql-snow {
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          background-color: #ffffff;
          color: #1e293b;
        }

        .ql-editor {
          min-height: 100px;
          max-height: 300px;
          overflow-y: auto;
          background-color: #ffffff;
          color: #1e293b;
        }

        /* Dark mode styles */
        .dark .ql-toolbar.ql-snow {
          border-color: #4b5563;
          background-color: #1f2937;
        }

        .dark .ql-container.ql-snow {
          border-color: #4b5563;
          background-color: #1f2937;
          color: #d1d5db;
        }

        .dark .ql-editor {
          background-color: #1f2937;
          color: #d1d5db;
        }

        /* Error state for dark mode */
        .dark .quill-error .ql-toolbar.ql-snow,
        .dark .quill-error .ql-container.ql-snow {
          border-color: #ef4444;
        }

        /* Toolbar button colors */
        .dark .ql-toolbar .ql-picker,
        .dark .ql-toolbar .ql-button {
          color: #d1d5db;
        }

        .dark .ql-toolbar .ql-picker.ql-expanded .ql-picker-label,
        .dark .ql-toolbar .ql-button.ql-active {
          color: #ec4899;
        }

        /* Placeholder color */
        .dark .ql-editor.ql-blank::before {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
