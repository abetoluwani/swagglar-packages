import { javaBody, quoteJava } from '../../../libs/java.js';
import { prepareRequest } from '../../../libs/prepare-request.js';
/** Generates a Unirest request including arbitrary methods and byte-preserving bodies. */
export const javaUnirest = {
    target: 'java',
    client: 'unirest',
    title: 'Unirest',
    generate(request, configuration) {
        const { url, method, headers, body } = prepareRequest(request, configuration);
        return [
            ...javaBody(body),
            `HttpResponse<String> response = Unirest.request(${quoteJava(method)}, ${quoteJava(url)})`,
            ...headers.map(({ name, value }) => `  .header(${quoteJava(name)}, ${quoteJava(value)})`),
            ...(body ? ['  .body(body.toByteArray())'] : []),
            '  .asString();',
            'System.out.println(response.getBody());',
        ].join('\n');
    },
};
