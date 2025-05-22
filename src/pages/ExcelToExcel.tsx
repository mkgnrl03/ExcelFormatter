import Button from "@/components/atom/Button"
import UploadProcess from "@/components/organism/UploadProcess"
import { useState } from "react"


type JourneyTabProp = {
  paths: string[],
  activeIndex: number
} 

function JourneyTab({ paths, activeIndex }: JourneyTabProp ) {

  if(paths.length < 1){
    return <p className="text-red-500 text-xs font-semibold">Oops... no paths found. Please a provide a journey paths.</p>
  }

  return (
     <div className="text-xs bg-zinc-100 border rounded py-3 overflow-hidden">
      <div className="relative mx-5">
        <div className="absolute top-1/2 left-0 z-0 h-[1px] w-full bg-zinc-500" />
        <div className="flex justify-between w-full relative z-50">
           {
            paths.map((journey, index) => (
              <div key={journey} className="w-fit px-2  bg-zinc-100 flex items-center justify-center gap-1">
                <div className={`
                   rounded-full w-5 aspect-square flex items-center justify-center
                    ${ activeIndex === index ? 'bg-primary' : 'bg-zinc-500'}
                `}>
                  <p className="text-white">{index+1}</p>
                </div>
                <p className="font-semibold">{journey}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}



const ExcelToExcel = () => {
  const [activeProcess, setActiveProcess] = useState<number>(1)

  const processes = [
    {
      id: 1,
      title: "Upload Excel File",
      action: "Upload",
      component: <UploadProcess />
    },
    {
      id: 2,
      title: "Transform Excel File",
      action: "Transform",
      component:<div>Transform</div>
    },
    {
      id: 3,
      title: "Download Processed File",
      action: "Download",
      component: <div>Download</div>
    }
  ]

  const journeyPaths = processes.map((process) => process.action)

  function handleNextProcess() {
    if(activeProcess  < processes.length) {
      setActiveProcess(activeProcess + 1)
    }
  }

  function handleDownloadFile(){
    setActiveProcess(1)
  }


  return (
    <div className="">
      <div className="bg-[#fafafa] p-6 rounded-md shadow-md w-lg flex flex-col gap-8">
          <div className="flex flex-col gap-3">
             <h2 className="font font-semibold text-md">Upload Excel File</h2>  
              <JourneyTab
                paths={journeyPaths}
                activeIndex={activeProcess-1}
              />
          </div>

        {
           processes
            .filter((process) => process.id === activeProcess)
            .map((active) => active.component)
        }

        <div className="flex">
          {
            activeProcess === 1 && 
             <Button 
              handler={handleNextProcess}
              name="Go to transform"
            />
          }
            {
            activeProcess === 2 && 
             <Button 
              handler={handleNextProcess}
              name="Proceed to Download"
            />
          }
            {
            activeProcess === 3 && 
             <Button 
              handler={handleDownloadFile}
              name="Dowload File"
            />
          }
        </div>
      </div>
    </div>
  );
}

export default ExcelToExcel;
