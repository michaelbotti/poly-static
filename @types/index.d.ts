interface Window {
  grecaptcha: {
    ready: (cb: () => void) => string;
    execute: (
      key: string,
      {
        action: string,
      },
      cb: (token: string) => string
    ) => void;
  };
}
