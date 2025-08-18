import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { GroupChatThread } from "@/types/group-chat";

interface GroupDataTestProps {
  group: GroupChatThread;
  className?: string;
}

export const GroupDataTest: React.FC<GroupDataTestProps> = ({ group, className }) => {
  const requiredFields = [
    { name: 'id', value: group.id },
    { name: 'groupName', value: group.groupName },
    { name: 'groupType', value: group.groupType },
    { name: 'category', value: group.category },
    { name: 'participants', value: group.participants },
    { name: 'adminIds', value: group.adminIds },
    { name: 'createdBy', value: group.createdBy },
    { name: 'createdAt', value: group.createdAt },
    { name: 'settings', value: group.settings },
    { name: 'maxParticipants', value: group.maxParticipants },
  ];

  const checkField = (field: any) => {
    if (field.value === undefined || field.value === null) return false;
    if (Array.isArray(field.value) && field.value.length === 0) return false;
    if (typeof field.value === 'string' && field.value.trim() === '') return false;
    return true;
  };

  const passedFields = requiredFields.filter(checkField);
  const failedFields = requiredFields.filter(f => !checkField(f));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Group Data Validation Test
          {failedFields.length === 0 ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-600 mb-2">Passed ({passedFields.length})</h4>
            <div className="space-y-1">
              {passedFields.map((field) => (
                <div key={field.name} className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-sm">{field.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-red-600 mb-2">Failed ({failedFields.length})</h4>
            <div className="space-y-1">
              {failedFields.map((field) => (
                <div key={field.name} className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span className="text-sm">{field.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Group Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Name:</strong> {group.groupName || 'N/A'}</div>
            <div><strong>Type:</strong> {group.groupType || 'N/A'}</div>
            <div><strong>Category:</strong> {group.category || 'N/A'}</div>
            <div><strong>Members:</strong> {group.participants?.length || 0}</div>
            <div><strong>Admins:</strong> {group.adminIds?.length || 0}</div>
            <div><strong>Created By:</strong> {group.createdBy || 'N/A'}</div>
          </div>
        </div>

        <div className="mt-4">
          <Badge variant={failedFields.length === 0 ? "default" : "destructive"}>
            {failedFields.length === 0 ? "✅ Ready for GroupInfoModal" : "❌ May cause errors"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
