const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const routePath = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;
  return `${basePath}${routePath}`;
}
