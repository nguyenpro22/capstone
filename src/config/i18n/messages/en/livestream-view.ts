import { Messages } from "../types";

export const livestreamMessages: Messages["livestreamMessages"] = {
  header: {
    title: "Beautify Livestream",
  },
  loading: {
    text: "Loading livestream rooms...",
  },
  error: {
    title: "No Active Livestreams",
    noStreams: "No livestreams are currently active",
    retry: "Try Again",
  },
  noLivestreams: {
    title: "No Livestreams Available",
    description:
      "There are currently no livestreams. Please check back later to watch interesting beauty sessions from our experts.",
    refresh: "Refresh",
  },
  preview: {
    title: "Preview:",
    viewers: "{count} viewers",
    joinRoom: "Join Room",
    live: "LIVE",
    otherStreams: "Other Livestreams",
    noOtherStreams: "No Other Livestreams",
    noOtherStreamsDesc: "No additional livestreams available.",
    preview: "Preview",
    join: "Join",
  },
  streamCard: {
    live: "LIVE",
    viewers: "viewers",
    timeAgo: {
      seconds: "{count} seconds ago",
      minutes: "{count} minutes ago",
      hours: "{count} hours ago",
      days: "{count} days ago",
    },
  },
  allStreams: {
    title: "All Livestreams",
  },
  footer: {
    copyright: "© {year} Beautify. All rights reserved.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    contact: "Contact",
  },
};
