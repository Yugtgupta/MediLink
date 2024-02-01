import React, { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      //@ts-ignore
      window.botpressWebChat.init({
        botId: "14c1c950-12ef-4344-97ed-fbcd7191363d",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        clientId: "14c1c950-12ef-4344-97ed-fbcd7191363d",
      });
    };
  }, []);

  return <div id="webchat" />;
};

export default Chatbot;
