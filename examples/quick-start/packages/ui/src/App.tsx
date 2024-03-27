import "./App.css";
import Chatbot, {
  FloatingActionButtonTrigger,
  InputBarTrigger,
  ModalView,
} from "mongodb-chatbot-ui";

function MyApp() {
  const suggestedPrompts = [
    "How many articles are there in the dataset?",
    "Can you work out the best way to categorise all articles into different AI use cases?",
    "Which articles are not relevant to HVAC and AI and explain why?",
  ];

  return (
    <div>
      <Chatbot darkMode={true} serverBaseUrl="http://localhost:3000/api/v1">
        <InputBarTrigger suggestedPrompts={suggestedPrompts} />
        <FloatingActionButtonTrigger text="HVAC AI" />
        <ModalView
          initialMessageText="Welcome to HVAC AI Assistant. What can I help you with?"
          initialMessageSuggestedPrompts={suggestedPrompts}
        />
      </Chatbot>
    </div>
  );
}

export default MyApp;

