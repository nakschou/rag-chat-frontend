'use client'
import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation';
export default function ChatRoom({ params }) {
    const router = useRouter();

    const url_start = process.env.MY_API_ENDPOINT
    // State to hold messages
    const [messages, setMessages] = useState([
      { text: "Hey Sarah, how are you doing?", user: true },
      { text: "Just checking in on the project status.", user: false },
    ]);
    const [isLoadingMessage, setIsLoadingMessage] = useState(false); // State to hold loading status
    const messagesEndRef = useRef(null); // Create a ref for the messages container

    // Scroll to the bottom function
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  
    // Scroll to bottom on initial load and on message updates
    useEffect(() => {
      scrollToBottom();
    }, [messages]); // Assuming 'messages' is your state or prop that updates when a new message is added
    
    const [newMessage, setNewMessage] = useState('');
    const id = params.id;

    // function to fetch messages
    const fetchMessages = () => {
      fetch(url_start + '/get_messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"id": id}),
      })
        .then(response => response.json())
        .then(data => setMessages(data))
        .catch(error => {
          console.error('Error fetching messages:', error);
          //router.push('/chat/invalid-id');  // Navigate to /chat/invalid-id on error
        });
        
    };

    // Fetch messages and scroll to bottom
    useEffect(() => {
      fetchMessages();
      scrollToBottom();
    }, []);

        // Function to handle message submission
      const handleSubmit = (event: any) => {
        event.preventDefault(); // Prevent default form submission behavior
        const messageData = { text: newMessage, user: true, id: id }; // Assume the message is from the user
        // update the redis database first
        fetch(url_start + "/update_redis", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          fetchMessages(); // Fetch the latest messages after submitting
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
        setIsLoadingMessage(true); // Set loading status to true
        // Then send the message to the QA model for processing
        fetch(url_start + "/rag_qa", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          fetchMessages(); // Fetch the latest messages after submitting
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
        setIsLoadingMessage(false); // Set loading status to false
        setNewMessage(''); // Clear the message input after sending
      };

  return (
    <main className="h-screen w-screen flex items-center justify-center">
      <div className="h-full w-full flex flex-col border">
        <div className="flex-1 border-b">
          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
            <Link
              className="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-lg font-medium dark:bg-gray-800"
              href="/"
            >
              <HomeIcon className="h-6 w-6" />
            </Link>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Chatroom ID: {id}</div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {Object.keys(messages).map((messageId) => {
                const message = messages[messageId];
                const user = message.user;
                return (
                  <div key={messageId} className={`flex items-center gap-2 justify-start`}>
                    <div className="rounded-full overflow-hidden border-2 border-white w-10 h-10">
                      <img
                        alt={`${message.createdBy} avatar`}
                        className="object-cover w-full h-full"
                        src={message.avatarUrl || user ? "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg": "https://pbs.twimg.com/profile_images/1719004662630580224/B9j_z9iG_400x400.jpg"}
                      />
                    </div>
                    <div className={`w-full rounded-lg ${user ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <div className="p-4 text-sm">{message.text}</div>
                    </div>
                  </div>
                );
              })}
              {isLoadingMessage && (
              <div className="flex items-center gap-2 justify-start">
                    <div className="rounded-full overflow-hidden border-2 border-white w-10 h-10">
                      <img
                        alt={`avatar`}
                        className="object-cover w-full h-full"
                        src={"https://pbs.twimg.com/profile_images/1719004662630580224/B9j_z9iG_400x400.jpg"}
                      />
                    </div>
                    <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-800">
                      <div className="p-4 text-sm">
                        <Skeleton className="w-[500px] h-[20px] rounded-full" />
                        <div className="h-2" />
                        <Skeleton className="w-[500px] h-[20px] rounded-full" />
                        <div className="h-2" />
                        <Skeleton className="w-[500px] h-[20px] rounded-full" />
                      </div>
                    </div>
              </div>
            )}
            </div>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center p-4 border-t">
          <div className="w-full max-w-[600px]">
            <form className="flex gap-4" onSubmit={handleSubmit}>
              <Textarea
                  className="flex-1 min-h-[100px]"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}