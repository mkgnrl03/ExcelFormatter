import { useState } from "react";
import * as XLSX from 'xlsx';
import type { RowData } from "../types";

type File = {
  name: string
  extension: string
}

export default function useExcelFileReader(){
  const [file, setFile] = useState<File | undefined>() 
  const [error, setError] = useState<string | undefined>()
  const [jsonData, setJsonData] = useState<Array<RowData>>()

  function reader(targetFile: globalThis.File | null | undefined) {
    if (!targetFile) {
      setError("No file found.")
      return
    }

    const filename = targetFile.name.split(".")
    const tempFileName: File = {
      name: filename[0],
      extension: filename[1].toLowerCase()
    }
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result) {
        return
      };

      const sheetToJsonOpts = {
        raw: false,
        dateNF: 'dd-mm-yyy'
      }

      if (tempFileName.extension === 'csv' && typeof result === 'string') {
        const worksheet = XLSX.read(result, { type: 'string' }).Sheets.Sheet1;
        const readerJsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, sheetToJsonOpts);
        setJsonData(readerJsonData)
      } else if (typeof result === 'string') {
        const workbook = XLSX.read(result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const readerJsonData:  RowData[]  = XLSX.utils.sheet_to_json(worksheet, sheetToJsonOpts);
        setJsonData(readerJsonData)
      }
    }

    if (tempFileName.extension === 'csv') {
      reader.readAsText(targetFile)
    } else {
      reader.readAsArrayBuffer(targetFile)
    }
    setFile(tempFileName)
  }

  return {
    file,
    error,
    jsonData,
    reader
  }
}


   