import { StarterGui } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";
const ChatService = Knit.GetService("ChatService");

const ChatClient = {
	PostFeedback(msg: string, color?: Color3) {
		const chatProperties = {
			Text: msg,
			Color: color || Color3.fromRGB(201, 194, 158),
			Font: Enum.Font.Gotham,
			FontSize: Enum.FontSize.Size24,
		};
		StarterGui.SetCore("ChatMakeSystemMessage", chatProperties);
	},
	init() {
		ChatService.PostFeedback.Connect((Message: string, Color?: Color3) => {
			ChatClient.PostFeedback(Message, Color);
		});
		print("Chat Service Initialized | Client");
	},
};

export default ChatClient;
