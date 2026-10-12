import { generatePowershell } from '../../../libs/powershell.js';
/** Generates a PowerShell 7 request using Invoke-WebRequest. */
export const powershellWebrequest = {
    target: 'powershell',
    client: 'webrequest',
    title: 'Invoke-WebRequest',
    generate(request, configuration) {
        return generatePowershell('Invoke-WebRequest', request, configuration);
    },
};
