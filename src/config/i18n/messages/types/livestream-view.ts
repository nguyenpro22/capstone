export interface LivestreamViewMessages {
  header: {
    title: string;
  };
  loading: {
    text: string;
  };
  error: {
    title: string;
    noStreams: string;
    retry: string;
  };
  noLivestreams: {
    title: string;
    description: string;
    refresh: string;
  };
  preview: {
    title: string;
    viewers: string;
    joinRoom: string;
    live: string;
    otherStreams: string;
    noOtherStreams: string;
    noOtherStreamsDesc: string;
    preview: string;
    join: string;
  };
  streamCard: {
    live: string;
    viewers: string;
    timeAgo: {
      seconds: string;
      minutes: string;
      hours: string;
      days: string;
    };
  };
  allStreams: {
    title: string;
  };
  footer: {
    copyright: string;
    terms: string;
    privacy: string;
    contact: string;
  };
}
