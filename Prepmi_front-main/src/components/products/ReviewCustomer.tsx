
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { StarIcon } from 'lucide-react'

export default function ReviewCustomer() {
  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10 border">
        <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="grid gap-4">
        <div className="flex gap-4 items-start">
          <div className="grid gap-0.5 text-sm">
            <h3 className="font-semibold">Sarah Johnson</h3>
            <time className="text-sm text-muted-foreground">
              2 days ago
            </time>
          </div>
          <div className="flex items-center gap-0.5 ml-auto">
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
          </div>
        </div>
        <div className="text-sm leading-loose text-muted-foreground">
          <p>
            I've been experimenting with my Acme Circles T-Shirt for a
            few weeks now, and it's been a great addition to my
            wardrobe. The fabric is soft and comfortable, and the unique
            design really stands out.
          </p>
        </div>
      </div>
    </div>
  )
}
