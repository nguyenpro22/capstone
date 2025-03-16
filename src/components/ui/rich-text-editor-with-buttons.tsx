"use client"

import type React from "react"

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
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export default function RichTextEditor({ value, onChange, error }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isInitialMount = useRef(true)
  const skipNextInput = useRef(false)

  // Initialize editor content only on mount and when value changes from outside
  useEffect(() => {
    if (isInitialMount.current) {
      if (editorRef.current) {
        editorRef.current.innerHTML = value
      }
      isInitialMount.current = false
      return
    }

    // Skip updating the innerHTML if the change came from within the editor
    // This prevents cursor jumping
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Save selection
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)
      const startOffset = range?.startOffset
      const endOffset = range?.endOffset
      const startContainer = range?.startContainer
      const endContainer = range?.endContainer

      // Update content
      skipNextInput.current = true
      editorRef.current.innerHTML = value

      // Restore selection if possible and if editor is focused
      if (isFocused && selection && range && startContainer && endContainer) {
        try {
          // Only attempt to restore selection if the containers still exist in the DOM
          if (editorRef.current.contains(startContainer) && editorRef.current.contains(endContainer)) {
            const newRange = document.createRange()
            newRange.setStart(startContainer, startOffset || 0)
            newRange.setEnd(endContainer, endOffset || 0)
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
        } catch (e) {
          console.log("Could not restore selection", e)
        }
      }
    }
  }, [value, isFocused])

  const handleContentChange = () => {
    if (editorRef.current) {
      if (skipNextInput.current) {
        skipNextInput.current = false
        return
      }
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

  const ToolbarButton = ({
    command,
    icon,
    onClick,
  }: { command?: string; icon: React.ReactNode; onClick?: () => void }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 p-0"
      onClick={() => {
        if (onClick) onClick()
        else if (command) execCommand(command)
      }}
    >
      {icon}
    </Button>
  )

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden",
        isFocused && "ring-2 ring-ring ring-offset-1",
        error && "border-destructive",
      )}
    >
      <div className="bg-muted/30 p-1 border-b flex flex-wrap gap-0.5 items-center">
        <ToolbarButton command="bold" icon={<Bold className="h-3.5 w-3.5" />} />
        <ToolbarButton command="italic" icon={<Italic className="h-3.5 w-3.5" />} />
        <ToolbarButton command="underline" icon={<Underline className="h-3.5 w-3.5" />} />

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton command="insertUnorderedList" icon={<List className="h-3.5 w-3.5" />} />
        <ToolbarButton command="insertOrderedList" icon={<ListOrdered className="h-3.5 w-3.5" />} />

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton command="justifyLeft" icon={<AlignLeft className="h-3.5 w-3.5" />} />
        <ToolbarButton command="justifyCenter" icon={<AlignCenter className="h-3.5 w-3.5" />} />
        <ToolbarButton command="justifyRight" icon={<AlignRight className="h-3.5 w-3.5" />} />

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton icon={<Link className="h-3.5 w-3.5" />} onClick={handleLinkClick} />
        <ToolbarButton command="unlink" icon={<Unlink className="h-3.5 w-3.5" />} />
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

