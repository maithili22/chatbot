import React, { useState } from 'react';
import './App.css';
import { PDFViewer, PdfFocusProvider } from '@llamaindex/pdf-viewer';

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([{ message: "How can I help you today?", type: 'system' , pdfLink:""}]);
  const [sources, setSources] = useState([]);
  const [activePDFURL, setActivePDFURL] = useState("");
  const handleNewChatClick = () => {
    window.location.reload();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setChatLog([...chatLog, { message: `${input}`, type: 'user' }]);
    setInput("");

    try {
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: input })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      
      setTimeout(() => {
        setChatLog([
          ...chatLog,
          { message: data.answer, type: 'response' }
        ]);

        
        setSources(data.sources.map(source => ({ message: source.message || source, pdfURL: source.source_url  })));
      }, 2000); 
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  const handleActivePDFURL = (url) =>{
    setActivePDFURL(url);
  }


  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={handleNewChatClick}>
          <span>+</span>
          New Chat
        </div>
        <div className="sources">
          <h3>Sources</h3>
          <div className="sources-list">
            {sources.length > 0 ? (
              sources.map((source, index) => (
                <div key={index} className="source-box" onClick={() => handleActivePDFURL(source.pdfURL)}>
                  {source.message}
                </div>
              ))
            ) : (
              <div>No sources available</div>
            )}
          </div>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((chat, index) => (
            <ChatMessage key={index} message={chat.message} type={chat.type} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
            />
          </form>
        </div>
      </section>
      {activePDFURL && <PDFViewerComponent file={{ id: 'sample-document', url: activePDFURL }} />}
    </div>
  );
}


const PDFViewerComponent = ({ file }) => {
  return (
    <PdfFocusProvider>
      <PDFViewer file={file} containerClassName="pdf-viewer-container" />
    </PdfFocusProvider>
  );
};

const ChatMessage = ({ message, type }) => {
  return (
    <div className={`chat-message ${type}`}>
      <div className="chat-message-center">
        <div className="message">
          {message}
        </div>
      </div>
    </div>
  );
};

export default App;
