"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [id, setId] = useState(""); // Add this line
  const [progress, setProgress] = React.useState(13);

  const url_start = process.env.NEXT_PUBLIC_MY_API_ENDPOINT;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]); // Set the selected file
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);

    fetch(`${url_start}generate_id`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        formData.append("id", data.id);
        setId(data.id);
        fetch(`${url_start}pdf_to_pinecone`, {
          method: "POST",
          mode: "cors",
          body: formData,
        })
          .then((response) => {
            console.log(response);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(() => {
            router.push(`/chat/${data.id}`);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error("There was an error!", error);
          });
      });
  };

  const handleSessionSubmit = async () => {
    if (!sessionId) {
      alert("Please enter a session ID!");
      return;
    }
    router.push(`/chat/${sessionId}`);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Loading...
        </h1>
        <p className="max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
          Upload your PDF and chat with it here.
        </p>
        <Progress value={progress} className="w-1/2" />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                PDF Q&A
              </h1>
              <p className="max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
                Upload your PDF and chat with it here.
              </p>
            </div>
            <div className="w-full max-w-md flex items-center">
              <Input
                placeholder="Upload your file"
                type="file"
                onChange={handleFileChange}
                className="flex-1" // Allows the input to expand to fill the space
              />
              <Button onClick={handleSubmit} className="ml-4">
                Upload File
              </Button>
            </div>
            <div className="w-full max-w-md flex items-center">
              <Input
                className="flex-1"
                placeholder="Or, enter your session ID here"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
              <Button onClick={handleSessionSubmit} className="ml-4">
                Submit Session ID
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2">
            <div className="space-y-4 p-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How to Use PDF Q&A
              </h2>
              <p className="text-gray-600 dark:text-gray-400 md:text-xl">
                Follow these steps to get started.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Choose your PDF</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the upload button above and select your file. If you
                    have a previous session saved, you may use that in the box
                    below. Or, type default for the default PDF (Startup
                    Playbook).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Wait for preparation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    PDF Q&A needs time to process your PDF. Please be patient as
                    it prepares the document for you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Chat with your PDF</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can now chat with your PDF. Type your message in the box
                    and press enter to send it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Created by Justin Chou for Infinitus AI
          </p>
        </nav>
      </footer>
    </div>
  );
}
