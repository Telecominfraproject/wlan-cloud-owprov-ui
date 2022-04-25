export interface System {
  UI?: string;
  certificates?: { expiresOn: number; filename: string }[];
  hostname: string;
  os: string;
  processors: 16;
  start: number;
  uptime: number;
  version: string;
}
