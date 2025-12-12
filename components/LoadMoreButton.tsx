import { Button } from "./ui/button";

const LoadMoreButton = ({
  paginationData,
  fetchMoreAnime,
  isLoading,
}: {
  paginationData: any;
  fetchMoreAnime: () => void;
  isLoading: boolean;
}) => {
  if (paginationData) {
    const hasMore =
      paginationData.current_page < paginationData.last_visible_page;

    return hasMore ? (
      <div className="w-full flex justify-center my-6">
        <Button
          variant="default"
          onClick={fetchMoreAnime}
          disabled={isLoading}
          className="cursor-pointer font-semibold hover:scale-105 transition"
        >
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      </div>
    ) : (
      <p className="text-center text-muted-foreground my-6">
        You’ve reached the end of the list!
      </p>
    );
  }
};

export default LoadMoreButton;
