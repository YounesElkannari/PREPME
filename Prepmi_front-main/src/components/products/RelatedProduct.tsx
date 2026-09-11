import { truncateText } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'



export default function RelatedProduct({ product }: any) {
  const { t } = useTranslation();



  return (
    <div className="relative overflow-hidden rounded-lg group">
      <Link
        to={`/product/${product?.id || ''}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View</span>
      </Link>
      <img
        src={product?.image || "/placeholder.svg"}
        alt={product?.name || "Product Image"}
        width={400}
        height={300}
        className="object-cover w-full h-60"
        style={{ aspectRatio: "400/300", objectFit: "cover" }}
        onError={(e) => {
          e.currentTarget.src = "/no-image.jpg"; // Fallback image
        }}
      />
      <div className="p-4 bg-background">
        <h3 className="text-lg font-semibold md:text-xl">
          {product?.name || "Product Name"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {truncateText(product?.description)}
        </p>
        <h4 className="text-base font-semibold md:text-lg">
          {product?.price ? `${product.price}` : "0"} {t("currency")}
        </h4>
      </div>
    </div>

  )
}
