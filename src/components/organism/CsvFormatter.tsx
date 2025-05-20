import { useState } from "react";
import useExcelFileReader from "../../hooks/useExcelFileReader";
import type { ArrayOfData, RowData } from "../../types";
import { s2ab } from "../../utils/s2ab";
import { transformToOAO } from "../../utils/transformToOAO";
import * as XLSX from 'xlsx';
import Button from "../atom/Button";
import { FileDown } from "lucide-react";

const CsvFormatter = () => {
  const [finalOutputData, setFinalOutputData] = useState<ArrayOfData[][] | undefined>()
  const [isConverting, setIsConverting] = useState<boolean>(false)

  const { jsonData, reader } = useExcelFileReader()

  const allowedMetricRegex = /^\d{1,2}\/\d{1,2}\/\d{2}$/

  const allowedKeys = [
    "organickeywords:1–3", 
    "organickeywords:4–10", 
    "organickeywords:11–20", 
    "organickeywords:21–50",
    "organickeywords:51+",
    "metric"
  ]

  const isValidMetricDate = (input: string) => allowedMetricRegex.test(input)

  function cleanJsonData(data: RowData[] | undefined) {
    if(!data) return;

    setIsConverting(true)

    const filtered = data.filter((json) => "Metric" in json && isValidMetricDate(json.Metric as string))
    
    const mapped = filtered.map((json) => {
      const mappedData: RowData = {}

      const filteredKey = Object.keys(json).filter(key => {
        const cleanedKey = key.trim().split(" ").join("").toLocaleLowerCase()
        return allowedKeys.includes(cleanedKey)
      })

      filteredKey.forEach((key) => {
        if(key.trim().toLowerCase() === "metric") {
          mappedData["Date"] = (json[key] as string).trim()
        }
        else {
          mappedData[key] = (json[key] as string).trim()
        }
      })
      return mappedData
    })

    const aoa_data = transformToOAO(mapped)

    setTimeout(() => {
      setFinalOutputData(aoa_data)
      setIsConverting(false)
    }, 500)
  }

  function handleSheetExportAOA(){
      if(!finalOutputData) return; 

      const ws = XLSX.utils.aoa_to_sheet(finalOutputData)
      const workbook = XLSX.utils.book_new()
      
      XLSX.utils.book_append_sheet(workbook, ws, "Sheet 1")
  
      const csvOutput = XLSX.write(workbook, {
        bookType: "csv",
        type: 'binary'
      });
  
      const blob = new Blob([s2ab(csvOutput)], { type: `text/csv;charset=utf-8;` });
  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `output_${Date.now()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }


  return (
    <div className="w-full">
      <h1 className="font-bold text-xl mb-8">CSV Formatter 2</h1>
      <div className="flex flex-col gap-2">
        <label 
          htmlFor="input-file"
          className="text-lg font-semibold tracking-wide"
        >
          Upload an excel file: 
        </label>

        <input type="file" id="input-file"
          className="border w-fit rounded px-4 py-2 text-sm"
          onChange={reader}
        />

        <div className="flex gap-2 w-fit">
          <Button 
            name="Convert File"
            handler={() => cleanJsonData(jsonData)}
            isDisabled={!jsonData || jsonData.length <= 0 }
            isLoading={isConverting}
          />

          <Button 
            name="Export File"
            handler={handleSheetExportAOA}
            isDisabled={!finalOutputData || finalOutputData.length <= 0 }
            isLoading={false}
          >
             <FileDown size={16}/>
          </Button>
        </div>
        
      </div>
    </div>
  );
}

export default CsvFormatter;
