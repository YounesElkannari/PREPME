import { Button } from './button'
// import { useDispatch } from 'react-redux'
import { FormatPrice } from '@/utils'


export default function ProductItem(product: any) {
  // const dispatch = useDispatch()

  return (
    <li className='rounded-lg border p-4 hover:shadow-md'>
      <div className='mb-8 flex items-center justify-between'>
        <div
          className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
        >
          <img src={product.image} className='h-full w-full' />
        </div>
        <Button
          variant='outline'
          disabled={product?.quantity <= 0 && true}
          size='sm'
          onClick={() => {


            // dispatch(addToCart(product))
          }}
          className={`${product.quantity ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
        >
          {product?.quantity > 0 ? 'Ajouter' : 'Rupture'}
        </Button>
      </div>
      <div>
        <h2 className='mb-1 font-semibold'>{product?.name}</h2>
        <div className='flex flex-row justify-between'>
          <h2 className='mb-1 font-semibold'>{FormatPrice(product?.price)}</h2>

          <h2 className='mb-1 font-semibold'>
            {Number(product?.quantity)}
            <span className='ml-1'>Unite</span>
          </h2>
        </div>

        <p className='line-clamp-2 text-gray-500'>{product?.description}</p>
      </div>
    </li>
  )
}
