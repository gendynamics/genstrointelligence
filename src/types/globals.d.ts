// Type declarations for CSS modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
  export = content;
}

// Type declarations for other asset imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.svg';
declare module '*.ico';
declare module '*.webp';