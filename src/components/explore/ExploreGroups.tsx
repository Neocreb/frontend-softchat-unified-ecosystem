
import { formatNumber } from "@/utils/formatters";

interface Group {
  id: string;
  name: string;
  members: number;
  category: string;
  cover: string;
}

interface ExploreGroupsProps {
  groups: Group[];
}

const ExploreGroups = ({ groups }: ExploreGroupsProps) => {
  return (
    <div className="mt-4 space-y-4">
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.id} className="rounded-lg overflow-hidden border cursor-pointer hover:shadow-md">
            <div className="h-32 overflow-hidden">
              <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{group.category} • {formatNumber(group.members)} members</p>
              <button className="mt-2 w-full text-center py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium">Join Group</button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No groups found</p>
        </div>
      )}
    </div>
  );
};

export default ExploreGroups;
