import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-8 w-8 rounded-lg mb-2" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-4 w-16 mt-1" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-10 w-10 rounded-lg mb-3" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-28 mt-1" />
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 min-w-[200px]">
              <Skeleton className="h-24 w-full rounded-lg mb-3" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full mt-2" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LanguageListSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-12 w-12 rounded-xl mb-3" />
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <Skeleton className={`h-20 ${i % 2 === 0 ? 'w-2/3' : 'w-3/4'} rounded-2xl`} />
        </div>
      ))}
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    </div>
  );
}
