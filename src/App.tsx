import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import type { OutputExcelHeader } from './types';
import { Loader } from 'lucide-react';

interface RowData {
  [key: string]: string | number | boolean | Date | null | undefined;
}

type AllowedFileExtension = "csv" | "xls" | "xlsx" | "default"

const App = () => {
   const [data, setData] = useState<RowData[]>([]);
   const [fileName, setFileName] = useState<string | undefined>()
   const [fileExtension, setFileExtension] = useState<AllowedFileExtension>("default")

   const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const sheetToJsonOpts = {
      raw: false,
      dateNF: 'dd-mm-yyy'
    }

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result) return;

      let workbook: XLSX.WorkBook;

      if (fileExtension === 'csv' && typeof result === 'string') {
        const worksheet = XLSX.read(result, { type: 'string' }).Sheets.Sheet1;
        const jsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, sheetToJsonOpts);
        setData(jsonData);
        setFileExtension(fileExtension)
      } else if (typeof result === 'string') {
        workbook = XLSX.read(result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, sheetToJsonOpts);
        setData(jsonData);
        setFileExtension(fileExtension === "xls" ? "xls" : "xlsx")
      }
    }

    if (fileExtension === 'csv') {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }

    setFileName(file.name)
   
  };
  
  return (
    <main className="bg-zinc-950 text-white w-screen h-[100vh] flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded h-fit min-w-96 flex flex-col gap-10">
        {
          data.length > 0 
            ? <TransformLayer data={data} fileName={fileName} fileExtension={fileExtension}/>
            : <div>
              <h1 className='text-xl font-semibold'>Upload an Excel file</h1>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload} 
                className="border p-2 rounded flex text-sm w-fit mt-4"
              />
            </div>
        }
      </div>
    
    </main>
  );
}

type TransformCardProp = {
  data: RowData[],
  fileName: string | undefined,
  fileExtension: AllowedFileExtension
}
function TransformLayer({ data, fileName, fileExtension }: TransformCardProp ) {
 
  const [transformedData, setTransformedData] = useState<OutputExcelHeader[]>([])
  const [newFileName, setNewFileName] = useState<string>("")
  const [isTransforming, setTransformStatus] = useState<boolean>(false)

  function handleExcelTransformation() {
    setTransformStatus(true)
    const transformed = data.reduce<Array<OutputExcelHeader>>((acc, curr) => {
      Object.keys(curr).forEach((key: string) => {
        if(key === "Date") return
        const newData: OutputExcelHeader = {
          Date: curr.Date?.toString().trim() as string,
          Index: key.trim(),
          Keywords: curr[key] as string,
          "Ranking Range": `'${key.trim().split(" ").join("").slice(16)}'`
        }
        acc.push(newData)
      })

      return acc
    }, [])
    setTimeout(() => {
      setTransformedData(transformed)
      setTransformStatus(false)
    }, 500)
  }

  function handleDownload() {
    if(transformedData.length < 1) return

    const worksheet = XLSX.utils.json_to_sheet(transformedData)
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const csvOutput = XLSX.write(workbook, {
      bookType: 'csv',
      type: 'binary'
    });

    // Convert binary string to Blob
    const blob = new Blob([s2ab(csvOutput)], { type: 'text/csv;charset=utf-8;' });

    // Create a link to download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', newFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

 const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length);      // Create buffer of same length
  const view = new Uint8Array(buf);           // Create typed array view
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;         // Get byte value for each character
  }
  console.log(buf)
  return buf;                                 // Return ArrayBuffer
};

  const fileIcons = {
    csv: "./src/assets/icons/csv.png",
    xls: "./src/assets/icons/xls.png",
    xlsx: "./src/assets/icons/xls.png",
    default: "./src/assets/icons/csv.png"
  }
  
  const fileIcon = fileIcons[fileExtension]

  return(
    <div className='flex flex-col gap-4'>
       <h1 className='text-xl font-semibold tracking-wide'>Transform File</h1>
        <div className='flex items-center justify-start gap-3 text-sm border border-dashed border-gray-500 p-3 rounded '>
          <img 
            src={fileIcon} 
            alt={fileExtension} 
            className="w-8"
          />
          <div>
            <p className='text-md mb-[0.5px]'>{fileName}</p>
            <p className='text-xs text-gray-400'>1 sheet</p>
          </div>
        </div>
        <button 
          className='font-semibold bg-blue-500 w-full flex gap-2 items-center justify-center p-2 rounded disabled:opacity-50 disabled:hover:cursor-not-allowed'
          onClick={handleExcelTransformation}
          disabled={transformedData.length > 0} 
        >
          {
            isTransforming && <Loader className='animate-spin'/>
          }
          Transform
        </button>
        <hr 
          className='text-zinc-500 my-3'
        />

        {
          transformedData.length > 0 && <>
               <div className='flex flex-col gap-3'>
                <label htmlFor="file-name">Provide a name of the file: </label>
                <input 
                  type="text" 
                  name='file-name'
                  onChange={(e) => setNewFileName(e.target.value)}
                  className='border rounded p-2 text-sm'
                />

                {
                  newFileName && <>
                    <button 
                        className='font-semibold bg-blue-500 w-full flex items-center justify-center p-2 rounded'
                        onClick={handleDownload}  
                      >
                        Download
                    </button>
                  </>
                }
              </div>
          </>
        }
    </div>
  )
}


export default App
