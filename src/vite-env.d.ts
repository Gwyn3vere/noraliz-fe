interface ImportMetaEnv {
  readonly VITE_REACT_APP_VERSION: string;
  // thêm các biến khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
