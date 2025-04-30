import { Messages } from "../types";

export const livestreamRoomMessages: Messages["livestreamRoomMessages"] = {
  header: {
    viewers: "{count} viewers",
  },
  connection: {
    connecting: "Connecting to livestream...",
    status: "Status: {status}",
    error: {
      title: "Connection Error",
      message: "Failed to connect to the livestream. Please try again later.",
      security: {
        title: "Security Error",
        message:
          "The connection is being blocked because the API server is not using HTTPS.",
      },
      backButton: "Back to Livestreams",
    },
  },
  livestreamInfo: {
    startedAt: "Started: {date}",
    name: "Name: {name}",
    clinic: "Clinic: {clinic}",
    description: "Description: {description}",
  },
  chat: {
    title: "Live Chat",
    noMessages: {
      title: "No messages yet",
      subtitle: "Be the first to send a message!",
    },
    input: {
      placeholder: "Type your message...",
    },
    sender: "Guest",
    reactions: {
      title: "Quick Reactions:",
      types: {
        thumbsUp: "Looks great!",
        heart: "Love it!",
        fire: "That's fire!",
        amazing: "Amazing work!",
        beautiful: "Beautiful!",
      },
    },
  },
  services: {
    hidden: {
      title: "Hidden Services",
      restoreAll: "Restore All",
      show: "Show hidden services",
      hide: "Hide hidden services",
      count: "({count})",
    },
    actions: {
      hide: "Hide this service",
      restore: "Restore service",
      book: "Book Now",
    },
    price: {
      range: "Range: {min} - {max}",
      from: "From",
    },
    discount: "-{percent}%",
  },
};
