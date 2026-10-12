import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { heading, item, list, paragraph, strong, text } from './markdown-nodes.js';
/** Preserve OR between requirements and AND between schemes within a requirement. */
export const renderSecurity = async (requirements, schemes, description) => {
    if (!requirements)
        return [];
    const nodes = [heading(4, text('Authentication'))];
    if (!requirements.length)
        nodes.push(paragraph(text('No authentication required.')));
    for (const [index, requirement] of requirements.entries()) {
        if (index)
            nodes.push(paragraph(text('Or:')));
        const entries = Object.entries(requirement);
        if (!entries.length) {
            nodes.push(paragraph(text('No authentication required.')));
            continue;
        }
        const entriesNodes = [];
        for (const [name, scopes] of entries) {
            const blocks = [
                paragraph(strong(text(name)), ...(scopes?.length ? [text(` Scopes: ${scopes.join(', ')}`)] : [])),
            ];
            const scheme = getResolvedRef(schemes?.[name]);
            if (scheme) {
                blocks.push({ type: 'code', value: JSON.stringify(scheme, null, 2) });
                blocks.push(...(await description(scheme.description)));
            }
            entriesNodes.push(item(...blocks));
        }
        nodes.push(list(entriesNodes));
    }
    return nodes;
};
