import type { HarRequest, PluginConfiguration } from '@scalar/types/snippetz';
/** Generate the common request arguments for PowerShell 7 HTTP cmdlets. */
export declare const generatePowershell: (command: "Invoke-RestMethod" | "Invoke-WebRequest", request?: Partial<HarRequest>, configuration?: PluginConfiguration) => string;
//# sourceMappingURL=powershell.d.ts.map