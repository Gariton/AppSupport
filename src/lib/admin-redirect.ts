export function safeAdminReturnTo(value: FormDataEntryValue | null, basePath: string) {
  if (typeof value !== "string") {
    return basePath;
  }

  return value === basePath || value.startsWith(`${basePath}/`) ? value : basePath;
}

export function appendStatusParam(location: string, key: string, value: string) {
  const [pathname, query = ""] = location.split("?");
  const params = new URLSearchParams(query);
  params.set(key, value);
  return `${pathname}?${params.toString()}`;
}
