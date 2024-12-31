const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="grow overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className="flex items-start gap-2">
            <div className="size-10 rounded-full">
              <div className="animate-pulse bg-gray-200 w-full h-full rounded-full" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="animate-pulse bg-gray-200 h-4 w-16" />
              <div className="animate-pulse bg-gray-200 h-16 w-[200px] rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
