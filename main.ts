import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

const server = new McpServer({
	name: 'Weather Server',
	version: '1.0.0',
});

/** Tool definition **/
server.tool(
	'get-weather', // Unique identifier
	'Tool to get the weather of a certain city.', // Helps AI understand what the tool does
	// Define parameters
	{
		city: z.string().describe('The city to get the weather for.'),
	},
	// Code that runs when the tool is called
	async ({ city }) => {
		return {
			content: [
				{
					type: 'text',
					text: `The weather in ${city} is sunny!`,
				},
			],
		}
	},
);

/** Communication setup **/
// Uses terminal input/output for communication (perfect for local development)
const transport = new StdioServerTransport();
server.connect(transport);
