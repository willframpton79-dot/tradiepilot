declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}
