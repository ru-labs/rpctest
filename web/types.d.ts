interface NodeRequire {
  context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string) => any;
}