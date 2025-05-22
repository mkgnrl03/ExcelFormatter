import useExcelFileReader from "@/hooks/useExcelFileReader";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";

const UploadProcess = () => {
  return (
    <div>
      <UploadBox />
      <p className="mt-2 text-xs text-zinc-500">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione qui blanditiis explicabo distinctio possimus tempore quidem culpa corporis. Quisquam, sed!</p>
    </div>
  );
}

function UploadBox() {
  const { reader } = useExcelFileReader()

  const uploadInputRef = useRef<HTMLInputElement>(null)

  const handleUploadChange = () => {
    if(!uploadInputRef || !uploadInputRef.current){
      return
    }
    uploadInputRef.current.click()
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    reader(event.dataTransfer.files?.[0])
  }

  return (
    <div className="
      flex items-center justify-center bg-zinc-100 gap-6 relative
      border border-dashed border-zinc-400 min-h-40 rounded
      cursor-pointer hover:bg-zinc-200 transition
    "
      onClick={handleUploadChange}
      onDrop={handleFileDrop}
      onDragOver={(event) => {
        event.stopPropagation()
        event.preventDefault()
      }}
      onDragLeave={(event) => {
        event.stopPropagation()
        event.preventDefault()
      }}
    >
      <input 
        type="file"
        ref={uploadInputRef}
        className="hidden" 
        onChange={(event) => reader(event.target.files?.[0])}
      />
      <div className="flex flex-col items-center gap-2">
        <UploadIcon 
          size={24}
        />
        <p className="text-sm">
          Drag or drop file here
        </p>
      </div>
    </div>
  )
}


export default UploadProcess;