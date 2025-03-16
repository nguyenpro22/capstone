"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-32 w-full border rounded-md bg-muted/20 animate-pulse" />,
})

interface SimpleQuillEditorProps {
  value: string
  onChange: (data: string) => void
  error?: boolean
  placeholder?: string
}

export default function SimpleQuillEditor({ value, onChange, error, placeholder }: SimpleQuillEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [quillInstance, setQuillInstance] = useState<any>(null)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
    console.log("🔍 SimpleQuillEditor mounted")
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback(() => {
    // Prevent form from closing by creating a detached input element
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.top = "-1000px"
    container.style.left = "-1000px"
    document.body.appendChild(container)

    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    container.appendChild(input)

    // Prevent event propagation
    input.onclick = (e) => {
      e.stopPropagation()
    }

    input.onchange = async (e) => {
      e.stopPropagation()

      if (!input.files?.length) return

      const file = input.files[0]

      try {
        console.log("🚀 Sending API request to /api/upload-image")

        if (quillInstance) {
          // Show loading indicator in editor
          const range = quillInstance.getSelection(true)
          quillInstance.insertText(range.index, "Đang tải ảnh...", { color: "#999", italic: true })

          // Create FormData for upload
          const formData = new FormData()
          formData.append("image", file)

          // Upload image to your server
          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          })

          console.log(`📡 API response status: ${response.status}`)

          if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`)
          }

          const data = await response.json()
          console.log("📦 API response data:", data)

          // Remove loading text
          quillInstance.deleteText(range.index, "Đang tải ảnh...".length)

          // Insert uploaded image
          quillInstance.insertEmbed(range.index, "image", data.url)
          quillInstance.setSelection(range.index + 1)
        } else {
          console.error("❌ Quill instance not found")
          alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.")
        }
      } catch (error) {
        console.error("❌ Error uploading image:", error)

        // Show error in editor if quill instance exists
        if (quillInstance) {
          const range = quillInstance.getSelection(true)
          quillInstance.deleteText(range.index, "Đang tải ảnh...".length)
          quillInstance.insertText(range.index, "Lỗi tải ảnh lên", { color: "red", italic: true })
        } else {
          alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.")
        }
      } finally {
        // Remove container from DOM
        document.body.removeChild(container)
      }
    }

    input.click()
  }, [quillInstance])

  // Quill modules configuration
  const modules = {
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
      handlers: {
        image: handleImageUpload,
      },
    },
  }

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
  ]

  // Function to get Quill instance
  const getQuillInstance = useCallback(() => {
    try {
      // Sử dụng type assertion để tránh lỗi TypeScript
      const editorElement = document.querySelector(".ql-editor")
      if (editorElement && editorElement.parentNode) {
        // Sử dụng type assertion để truy cập thuộc tính __quill
        const parentNode = editorElement.parentNode as any
        if (parentNode.__quill) {
          setQuillInstance(parentNode.__quill)
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error getting Quill instance:", error)
      return false
    }
  }, [])

  // Try to get Quill instance after component is mounted
  useEffect(() => {
    if (mounted) {
      // Đợi một chút để Quill được khởi tạo hoàn toàn
      const timer = setTimeout(() => {
        getQuillInstance()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [mounted, getQuillInstance])

  if (!mounted) {
    return <div className="h-32 w-full border rounded-md bg-muted/20 animate-pulse" />
  }

  return (
    <div
      className={`quill-container ${error ? "border border-destructive rounded-md" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(content) => {
          onChange(content)
          // Thử lấy instance nếu chưa có
          if (!quillInstance) {
            getQuillInstance()
          }
        }}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Nhập nội dung..."}
        className={`rounded-md ${error ? "quill-error" : ""}`}
        onFocus={() => {
          // Thử lấy instance khi focus
          if (!quillInstance) {
            getQuillInstance()
          }
        }}
      />
      <style jsx global>{`
        .quill-container {
          display: block;
          width: 100%;
        }
        
        .quill-error .ql-toolbar.ql-snow {
          border-color: var(--destructive);
          border-bottom-color: var(--destructive);
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        
        .quill-error .ql-container.ql-snow {
          border-color: var(--destructive);
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          min-height: 120px;
        }
        
        .ql-editor img {
          max-width: 100%;
          height: auto;
        }
        
        /* Ensure ReactQuill is visible */
        .react-quill {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          height: auto !important;
          min-height: 200px !important;
        }
        
        /* Ensure toolbar is visible */
        .ql-toolbar {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Ensure editor container is visible */
        .ql-container {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          height: auto !important;
          min-height: 150px !important;
        }
      `}</style>
    </div>
  )
}

