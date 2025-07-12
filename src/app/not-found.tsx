import ErrorIllustration from "@/assets/illustrations/undraw/404.svg";
import Button from "@/components/input/Button";

export default function NotFound() {
  return (
    <div className="max-w-7xl flex flex-col mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-32 items-center">
      <ErrorIllustration className="w-96 " />
      <p className="m-8 text-2xl">404 page not found</p>
      <h1>
        <Button variant="outlined" href="/">
          Go Home
        </Button>
      </h1>
    </div>
  );
}
