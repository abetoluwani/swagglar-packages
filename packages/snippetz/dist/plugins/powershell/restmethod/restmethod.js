import { generatePowershell } from '../../../libs/powershell.js';
/** Generates a PowerShell 7 request using Invoke-RestMethod. */
export const powershellRestmethod = {
    target: 'powershell',
    client: 'restmethod',
    title: 'Invoke-RestMethod',
    generate(request, configuration) {
        return generatePowershell('Invoke-RestMethod', request, configuration);
    },
};
