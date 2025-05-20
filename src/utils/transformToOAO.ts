import type { ArrayOfData, RowData } from "../types";
import { formatDate } from "./formatDate";
import { transformRankingRange } from "./transformRankingRange";

export function transformToOAO(data: RowData[]){
   const transformedData = data.reduce<Array<ArrayOfData[]>>((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if(key.toLocaleLowerCase() === "date") return 
        const newData = [
            formatDate(curr.Date as string), 
            key.trim(), 
            curr[key], 
            transformRankingRange(key),
            1
        ]
        acc.push(newData)
      })
      return acc
    }, [])

    const withHeader = [
      ["Date", "Index", "Keywords", "Ranking Range", "Record Count"], 
      ...transformedData
    ]


    return withHeader
}