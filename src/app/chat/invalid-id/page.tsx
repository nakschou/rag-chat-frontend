import Link from "next/link";

export default function InvalidID() {
  return (
    // Updated the classes here for vertical and horizontal centering, also ensuring it covers the full viewport height
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Uh oh! Your ID was invalid.
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Please try a different ID, or upload a new PDF.
        </p>
      </div>
      <Link
        className="inline-flex h-10 items-center rounded-md border border-gray-200 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        href="/"
      >
        Return to Homepage
      </Link>
    </div>
  );
}