"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink,
} from "lucide-react"
import { Toggle } from "@/components/ui/custom-toggle"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export default function RichTextEditor({ value, onChange, error }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value]) // Added value to dependencies

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    handleContentChange()
    editorRef.current?.focus()
  }

  const handleLinkClick = () => {
    const url = prompt("Enter URL:", "https://")
    if (url) {
      execCommand("createLink", url)
    }
  }

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden",
        isFocused && "ring-2 ring-ring ring-offset-1",
        error && "border-destructive",
      )}
    >
      <div className="bg-muted/30 p-1 border-b flex flex-wrap gap-0.5 items-center">
        <Toggle size="sm" aria-label="Bold" onClick={() => execCommand("bold")}>
          <Bold className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Italic" onClick={() => execCommand("italic")}>
          <Italic className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Underline" onClick={() => execCommand("underline")}>
          <Underline className="h-3.5 w-3.5" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle size="sm" aria-label="Bullet List" onClick={() => execCommand("insertUnorderedList")}>
          <List className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Numbered List" onClick={() => execCommand("insertOrderedList")}>
          <ListOrdered className="h-3.5 w-3.5" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle size="sm" aria-label="Align Left" onClick={() => execCommand("justifyLeft")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Align Center" onClick={() => execCommand("justifyCenter")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Align Right" onClick={() => execCommand("justifyRight")}>
          <AlignRight className="h-3.5 w-3.5" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle size="sm" aria-label="Insert Link" onClick={handleLinkClick}>
          <Link className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Remove Link" onClick={() => execCommand("unlink")}>
          <Unlink className="h-3.5 w-3.5" />
        </Toggle>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-3 focus:outline-none"
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

