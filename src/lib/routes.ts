const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicAssetUrl(assetPath?: string): string | undefined {
  if (!assetPath) return undefined;
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  return `${basePath}/${assetPath.replace(/^\//, "")}`.replace(/\/\/+/g, "/");
}

export function routeUrl(route: string): string {
  if (/^https?:\/\//.test(route)) return route;
  return `${basePath}/${route.replace(/^\//, "")}`.replace(/\/\/+/g, "/");
}

export function internalRoute(route: string): string {
  return `/${route.replace(/^\//, "")}`.replace(/\/\/+/g, "/");
}
