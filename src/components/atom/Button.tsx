import { Loader } from "lucide-react";

type ButtonProp = {
  name?: string,
  handler?: () => void,
  isDisabled?: boolean,
  isLoading?: boolean,
  children?: React.ReactNode
}
const Button = (prop: ButtonProp) => {
  return (
    <button 
      className={`
        cursor-pointer
        disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed 
      text-white bg-primary w-full flex items-center justify-center gap-1 py-2 px-6 rounded
      `}
      onClick={prop.handler}
      disabled={prop.isDisabled || prop.isLoading}  
    >
      {
        prop.isLoading && <Loader className='animate-spin' size={18}/>
      }

      
      {
        prop.children
      }
      <p className="text-nowrap text-sm">{prop.name}</p>
   </button>
  );
}

export default Button;
