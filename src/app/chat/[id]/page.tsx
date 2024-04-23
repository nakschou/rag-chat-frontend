import ChatRoom from "@/components/chatroom";

export default function ChatPage( { params }: { params: {id:string}} ) {

    return (
      <div className="w-full">
          <ChatRoom params={params}/>  
      </div>
    );
  }