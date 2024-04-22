import ChatRoom from "@/components/chatroom";

export default function ChatPage( { params } ) {

    return (
      <div className="w-full">
          <ChatRoom params={params}/>  
      </div>
    );
  }