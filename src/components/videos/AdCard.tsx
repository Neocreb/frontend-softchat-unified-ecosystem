
import { Button } from "@/components/ui/button";
import { AdData } from "@/types/video";

interface AdCardProps {
  ad: AdData;
}

const AdCard = ({ ad }: AdCardProps) => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <img src={ad.image} className="h-full w-full object-cover" alt={ad.title} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent to-black/70">
        <div className="text-white">
          <div className="text-xs uppercase mb-1">Ad · {ad.sponsor}</div>
          <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
          <p className="text-sm mb-4">{ad.description}</p>
          <Button size="sm">{ad.cta}</Button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
