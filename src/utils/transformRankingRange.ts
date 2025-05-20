
export function transformRankingRange(range: string){
    const extractedRange = 
      range
        .trim()
        .split(" ")
        .join("")
        .slice(16)

    return `'${extractedRange}`
  }
