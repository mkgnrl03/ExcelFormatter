
export interface InputExcelHeader {
  "organickeywords:1-3": number
  "organickeywords:4-10": number
  "organickeywords:21-50": number
  "organickeywords:51+": number
  date: string
}

export interface OutputExcelHeader {
  Date: string,
  Index: string,
  Keywords: string,
  "Ranking Range": string
}