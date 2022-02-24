import { useEffect, useState } from "react";
import Pusher from "pusher-js";

function App() {
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  let allMessages = [] as any;

  useEffect(() => {
    Pusher.logToConsole = false;

    const pusher = new Pusher('af61646bc041a9c203ec', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: any) => {
      allMessages.push(data);
      setMessages(allMessages);
    });
  }, [])

  const submit = async (e: any) => {
    e.preventDefault()

    await fetch('http://localhost:8000/api/messages', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message
      })
    });

    setMessage('');
  }

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" >
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
          <input value={username} onChange={e => setUsername(e.target.value)} className="fs-5 fw-semibold" />
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea">
          {messages.map((message, key) => {
            return (
              <div key={key} className="list-group-item list-group-item-action py-3 lh-tight">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{message.username}</strong>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            )
          })}
        </div>
      </div>
      <form onSubmit={e => submit(e)}>
        <input className="form-control" placeholder="ketik pesan" value={message} onChange={e => setMessage(e.target.value)} />
      </form>
    </div>
  );
}

export default App;
