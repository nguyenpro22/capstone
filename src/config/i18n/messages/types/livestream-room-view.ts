export interface LivestreamRoomMessages {
  header: {
    viewers: string;
  };
  connection: {
    connecting: string;
    status: string;
    error: {
      title: string;
      message: string;
      security: {
        title: string;
        message: string;
      };
      backButton: string;
    };
  };
  livestreamInfo: {
    startedAt: string;
    name: string;
    clinic: string;
    description: string;
  };
  chat: {
    title: string;
    noMessages: {
      title: string;
      subtitle: string;
    };
    input: {
      placeholder: string;
    };
    sender: string;
    reactions: {
      title: string;
      types: {
        thumbsUp: string;
        heart: string;
        fire: string;
        amazing: string;
        beautiful: string;
      };
    };
  };
  services: {
    hidden: {
      title: string;
      restoreAll: string;
      show: string;
      hide: string;
      count: string;
    };
    actions: {
      hide: string;
      restore: string;
      book: string;
    };
    price: {
      range: string;
      from: string;
    };
    discount: string;
  };
}
