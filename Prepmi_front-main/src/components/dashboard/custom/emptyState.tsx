 import { Button } from './button';

 interface EmptyState {
    title: string;
    description: string;
    buttonTitle?:string;
    icon?:any;
    onclick? : () => void

 }

const EmptyStateComponent = ({title,description,onclick,buttonTitle = "Go Back" , icon } : EmptyState) => {
  return (
    <div className='flex flex-col items-center justify-center h-[60vh] p-10 text-center'>
      <div className='mb-6'>
 
        
        {icon}
      </div>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold   mb-2'>{title}</h2>
        <p className=' '>{description}</p>
      </div>
        <Button  onClick={onclick}>
        {buttonTitle}
        </Button>
    </div>
  );
};

export default EmptyStateComponent;