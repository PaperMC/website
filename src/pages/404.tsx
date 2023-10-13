import ErrorIllustration from "@/assets/illustrations/undraw/404.svg";

const notFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <ErrorIllustration className="w-96 " />
      <p>404 page not found</p>
    </div>
  );
};

export default notFound;
