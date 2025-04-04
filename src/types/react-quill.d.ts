declare module "react-quill" {
    import React from "react"
  
    interface QuillOptions {
      modules?: {
        toolbar?: {
          container?: any[]
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          handlers?: Record<string, Function>
        } & Record<string, any>
      } & Record<string, any>
      formats?: string[]
      theme?: string
      placeholder?: string
      readOnly?: boolean
    }
  
    interface ReactQuillProps extends QuillOptions {
      value: string
      onChange: (content: string) => void
      className?: string
    }
  
    // Define the Quill instance interface based on how you're using it
    interface QuillInstance {
      getSelection: (focus?: boolean) => { index: number; length: number }
      insertEmbed: (index: number, type: string, value: any) => void
      setSelection: (index: number, length?: number) => void
      getModule: (name: string) => any
    }
  
    class ReactQuill extends React.Component<ReactQuillProps> {
      // Add static methods if needed
      static Quill: any
    }
  
    export default ReactQuill
  }
  
  